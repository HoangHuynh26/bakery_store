package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDTO {
    private UUID id;
    private String sku;
    private String slug;
    private String nameEn;
    private String nameVi;
    private String categorySlug;
    private String categoryNameVi;
    private String categoryNameEn;
    private BigDecimal basePrice;
    private BigDecimal promotionalPrice;
    private String thumbnailUrl;
    private String dietaryTags;
    private int leadTimeHours;
    private int stockQuantity;
    private boolean featured;
    private boolean inStock;
    private boolean active;

    public static ProductSummaryDTO fromEntity(Product product) {
        if (product == null) return null;

        String thumbnail = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            thumbnail = product.getImages().stream()
                    .filter(img -> img.isThumbnail())
                    .findFirst()
                    .map(img -> img.getImageUrl())
                    .orElse(product.getImages().get(0).getImageUrl());
        }

        return ProductSummaryDTO.builder()
                .id(product.getId())
                .sku(product.getSku())
                .slug(product.getSlug())
                .nameEn(product.getNameEn())
                .nameVi(product.getNameVi())
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .categoryNameVi(product.getCategory() != null ? product.getCategory().getNameVi() : null)
                .categoryNameEn(product.getCategory() != null ? product.getCategory().getNameEn() : null)
                .basePrice(product.getBasePrice())
                .promotionalPrice(product.getPromotionalPrice())
                .thumbnailUrl(thumbnail)
                .dietaryTags(product.getDietaryTags())
                .leadTimeHours(product.getLeadTimeHours())
                .stockQuantity(product.getStockQuantity())
                .featured(product.isFeatured())
                .inStock(product.getStockQuantity() > 0)
                .active(product.isActive())
                .build();
    }
}
