package com.maisondouce.bakery.modules.loyalty.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyAccountDTO;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyTierDTO;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyTransactionDTO;
import com.maisondouce.bakery.modules.loyalty.entity.LoyaltyAccount;
import com.maisondouce.bakery.modules.loyalty.entity.LoyaltyTier;
import com.maisondouce.bakery.modules.loyalty.entity.LoyaltyTransaction;
import com.maisondouce.bakery.modules.loyalty.repository.LoyaltyAccountRepository;
import com.maisondouce.bakery.modules.loyalty.repository.LoyaltyTierRepository;
import com.maisondouce.bakery.modules.loyalty.repository.LoyaltyTransactionRepository;
import com.maisondouce.bakery.modules.loyalty.service.LoyaltyService;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {

    private final LoyaltyAccountRepository accountRepository;
    private final LoyaltyTierRepository tierRepository;
    private final LoyaltyTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public LoyaltyServiceImpl(LoyaltyAccountRepository accountRepository,
                              LoyaltyTierRepository tierRepository,
                              LoyaltyTransactionRepository transactionRepository,
                              UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.tierRepository = tierRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LoyaltyAccountDTO getOrCreateAccountForUser(UUID userId) {
        LoyaltyAccount account = accountRepository.findByUserId(userId)
                .orElseGet(() -> createInitialAccount(userId));

        List<LoyaltyTransaction> transactions = transactionRepository.findByLoyaltyAccountIdOrderByCreatedAtDesc(account.getId());
        List<LoyaltyTier> allTiers = tierRepository.findAllByOrderByMinSpendRequiredAsc();

        LoyaltyTier currentTier = account.getCurrentTier();
        LoyaltyTier nextTier = null;
        int pointsToNext = 0;

        for (int i = 0; i < allTiers.size(); i++) {
            if (allTiers.get(i).getId().equals(currentTier.getId()) && i + 1 < allTiers.size()) {
                nextTier = allTiers.get(i + 1);
                // 1 point approx 1,000 VND
                int requiredPoints = nextTier.getMinSpendRequired().divide(BigDecimal.valueOf(1000)).intValue();
                pointsToNext = Math.max(0, requiredPoints - account.getLifetimePoints());
                break;
            }
        }

        List<LoyaltyTransactionDTO> txDtos = transactions.stream()
                .map(this::mapTxToDTO)
                .collect(Collectors.toList());

        return LoyaltyAccountDTO.builder()
                .id(account.getId())
                .pointsBalance(account.getPointsBalance())
                .lifetimePoints(account.getLifetimePoints())
                .currentTier(mapTierToDTO(currentTier))
                .nextTier(nextTier != null ? mapTierToDTO(nextTier) : null)
                .pointsToNextTier(pointsToNext)
                .recentTransactions(txDtos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoyaltyTierDTO> getAllTiers() {
        return tierRepository.findAllByOrderByMinSpendRequiredAsc()
                .stream()
                .map(this::mapTierToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void awardPointsForOrder(UUID userId, Order order) {
        if (userId == null || order == null || order.getTotalAmount() == null) return;

        LoyaltyAccount account = accountRepository.findByUserId(userId)
                .orElseGet(() -> createInitialAccount(userId));

        BigDecimal rate = account.getCurrentTier() != null ? account.getCurrentTier().getPointEarningRate() : BigDecimal.ONE;
        int pointsEarned = order.getTotalAmount()
                .divide(BigDecimal.valueOf(1000))
                .multiply(rate)
                .intValue();

        if (pointsEarned <= 0) return;

        account.setPointsBalance(account.getPointsBalance() + pointsEarned);
        account.setLifetimePoints(account.getLifetimePoints() + pointsEarned);

        // Tier check
        updateTierEligibility(account);
        accountRepository.save(account);

        LoyaltyTransaction tx = LoyaltyTransaction.builder()
                .loyaltyAccount(account)
                .pointsChange(pointsEarned)
                .transactionType("EARNED_ORDER")
                .referenceOrder(order)
                .description("Tích điểm từ đơn hàng #" + order.getOrderNumber())
                .build();
        transactionRepository.save(tx);
    }

    @Override
    @Transactional
    public void redeemPoints(UUID userId, int points, Order order) {
        if (userId == null || points <= 0) return;

        LoyaltyAccount account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("LoyaltyAccount", "userId", userId));

        if (account.getPointsBalance() < points) {
            throw new IllegalArgumentException("Số điểm thưởng không đủ để quy đổi");
        }

        account.setPointsBalance(account.getPointsBalance() - points);
        accountRepository.save(account);

        LoyaltyTransaction tx = LoyaltyTransaction.builder()
                .loyaltyAccount(account)
                .pointsChange(-points)
                .transactionType("REDEEMED_CHECKOUT")
                .referenceOrder(order)
                .description("Quy đổi " + points + " điểm thưởng cho đơn hàng #" + (order != null ? order.getOrderNumber() : ""))
                .build();
        transactionRepository.save(tx);
    }

    private LoyaltyAccount createInitialAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LoyaltyTier bronzeTier = tierRepository.findById("BRONZE")
                .orElseGet(() -> tierRepository.save(LoyaltyTier.builder()
                        .id("BRONZE")
                        .name("Bronze Member")
                        .minSpendRequired(BigDecimal.ZERO)
                        .pointEarningRate(BigDecimal.ONE)
                        .benefitsDescription("Tích luỹ 1% điểm thưởng trên mọi hoá đơn mua sắm.")
                        .build()));

        LoyaltyAccount newAccount = LoyaltyAccount.builder()
                .user(user)
                .pointsBalance(100) // 100 welcome bonus points
                .lifetimePoints(100)
                .currentTier(bronzeTier)
                .build();

        LoyaltyAccount saved = accountRepository.save(newAccount);

        LoyaltyTransaction welcomeTx = LoyaltyTransaction.builder()
                .loyaltyAccount(saved)
                .pointsChange(100)
                .transactionType("BONUS")
                .description("Điểm thưởng chào mừng thành viên mới Maison Douce Club")
                .build();
        transactionRepository.save(welcomeTx);

        return saved;
    }

    private void updateTierEligibility(LoyaltyAccount account) {
        List<LoyaltyTier> tiers = tierRepository.findAllByOrderByMinSpendRequiredAsc();
        // lifetime spend approx lifetime points * 1000
        BigDecimal estimatedSpend = BigDecimal.valueOf(account.getLifetimePoints()).multiply(BigDecimal.valueOf(1000));

        LoyaltyTier eligibleTier = account.getCurrentTier();
        for (LoyaltyTier tier : tiers) {
            if (estimatedSpend.compareTo(tier.getMinSpendRequired()) >= 0) {
                eligibleTier = tier;
            }
        }
        account.setCurrentTier(eligibleTier);
    }

    private LoyaltyTierDTO mapTierToDTO(LoyaltyTier tier) {
        if (tier == null) return null;
        return LoyaltyTierDTO.builder()
                .id(tier.getId())
                .name(tier.getName())
                .minSpendRequired(tier.getMinSpendRequired())
                .pointEarningRate(tier.getPointEarningRate())
                .benefitsDescription(tier.getBenefitsDescription())
                .build();
    }

    private LoyaltyTransactionDTO mapTxToDTO(LoyaltyTransaction tx) {
        return LoyaltyTransactionDTO.builder()
                .id(tx.getId())
                .pointsChange(tx.getPointsChange())
                .transactionType(tx.getTransactionType())
                .referenceOrderNumber(tx.getReferenceOrder() != null ? tx.getReferenceOrder().getOrderNumber() : null)
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
