package com.maisondouce.bakery.modules.loyalty.repository;

import com.maisondouce.bakery.modules.loyalty.entity.LoyaltyTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyTierRepository extends JpaRepository<LoyaltyTier, String> {
    List<LoyaltyTier> findAllByOrderByMinSpendRequiredAsc();
}
