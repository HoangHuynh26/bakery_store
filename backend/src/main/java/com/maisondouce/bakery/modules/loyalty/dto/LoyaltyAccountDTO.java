package com.maisondouce.bakery.modules.loyalty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyAccountDTO {
    private UUID id;
    private int pointsBalance;
    private int lifetimePoints;
    private LoyaltyTierDTO currentTier;
    private LoyaltyTierDTO nextTier;
    private int pointsToNextTier;
    private List<LoyaltyTransactionDTO> recentTransactions;
}
