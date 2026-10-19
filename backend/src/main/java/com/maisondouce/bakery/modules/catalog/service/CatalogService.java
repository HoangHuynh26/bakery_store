package com.maisondouce.bakery.modules.catalog.service;

import com.maisondouce.bakery.modules.catalog.dto.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface CatalogService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryBySlug(String slug);
    Page<ProductSummaryDTO> getProducts(CatalogFilterCriteria criteria);
    ProductDetailDTO getProductBySlugOrId(String identifier);
    List<ProductSummaryDTO> getFeaturedProducts();
    List<String> getSearchSuggestions(String query);
    List<ProductSummaryDTO> getRelatedProducts(UUID productId, int limit);
}
