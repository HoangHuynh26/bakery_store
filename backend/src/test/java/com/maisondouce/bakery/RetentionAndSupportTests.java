package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.review.dto.CreateReviewRequest;
import com.maisondouce.bakery.modules.support.dto.CreateTicketRequest;
import com.maisondouce.bakery.modules.support.dto.FaqChatRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RetentionAndSupportTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        MvcResult customerResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "customer@example.com",
                                "password", "Customer@2026!"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        customerToken = objectMapper.readTree(customerResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();
    }

    @Test
    @DisplayName("Should fetch seeded product reviews and rating summary")
    void testGetProductReviews() throws Exception {
        // Product Fraisier Royal id: b0000001-0000-0000-0000-000000000001
        UUID productId = UUID.fromString("b0000001-0000-0000-0000-000000000001");

        mockMvc.perform(get("/api/v1/reviews/product/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalReviews", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.averageRating", is(5.0)))
                .andExpect(jsonPath("$.data.reviews[0].verifiedPurchase", is(true)))
                .andExpect(jsonPath("$.data.reviews[0].comment", containsString("Fraisier")));
    }

    @Test
    @DisplayName("Should fetch loyalty tiers and current user loyalty account")
    void testLoyaltyTiersAndAccount() throws Exception {
        mockMvc.perform(get("/api/v1/loyalty/tiers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(4)))
                .andExpect(jsonPath("$.data[0].id", is("BRONZE")))
                .andExpect(jsonPath("$.data[3].id", is("PLATINUM")));

        mockMvc.perform(get("/api/v1/loyalty/me")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pointsBalance", is(150)))
                .andExpect(jsonPath("$.data.currentTier.id", is("SILVER")));
    }

    @Test
    @DisplayName("Should query Boutique Concierge rule engine for delivery, storage, and order tracking")
    void testFaqConciergeChat() throws Exception {
        // Test delivery question
        FaqChatRequest deliveryReq = new FaqChatRequest();
        deliveryReq.setMessage("Cho mình hỏi phí ship và giao hàng qua Quận 1 như thế nào?");

        mockMvc.perform(post("/api/v1/support/faq-chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deliveryReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.matchedCategory", is("DELIVERY")))
                .andExpect(jsonPath("$.data.reply", containsString("500.000₫")));

        // Test storage question
        FaqChatRequest storageReq = new FaqChatRequest();
        storageReq.setMessage("Bánh kem bảo quản trong tủ lạnh được bao lâu vậy tiệm?");

        mockMvc.perform(post("/api/v1/support/faq-chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(storageReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.matchedCategory", is("STORAGE")))
                .andExpect(jsonPath("$.data.reply", containsString("48 giờ")));
    }

    @Test
    @DisplayName("Should submit support ticket and retrieve customer ticket history")
    void testSupportTickets() throws Exception {
        CreateTicketRequest request = CreateTicketRequest.builder()
                .subject("Yêu cầu tư vấn bánh kem tiệc kỷ niệm")
                .category("CUSTOM_CAKE")
                .message("Mình muốn nhờ thợ làm bánh tư vấn mẫu bánh hoa hồng pastel cho 20 người.")
                .build();

        mockMvc.perform(post("/api/v1/support/tickets")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.ticketNumber", startsWith("TK-")))
                .andExpect(jsonPath("$.data.subject", is("Yêu cầu tư vấn bánh kem tiệc kỷ niệm")));

        mockMvc.perform(get("/api/v1/support/my-tickets")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }
}
