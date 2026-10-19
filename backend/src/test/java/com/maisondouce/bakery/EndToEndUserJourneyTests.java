package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.cart.dto.AddToCartRequest;
import com.maisondouce.bakery.modules.order.dto.CheckoutRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EndToEndUserJourneyTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Complete E2E Journey: Search -> Product Detail -> Add to Cart -> Checkout -> Admin Status Progression -> Customer Order Tracking")
    void testCompleteCustomerAndAdminE2EJourney() throws Exception {
        // Step 1: Guest visits catalog/homepage
        mockMvc.perform(get("/api/v1/products/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));

        // Step 2: Guest searches for 'tiramisu'
        MvcResult searchResult = mockMvc.perform(get("/api/v1/search?q=tiramisu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andReturn();

        JsonNode searchNode = objectMapper.readTree(searchResult.getResponse().getContentAsString());
        String productSlug = searchNode.path("data").get(0).path("slug").asText();
        UUID productId = UUID.fromString(searchNode.path("data").get(0).path("id").asText());

        // Step 3: Guest opens product detail page
        MvcResult detailResult = mockMvc.perform(get("/api/v1/products/" + productSlug))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is(productId.toString())))
                .andReturn();

        JsonNode detailNode = objectMapper.readTree(detailResult.getResponse().getContentAsString());
        UUID variantId = null;
        if (detailNode.path("data").path("variants").size() > 0) {
            variantId = UUID.fromString(detailNode.path("data").path("variants").get(0).path("id").asText());
        }

        // Step 4 & 5: Guest adds item to cart with a guest session token
        String guestSessionToken = UUID.randomUUID().toString();
        AddToCartRequest addReq = AddToCartRequest.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(2)
                .build();

        mockMvc.perform(post("/api/v1/carts/items")
                        .header("X-Session-Token", guestSessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(greaterThanOrEqualTo(1))));

        // Step 6: Guest checks out order
        CheckoutRequest checkoutReq = CheckoutRequest.builder()
                .recipientName("Tran Minh Anh")
                .recipientPhone("0988776655")
                .fulfillmentType("DELIVERY")
                .deliveryAddress("15 Le Duan, Ben Nghe, District 1, TP. HCM")
                .deliveryDate(LocalDate.now().plusDays(1))
                .deliveryTimeSlotId(UUID.fromString("d0000000-0000-0000-0000-000000000002"))
                .paymentMethod("COD")
                .customerNotes("Vui lòng giao đúng giờ sinh nhật")
                .guestSessionToken(guestSessionToken)
                .build();

        MvcResult checkoutResult = mockMvc.perform(post("/api/v1/checkout")
                        .header("X-Session-Token", guestSessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkoutReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.orderNumber", startsWith("MD-")))
                .andReturn();

        // Step 7: Backend created valid order
        JsonNode checkoutNode = objectMapper.readTree(checkoutResult.getResponse().getContentAsString());
        String orderNumber = checkoutNode.path("data").path("orderNumber").asText();
        UUID orderId = UUID.fromString(checkoutNode.path("data").path("id").asText());
        assertNotNull(orderNumber);

        // Step 8: Admin logs in, receives and views order
        MvcResult adminLoginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@maisondouce.vn",
                                "password", "Admin@MaisonDouce2026!"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        String adminToken = objectMapper.readTree(adminLoginResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/v1/admin/orders/" + orderId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderNumber", is(orderNumber)))
                .andExpect(jsonPath("$.data.recipientName", is("Tran Minh Anh")));

        // Step 9: Staff updates preparation status -> PREPARING -> BAKING
        mockMvc.perform(patch("/api/v1/admin/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "status", "PREPARING",
                                "comment", "Bếp trưởng đã nhận đơn và chuẩn bị mascarpone"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("PREPARING")));

        mockMvc.perform(patch("/api/v1/admin/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "status", "BAKING",
                                "comment", "Bánh đang được nướng và định hình trong khuôn lạnh"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("BAKING")));

        // Step 10: Customer tracks order in real-time by order number
        mockMvc.perform(get("/api/v1/orders/" + orderNumber + "/track"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderNumber", is(orderNumber)))
                .andExpect(jsonPath("$.data.currentStatus", is("BAKING")))
                .andExpect(jsonPath("$.data.timeline", hasSize(greaterThanOrEqualTo(2))));
    }
}
