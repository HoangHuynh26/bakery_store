package com.maisondouce.bakery.modules.promotion.service.impl;

import com.maisondouce.bakery.modules.promotion.dto.CouponValidationResponse;
import com.maisondouce.bakery.modules.promotion.entity.Coupon;
import com.maisondouce.bakery.modules.promotion.repository.CouponRepository;
import com.maisondouce.bakery.modules.promotion.service.PromotionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final CouponRepository couponRepository;

    public PromotionServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(String code, BigDecimal cartSubtotal) {
        if (code == null || code.isBlank()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Vui lòng nhập mã giảm giá")
                    .build();
        }

        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCase(code.trim());
        if (opt.isEmpty()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Mã ưu đãi không tồn tại trên hệ thống")
                    .build();
        }

        Coupon coupon = opt.get();
        if (!coupon.isActive()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Mã ưu đãi đã tạm ngừng áp dụng")
                    .build();
        }

        Instant now = Instant.now();
        if (coupon.getStartDate() != null && coupon.getStartDate().isAfter(now)) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Chương trình ưu đãi chưa bắt đầu")
                    .build();
        }

        if (coupon.getEndDate() != null && coupon.getEndDate().isBefore(now)) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Mã ưu đãi đã hết hạn sử dụng")
                    .build();
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Mã ưu đãi đã đạt giới hạn lượt sử dụng")
                    .build();
        }

        if (cartSubtotal != null && cartSubtotal.compareTo(coupon.getMinSpend()) < 0) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message(String.format("Đơn hàng chưa đạt giá trị tối thiểu %,.0f₫ để áp dụng mã", coupon.getMinSpend()))
                    .build();
        }

        BigDecimal discount = BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = cartSubtotal.multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if ("FIXED_AMOUNT".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = coupon.getDiscountValue().min(cartSubtotal);
        } else if ("FREE_DELIVERY".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = new BigDecimal("30000.00");
        }

        return CouponValidationResponse.builder()
                .valid(true)
                .couponId(coupon.getId())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .calculatedDiscount(discount)
                .message("Áp dụng mã ưu đãi thành công!")
                .build();
    }
}
