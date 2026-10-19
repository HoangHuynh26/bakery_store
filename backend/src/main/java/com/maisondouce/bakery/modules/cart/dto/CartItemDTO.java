package com.maisondouce.bakery.modules.cart.dto;

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
public class CartItemDTO {
    private UUID id;
    private UUID productId;
    private String productSlug;
    private String nameEn;
    private String nameVi;
    private String imageUrl;
    private UUID variantId;
    private String variantName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private String customizationNotes;
    private boolean inStock;
    private int maxStock;
}
