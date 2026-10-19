package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.catalog.entity.Category;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.CategoryRepository;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.order.repository.OrderRepository;
import com.maisondouce.bakery.security.JwtTokenProvider;
import com.maisondouce.bakery.security.UserPrincipal;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        MvcResult adminResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@maisondouce.vn",
                                "password", "Admin@MaisonDouce2026!"
                        ))))
                .andExpect(status().isOk())
                .andReturn();
        adminToken = objectMapper.readTree(adminResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        MvcResult customerResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "customer@example.com",
                                "password", "Customer@2026!"
                        ))))
                .andExpect(status().isOk())
                .andReturn();
        customerToken = objectMapper.readTree(customerResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("Admin dashboard endpoint requires admin authority")
    void testAdminSecurity() throws Exception {
        // Unauthenticated -> 401 or 403
        mockMvc.perform(get("/api/v1/admin/dashboard/summary"))
                .andExpect(status().isForbidden());

        // Regular customer -> 403 Forbidden
        mockMvc.perform(get("/api/v1/admin/dashboard/summary")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Admin -> 200 OK
        mockMvc.perform(get("/api/v1/admin/dashboard/summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalOrdersCount").isNumber());
    }

    @Test
    @DisplayName("Admin can update product stock and toggle active status")
    void testProductManagement() throws Exception {
        Category category = categoryRepository.findAll().stream().findFirst().orElseGet(() -> {
            Category c = Category.builder()
                    .slug("test-cat")
                    .nameVi("Danh Mục Test")
                    .nameEn("Test Category")
                    .active(true)
                    .build();
            return categoryRepository.save(c);
        });

        Product product = new Product();
        product.setSku("TEST-PROD-" + System.currentTimeMillis() % 10000);
        product.setSlug("test-prod-" + System.currentTimeMillis() % 10000);
        product.setNameVi("Bánh Mousse Chanh Leo");
        product.setNameEn("Passionfruit Mousse");
        product.setCategory(category);
        product.setBasePrice(new BigDecimal("320000.00"));
        product.setStockQuantity(15);
        product.setActive(true);
        Product saved = productRepository.save(product);

        // Update stock
        mockMvc.perform(patch("/api/v1/admin/products/" + saved.getId() + "/stock")
                        .param("quantity", "28")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.stockQuantity").value(28));

        // Toggle status
        mockMvc.perform(patch("/api/v1/admin/products/" + saved.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.active").value(false));
    }

    @Test
    @DisplayName("Admin can view orders and update preparation status")
    void testOrderManagement() throws Exception {
        Order order = new Order();
        order.setOrderNumber("MD-TEST-" + System.currentTimeMillis() % 10000);
        order.setStatus("CONFIRMED");
        order.setPaymentStatus("PENDING");
        order.setPaymentMethod("COD");
        order.setFulfillmentType("DELIVERY");
        order.setSubtotal(new BigDecimal("400000.00"));
        order.setTotalAmount(new BigDecimal("400000.00"));
        order.setRecipientName("Tran Thu Huong");
        order.setRecipientPhone("0987654321");
        order.setDeliveryDate(LocalDate.now());
        Order savedOrder = orderRepository.save(order);

        // Update status to PREPARING
        mockMvc.perform(patch("/api/v1/admin/orders/" + savedOrder.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "status", "PREPARING",
                                "comment", "Bếp bắt đầu đánh trứng và trộn bột"
                        )))
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PREPARING"));

        // Get Kitchen Queue
        mockMvc.perform(get("/api/v1/admin/orders/kitchen-queue")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
