package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private UUID id;
    private String sku;
    private String slug;
    private String nameEn;
    private String nameVi;
    private String descriptionEn;
    private String descriptionVi;
    private BigDecimal basePrice;
    private BigDecimal promotionalPrice;
    private int stockQuantity;
    private int leadTimeHours;
    private int shelfLifeDays;
    private String storageInstructions;
    private String ingredientsEn;
    private String ingredientsVi;
    private String dietaryTags;
    private boolean featured;
    private boolean inStock;
    private long viewCount;

    private CategoryDTO category;
    private List<ProductImageDTO> images;
    private List<ProductVariantDTO> variants;
    private Set<AllergenDTO> allergens;

    public static ProductDetailDTO fromEntity(Product product) {
        if (product == null) return null;

        return ProductDetailDTO.builder()
                .id(product.getId())
                .sku(product.getSku())
                .slug(product.getSlug())
                .nameEn(product.getNameEn())
                .nameVi(product.getNameVi())
                .descriptionEn(product.getDescriptionEn())
                .descriptionVi(product.getDescriptionVi())
                .basePrice(product.getBasePrice())
                .promotionalPrice(product.getPromotionalPrice())
                .stockQuantity(product.getStockQuantity())
                .leadTimeHours(product.getLeadTimeHours())
                .shelfLifeDays(product.getShelfLifeDays())
                .storageInstructions(product.getStorageInstructions())
                .ingredientsEn(product.getIngredientsEn())
                .ingredientsVi(product.getIngredientsVi())
                .dietaryTags(product.getDietaryTags())
                .featured(product.isFeatured())
                .inStock(product.getStockQuantity() > 0)
                .viewCount(product.getViewCount())
                .category(CategoryDTO.fromEntity(product.getCategory()))
                .images(product.getImages() != null ? product.getImages().stream().map(ProductImageDTO::fromEntity).collect(Collectors.toList()) : Collections.emptyList())
                .variants(product.getVariants() != null ? product.getVariants().stream().map(ProductVariantDTO::fromEntity).collect(Collectors.toList()) : Collections.emptyList())
                .allergens(product.getAllergens() != null ? product.getAllergens().stream().map(AllergenDTO::fromEntity).collect(Collectors.toSet()) : Collections.emptySet())
                .build();
    }
}
