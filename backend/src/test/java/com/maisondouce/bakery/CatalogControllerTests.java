package com.maisondouce.bakery;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CatalogControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/categories returns 16 seeded categories")
    void testGetCategories() throws Exception {
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(16))))
                .andExpect(jsonPath("$.data[0].slug").exists())
                .andExpect(jsonPath("$.data[0].nameVi").exists())
                .andExpect(jsonPath("$.data[0].nameEn").exists());
    }

    @Test
    @DisplayName("GET /api/v1/categories/birthday-cakes returns Birthday Cakes category")
    void testGetCategoryBySlug() throws Exception {
        mockMvc.perform(get("/api/v1/categories/birthday-cakes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("birthday-cakes"))
                .andExpect(jsonPath("$.data.nameEn").value("Birthday Cakes"))
                .andExpect(jsonPath("$.data.nameVi").value("Bánh Kem Sinh Nhật"));
    }

    @Test
    @DisplayName("GET /api/v1/products returns paginated products with seed items")
    void testGetProducts() throws Exception {
        mockMvc.perform(get("/api/v1/products?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.totalElements", greaterThan(15)));
    }

    @Test
    @DisplayName("GET /api/v1/products filtered by category=tiramisu")
    void testFilterByCategory() throws Exception {
        mockMvc.perform(get("/api/v1/products?category=tiramisu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].categorySlug").value("tiramisu"));
    }

    @Test
    @DisplayName("GET /api/v1/products/fraisier-vanilla-strawberry-cake returns full product details")
    void testGetProductDetail() throws Exception {
        mockMvc.perform(get("/api/v1/products/fraisier-vanilla-strawberry-cake"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("fraisier-vanilla-strawberry-cake"))
                .andExpect(jsonPath("$.data.sku").value("CAKE-BDAY-01"))
                .andExpect(jsonPath("$.data.variants", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.data.images", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.allergens", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/v1/products/non-existent-cake returns 404 NOT FOUND")
    void testProductNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/products/non-existent-cake"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("GET /api/v1/products/featured returns signature best-sellers")
    void testGetFeaturedProducts() throws Exception {
        mockMvc.perform(get("/api/v1/products/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].featured").value(true));
    }
}
