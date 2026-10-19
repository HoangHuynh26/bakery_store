package com.maisondouce.bakery.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemDTO {
    private UUID id;
    private UUID productId;
    private String productSlug;
    private String nameEn;
    private String nameVi;
    private BigDecimal basePrice;
    private BigDecimal promotionalPrice;
    private String primaryImageUrl;
    private String categorySlug;
    private String categoryNameEn;
    private String categoryNameVi;
    private boolean inStock;
    private Instant addedAt;
}
