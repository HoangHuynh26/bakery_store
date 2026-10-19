package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.ProductVariant;
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
public class ProductVariantDTO {
    private UUID id;
    private String sku;
    private String nameEn;
    private String nameVi;
    private Integer sizeDiameterCm;
    private String servingCount;
    private BigDecimal priceAdjustment;
    private int stockQuantity;
    private boolean active;

    public static ProductVariantDTO fromEntity(ProductVariant variant) {
        if (variant == null) return null;
        return ProductVariantDTO.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .nameEn(variant.getNameEn())
                .nameVi(variant.getNameVi())
                .sizeDiameterCm(variant.getSizeDiameterCm())
                .servingCount(variant.getServingCount())
                .priceAdjustment(variant.getPriceAdjustment())
                .stockQuantity(variant.getStockQuantity())
                .active(variant.isActive())
                .build();
    }
}
