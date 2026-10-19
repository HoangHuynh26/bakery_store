package com.maisondouce.bakery.modules.analytics.dto;

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
public class LowStockProductDTO {
    private UUID id;
    private String nameVi;
    private String nameEn;
    private String sku;
    private String categoryName;
    private int currentStock;
    private BigDecimal basePrice;
    private String imageUrl;
}
