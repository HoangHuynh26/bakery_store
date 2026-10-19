package com.maisondouce.bakery.modules.promotion.dto;

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
public class CouponValidationResponse {
    private boolean valid;
    private UUID couponId;
    private String code;
    private String description;
    private String discountType; // PERCENTAGE, FIXED_AMOUNT, FREE_DELIVERY
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscount;
    private String message;
}
