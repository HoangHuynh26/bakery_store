package com.maisondouce.bakery.modules.promotion.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.promotion.dto.CouponValidationResponse;
import com.maisondouce.bakery.modules.promotion.dto.ValidateCouponRequest;
import com.maisondouce.bakery.modules.promotion.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/coupons")
@Tag(name = "Coupons & Promotions", description = "Coupon validation, discounts, campaigns")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate a promotional coupon code against current subtotal")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(
            @Valid @RequestBody ValidateCouponRequest request) {
        CouponValidationResponse response = promotionService.validateCoupon(request.getCode(), request.getCartSubtotal());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
