package com.maisondouce.bakery.modules.catalog.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.common.dto.PagedResponse;
import com.maisondouce.bakery.modules.catalog.dto.*;
import com.maisondouce.bakery.modules.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Catalog", description = "Public bakery product catalog, categories, and live search")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/categories")
    @Operation(summary = "List all active bakery categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        List<CategoryDTO> categories = catalogService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categories));
    }

    @GetMapping("/categories/{slug}")
    @Operation(summary = "Get category details by slug")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryBySlug(@PathVariable String slug) {
        CategoryDTO category = catalogService.getCategoryBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @GetMapping({"/products", "/search"})
    @Operation(summary = "Filter, search, sort, and paginate bakery products")
    public ResponseEntity<PagedResponse<ProductSummaryDTO>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String dietaryTag,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        CatalogFilterCriteria criteria = CatalogFilterCriteria.builder()
                .category(category)
                .keyword(q)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .dietaryTag(dietaryTag)
                .featuredOnly(featured)
                .inStockOnly(inStock)
                .sortBy(sort)
                .page(page)
                .size(size)
                .build();

        Page<ProductSummaryDTO> productsPage = catalogService.getProducts(criteria);
        return ResponseEntity.ok(PagedResponse.fromPage(productsPage, "Products retrieved"));
    }

    @GetMapping("/products/{identifier}")
    @Operation(summary = "Get full product specifications, variants, allergens, and gallery by slug or UUID")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> getProductByIdentifier(@PathVariable String identifier) {
        ProductDetailDTO product = catalogService.getProductBySlugOrId(identifier);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/products/featured")
    @Operation(summary = "Get signature best-sellers and featured artisanal creations")
    public ResponseEntity<ApiResponse<List<ProductSummaryDTO>>> getFeaturedProducts() {
        List<ProductSummaryDTO> featured = catalogService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success("Featured products retrieved", featured));
    }

    @GetMapping("/products/{id}/related")
    @Operation(summary = "Get related pastry suggestions")
    public ResponseEntity<ApiResponse<List<ProductSummaryDTO>>> getRelatedProducts(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "4") int limit) {
        List<ProductSummaryDTO> related = catalogService.getRelatedProducts(id, limit);
        return ResponseEntity.ok(ApiResponse.success(related));
    }

    @GetMapping("/products/search/suggestions")
    @Operation(summary = "Debounced autocomplete search suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSearchSuggestions(@RequestParam String q) {
        List<String> suggestions = catalogService.getSearchSuggestions(q);
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }
}
