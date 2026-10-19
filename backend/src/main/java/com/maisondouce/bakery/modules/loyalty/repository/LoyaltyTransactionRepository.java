package com.maisondouce.bakery.modules.loyalty.repository;

import com.maisondouce.bakery.modules.loyalty.entity.LoyaltyTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, UUID> {
    List<LoyaltyTransaction> findByLoyaltyAccountIdOrderByCreatedAtDesc(UUID accountId);

    Page<LoyaltyTransaction> findByLoyaltyAccountIdOrderByCreatedAtDesc(UUID accountId, Pageable pageable);
}
