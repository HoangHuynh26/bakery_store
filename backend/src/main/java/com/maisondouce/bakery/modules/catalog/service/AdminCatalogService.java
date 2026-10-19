package com.maisondouce.bakery.modules.catalog.service;

import com.maisondouce.bakery.modules.catalog.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminCatalogService {
    Page<ProductDetailDTO> getAdminProducts(String search, UUID categoryId, Boolean active, Pageable pageable);
    ProductDetailDTO createProduct(AdminProductRequest request);
    ProductDetailDTO updateProduct(UUID productId, AdminProductRequest request);
    ProductDetailDTO toggleProductStatus(UUID productId);
    ProductDetailDTO updateStock(UUID productId, int newStock);
    void deleteProduct(UUID productId);

    CategoryDTO createCategory(AdminCategoryRequest request);
    CategoryDTO updateCategory(UUID categoryId, AdminCategoryRequest request);
    void deleteCategory(UUID categoryId);
}
