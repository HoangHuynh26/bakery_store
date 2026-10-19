package com.maisondouce.bakery.modules.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminVariantRequest {
    private UUID id;
    private String nameEn;
    private String nameVi;
    private String sku;
    private BigDecimal priceAdjustment = BigDecimal.ZERO;
    private int stockQuantity = 10;
    private String size;
    private String flavor;
}
