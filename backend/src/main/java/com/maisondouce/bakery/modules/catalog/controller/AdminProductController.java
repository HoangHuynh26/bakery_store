package com.maisondouce.bakery.modules.catalog.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.catalog.dto.AdminProductRequest;
import com.maisondouce.bakery.modules.catalog.dto.ProductDetailDTO;
import com.maisondouce.bakery.modules.catalog.service.AdminCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin Products", description = "Product CRUD, stock management, and status controls")
public class AdminProductController {

    private final AdminCatalogService adminCatalogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get paginated list of products for admin")
    public ResponseEntity<ApiResponse<Page<ProductDetailDTO>>> getAdminProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<ProductDetailDTO> products = adminCatalogService.getAdminProducts(search, categoryId, active, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Tải danh sách sản phẩm thành công.", products));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create new bakery product")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> createProduct(@Valid @RequestBody AdminProductRequest request) {
        ProductDetailDTO product = adminCatalogService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo sản phẩm mới thành công.", product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update product details")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody AdminProductRequest request) {
        ProductDetailDTO product = adminCatalogService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công.", product));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Toggle active/inactive status")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> toggleProductStatus(@PathVariable UUID id) {
        ProductDetailDTO product = adminCatalogService.toggleProductStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái kinh doanh thành công.", product));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Quick adjust stock quantity")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> updateStock(
            @PathVariable UUID id,
            @RequestParam int quantity) {
        ProductDetailDTO product = adminCatalogService.updateStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tồn kho thành công.", product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Archive product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        adminCatalogService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("Lưu trữ sản phẩm thành công.", null));
    }
}
