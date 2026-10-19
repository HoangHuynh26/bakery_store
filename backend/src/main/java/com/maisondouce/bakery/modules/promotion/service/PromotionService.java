package com.maisondouce.bakery.modules.promotion.service;

import com.maisondouce.bakery.modules.promotion.dto.CouponValidationResponse;

import java.math.BigDecimal;

public interface PromotionService {
    CouponValidationResponse validateCoupon(String code, BigDecimal cartSubtotal);
}
