package com.maisondouce.bakery.modules.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogFilterCriteria {
    private String category;
    private String keyword;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String dietaryTag;
    private Boolean featuredOnly;
    private Boolean inStockOnly;
    private String sortBy; // price_asc, price_desc, newest, popularity, name_asc
    
    @Builder.Default
    private int page = 0;
    
    @Builder.Default
    private int size = 12;
}
