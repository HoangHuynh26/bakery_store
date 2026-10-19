package com.maisondouce.bakery.modules.loyalty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTierDTO {
    private String id;
    private String name;
    private BigDecimal minSpendRequired;
    private BigDecimal pointEarningRate;
    private String benefitsDescription;
}
