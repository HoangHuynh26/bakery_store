package com.maisondouce.bakery.modules.loyalty.entity;

import com.maisondouce.bakery.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "loyalty_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loyalty_account_id", nullable = false)
    private LoyaltyAccount loyaltyAccount;

    @Column(name = "points_change", nullable = false)
    private int pointsChange;

    @Column(name = "transaction_type", nullable = false, length = 30)
    private String transactionType; // EARNED_ORDER, REDEEMED_CHECKOUT, BONUS, EXPIRATION

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_order_id")
    private Order referenceOrder;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
