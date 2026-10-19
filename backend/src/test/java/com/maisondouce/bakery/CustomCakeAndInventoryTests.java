package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeCreateRequest;
import com.maisondouce.bakery.modules.customcake.dto.QuotationSubmitRequest;
import com.maisondouce.bakery.modules.inventory.dto.StockAdjustmentRequest;
import com.maisondouce.bakery.modules.inventory.entity.Ingredient;
import com.maisondouce.bakery.modules.inventory.repository.IngredientRepository;
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
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CustomCakeAndInventoryTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IngredientRepository ingredientRepository;

    private String adminToken;

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
    }

    @Test
    @DisplayName("Custom cake submission, admin quotation, and customer acceptance workflow")
    void testCustomCakeWorkflow() throws Exception {
        // 1. Customer submits a bespoke cake request
        CustomCakeCreateRequest createReq = CustomCakeCreateRequest.builder()
                .customerName("Nguyễn Mai Anh")
                .customerPhone("0912345678")
                .customerEmail("maianh@example.com")
                .cakeType("Mousse Nghệ Thuật")
                .shape("Hình Trái Tim (Heart)")
                .sizeServings("18cm (6-8 phần)")
                .flavor("Sô-cô-la Valrhona 70%")
                .filling("Curd Chanh Leo Tươi")
                .frosting("Gương Kính Tráng Trắng (Mirror Glaze)")
                .colorTheme("Hồng Pastel & Vàng Gold")
                .pipingMessage("Joyeux Anniversaire Mai Anh!")
                .specialInstructions("Vui lòng trang trí thêm cánh hoa hồng ăn được và lá vàng 24k")
                .preferredDate(LocalDate.now().plusDays(3))
                .preferredTime("14:00 - 16:00")
                .build();

        MvcResult submitResult = mockMvc.perform(post("/api/v1/custom-cakes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.requestNumber").exists())
                .andExpect(jsonPath("$.data.status").value("SUBMITTED"))
                .andReturn();

        String requestNumber = objectMapper.readTree(submitResult.getResponse().getContentAsString())
                .get("data").get("requestNumber").asText();
        String requestIdStr = objectMapper.readTree(submitResult.getResponse().getContentAsString())
                .get("data").get("id").asText();
        UUID requestId = UUID.fromString(requestIdStr);

        // 2. Customer can query by request number
        mockMvc.perform(get("/api/v1/custom-cakes/{requestNumber}", requestNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.customerName").value("Nguyễn Mai Anh"))
                .andExpect(jsonPath("$.data.cakeType").value("Mousse Nghệ Thuật"));

        // 3. Admin views requests list
        mockMvc.perform(get("/api/v1/admin/custom-cakes")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 4. Admin submits price quotation
        QuotationSubmitRequest quotation = QuotationSubmitRequest.builder()
                .quotationAmount(BigDecimal.valueOf(850000.00))
                .adminNotes("Đã bao gồm hộp quà cao cấp, hoa hồng sấy thăng hoa và nến số")
                .build();

        mockMvc.perform(patch("/api/v1/admin/custom-cakes/{id}/quotation", requestId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(quotation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("QUOTED"))
                .andExpect(jsonPath("$.data.quotationAmount").value(850000.00));

        // 5. Customer accepts the quotation
        mockMvc.perform(patch("/api/v1/custom-cakes/{id}/accept", requestId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACCEPTED"));
    }

    @Test
    @DisplayName("Raw ingredients inventory listing and stock adjustment ledger")
    void testInventoryAdjustment() throws Exception {
        // Find existing ingredient
        Ingredient butter = ingredientRepository.findByCode("ING-BUTTER-FR")
                .orElseThrow(() -> new AssertionError("Seed ingredient ING-BUTTER-FR not found"));

        BigDecimal initialStock = butter.getCurrentStock();

        // Admin adds +15.5 kg inbound butter
        StockAdjustmentRequest inboundReq = StockAdjustmentRequest.builder()
                .ingredientId(butter.getId())
                .movementType("INBOUND")
                .quantity(BigDecimal.valueOf(15.500))
                .reason("Nhập kho lô bơ Pháp mới từ nhà phân phối")
                .build();

        mockMvc.perform(post("/api/v1/admin/inventory/adjust")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inboundReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.currentStock").value(61.0));

        // Admin lists all ingredients
        mockMvc.perform(get("/api/v1/admin/inventory/ingredients")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }
}
