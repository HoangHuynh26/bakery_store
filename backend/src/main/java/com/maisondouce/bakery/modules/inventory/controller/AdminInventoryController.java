package com.maisondouce.bakery.modules.inventory.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.inventory.dto.IngredientDTO;
import com.maisondouce.bakery.modules.inventory.dto.StockAdjustmentRequest;
import com.maisondouce.bakery.modules.inventory.entity.StockMovement;
import com.maisondouce.bakery.modules.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'STAFF')")
@Tag(name = "Admin Inventory", description = "Raw Ingredients & Bakery Stock Management")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/ingredients")
    @Operation(summary = "List all raw bakery ingredients with current stock levels")
    public ResponseEntity<ApiResponse<List<IngredientDTO>>> getAllIngredients() {
        List<IngredientDTO> list = inventoryService.getAllIngredients();
        return ResponseEntity.ok(ApiResponse.success("Danh sách nguyên liệu làm bánh", list));
    }

    @PostMapping("/adjust")
    @Operation(summary = "Adjust ingredient inventory (Inbound, deduction, spoilage, or manual set)")
    public ResponseEntity<ApiResponse<IngredientDTO>> adjustStock(
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        IngredientDTO updated = inventoryService.adjustStock(request);
        return ResponseEntity.ok(ApiResponse.success("Điều chỉnh tồn kho nguyên liệu thành công!", updated));
    }

    @GetMapping("/movements")
    @Operation(summary = "Get recent stock ledger movements")
    public ResponseEntity<ApiResponse<List<StockMovement>>> getMovements() {
        List<StockMovement> list = inventoryService.getRecentMovements();
        return ResponseEntity.ok(ApiResponse.success("Lịch sử biến động kho nguyên liệu", list));
    }
}
