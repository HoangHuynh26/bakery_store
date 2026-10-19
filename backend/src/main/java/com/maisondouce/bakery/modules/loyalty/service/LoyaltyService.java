package com.maisondouce.bakery.modules.loyalty.service;

import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyAccountDTO;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyTierDTO;
import com.maisondouce.bakery.modules.order.entity.Order;

import java.util.List;
import java.util.UUID;

public interface LoyaltyService {

    LoyaltyAccountDTO getOrCreateAccountForUser(UUID userId);

    List<LoyaltyTierDTO> getAllTiers();

    void awardPointsForOrder(UUID userId, Order order);

    void redeemPoints(UUID userId, int points, Order order);
}
