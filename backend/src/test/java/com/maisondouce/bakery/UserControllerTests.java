package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.auth.dto.LoginRequest;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.user.dto.AddressRequest;
import com.maisondouce.bakery.modules.user.dto.UpdateProfileRequest;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest loginReq = LoginRequest.builder()
                .email("customer@example.com")
                .password("Customer@2026!")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        customerToken = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("Should retrieve customer profile and update profile")
    void testGetAndUpdateProfile() throws Exception {
        mockMvc.perform(get("/api/v1/users/profile")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("customer@example.com"));

        UpdateProfileRequest updateReq = UpdateProfileRequest.builder()
                .fullName("Margaux de Valois")
                .phoneNumber("+84918888999")
                .build();

        mockMvc.perform(put("/api/v1/users/profile")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName").value("Margaux de Valois"));
    }

    @Test
    @DisplayName("Should add, list, and set default customer delivery address")
    void testCustomerAddressesWorkflow() throws Exception {
        AddressRequest addressReq = AddressRequest.builder()
                .recipientName("Margaux de Valois")
                .phoneNumber("+84918888999")
                .streetAddress("124 Le Loi Boulevard")
                .ward("Ben Nghe")
                .district("District 1")
                .city("Ho Chi Minh City")
                .defaultAddress(true)
                .deliveryNote("Leave with reception on 3rd floor")
                .build();

        MvcResult addResult = mockMvc.perform(post("/api/v1/users/addresses")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recipientName").value("Margaux de Valois"))
                .andExpect(jsonPath("$.data.defaultAddress").value(true))
                .andReturn();

        String addressId = objectMapper.readTree(addResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        // Get addresses list
        mockMvc.perform(get("/api/v1/users/addresses")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        // Clean up
        mockMvc.perform(delete("/api/v1/users/addresses/" + addressId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should toggle product in and out of customer wishlist")
    void testWishlistToggle() throws Exception {
        Product product = productRepository.findAll().stream().findFirst().orElseThrow();

        // Add to wishlist
        mockMvc.perform(post("/api/v1/wishlists/" + product.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.added").value(true));

        // Verify in wishlist
        mockMvc.perform(get("/api/v1/wishlists")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        // Toggle again to remove
        mockMvc.perform(post("/api/v1/wishlists/" + product.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.added").value(false));
    }
}
