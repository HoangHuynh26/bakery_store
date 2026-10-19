package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.cart.dto.AddToCartRequest;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.order.dto.CheckoutRequest;
import com.maisondouce.bakery.modules.promotion.dto.ValidateCouponRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Should successfully execute guest checkout with COD and reserve product stock")
    void testSuccessfulCheckout() throws Exception {
        String sessionToken = "checkout_session_" + UUID.randomUUID();
        Product product = productRepository.findAll().stream().findFirst().orElseThrow();
        int initialStock = product.getStockQuantity();

        // 1. Add item to cart
        AddToCartRequest addReq = AddToCartRequest.builder()
                .productId(product.getId())
                .quantity(2)
                .customizationNotes("Ghi 'Chuc mung sinh nhat'")
                .build();

        mockMvc.perform(post("/api/v1/carts/items")
                        .header("X-Session-Token", sessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk());

        // 2. Submit Checkout
        CheckoutRequest checkoutReq = CheckoutRequest.builder()
                .guestSessionToken(sessionToken)
                .recipientName("Nguyen Thi Thao")
                .recipientPhone("0908765432")
                .recipientEmail("thao.nguyen@example.com")
                .fulfillmentType("DELIVERY")
                .deliveryAddress("45 Nguyen Hue, Ben Nghe, District 1")
                .deliveryDate(LocalDate.now().plusDays(1))
                .paymentMethod("COD")
                .customerNotes("Goi truoc 15 phut")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkoutReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber", startsWith("MD-")))
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andReturn();

        String orderNumber = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("orderNumber").asText();

        // 3. Verify stock was deducted
        Product updatedProduct = productRepository.findById(product.getId()).orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(initialStock - 2, updatedProduct.getStockQuantity());

        // 4. Verify order tracking timeline
        mockMvc.perform(get("/api/v1/orders/" + orderNumber + "/track"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.currentStatus").value("CONFIRMED"))
                .andExpect(jsonPath("$.data.timeline", hasSize(greaterThan(3))));
    }

    @Test
    @DisplayName("Should reject checkout when cart is empty")
    void testCheckoutEmptyCart() throws Exception {
        String sessionToken = "empty_session_" + UUID.randomUUID();

        CheckoutRequest checkoutReq = CheckoutRequest.builder()
                .guestSessionToken(sessionToken)
                .recipientName("Test Customer")
                .recipientPhone("0901112233")
                .fulfillmentType("DELIVERY")
                .deliveryAddress("123 Street")
                .deliveryDate(LocalDate.now().plusDays(1))
                .paymentMethod("COD")
                .build();

        mockMvc.perform(post("/api/v1/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkoutReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("BAD_REQUEST"));
    }

    @Test
    @DisplayName("Should validate active promotional coupon")
    void testValidateCoupon() throws Exception {
        ValidateCouponRequest req = ValidateCouponRequest.builder()
                .code("WELCOME10")
                .cartSubtotal(new BigDecimal("500000.00"))
                .build();

        mockMvc.perform(post("/api/v1/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.valid").value(true))
                .andExpect(jsonPath("$.data.calculatedDiscount").value(50000.0));
    }

    @Test
    @DisplayName("Should fetch delivery zones and time slots")
    void testGetDeliveryZonesAndSlots() throws Exception {
        mockMvc.perform(get("/api/v1/delivery/zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        mockMvc.perform(get("/api/v1/delivery/slots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }
}
