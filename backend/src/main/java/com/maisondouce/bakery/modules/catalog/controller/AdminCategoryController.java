package com.maisondouce.bakery.modules.catalog.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.catalog.dto.AdminCategoryRequest;
import com.maisondouce.bakery.modules.catalog.dto.CategoryDTO;
import com.maisondouce.bakery.modules.catalog.service.AdminCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Admin Categories", description = "Category creation and management")
public class AdminCategoryController {

    private final AdminCatalogService adminCatalogService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create new bakery category")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody AdminCategoryRequest request) {
        CategoryDTO category = adminCatalogService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo danh mục mới thành công.", category));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update category")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody AdminCategoryRequest request) {
        CategoryDTO category = adminCatalogService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật danh mục thành công.", category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Deactivate category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        adminCatalogService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("Xóa danh mục thành công.", null));
    }
}
