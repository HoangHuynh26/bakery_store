package com.maisondouce.bakery.modules.promotion.repository;

import com.maisondouce.bakery.modules.promotion.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    Optional<Coupon> findByCodeIgnoreCaseAndActiveTrue(String code);
    Optional<Coupon> findByCodeIgnoreCase(String code);
}
