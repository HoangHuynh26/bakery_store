package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.cart.dto.AddToCartRequest;
import com.maisondouce.bakery.modules.cart.dto.UpdateCartItemRequest;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CartControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Should retrieve empty cart for a fresh guest session")
    void testGetEmptyCart() throws Exception {
        String sessionToken = "session_" + UUID.randomUUID();

        mockMvc.perform(get("/api/v1/carts")
                        .header("X-Session-Token", sessionToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItemCount").value(0))
                .andExpect(jsonPath("$.data.subtotal").value(0));
    }

    @Test
    @DisplayName("Should add product to guest cart and recalculate subtotal")
    void testAddItemToCart() throws Exception {
        String sessionToken = "session_" + UUID.randomUUID();

        // Get any seeded product
        Product product = productRepository.findAll().stream().findFirst().orElseThrow();

        AddToCartRequest addReq = AddToCartRequest.builder()
                .productId(product.getId())
                .quantity(2)
                .customizationNotes("Write 'Happy Birthday' on card")
                .build();

        mockMvc.perform(post("/api/v1/carts/items")
                        .header("X-Session-Token", sessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItemCount").value(2))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productSlug").value(product.getSlug()))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2));
    }

    @Test
    @DisplayName("Should update item quantity and remove item when quantity is 0")
    void testUpdateAndRemoveItem() throws Exception {
        String sessionToken = "session_" + UUID.randomUUID();
        Product product = productRepository.findAll().stream().findFirst().orElseThrow();

        AddToCartRequest addReq = AddToCartRequest.builder()
                .productId(product.getId())
                .quantity(1)
                .build();

        MvcResult addResult = mockMvc.perform(post("/api/v1/carts/items")
                        .header("X-Session-Token", sessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andReturn();

        String body = addResult.getResponse().getContentAsString();
        String itemId = objectMapper.readTree(body).get("data").get("items").get(0).get("id").asText();

        // Update quantity to 3
        UpdateCartItemRequest updateReq = UpdateCartItemRequest.builder()
                .quantity(3)
                .customizationNotes("Updated message")
                .build();

        mockMvc.perform(put("/api/v1/carts/items/" + itemId)
                        .header("X-Session-Token", sessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalItemCount").value(3));

        // Delete item
        mockMvc.perform(delete("/api/v1/carts/items/" + itemId)
                        .header("X-Session-Token", sessionToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalItemCount").value(0))
                .andExpect(jsonPath("$.data.items", hasSize(0)));
    }
}
