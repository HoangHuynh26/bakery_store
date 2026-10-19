package com.maisondouce.bakery.modules.loyalty.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "loyalty_tiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyTier {

    @Id
    @Column(length = 30)
    private String id; // BRONZE, SILVER, GOLD, PLATINUM

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "min_spend_required", nullable = false, precision = 15, scale = 2)
    private BigDecimal minSpendRequired;

    @Column(name = "point_earning_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal pointEarningRate;

    @Column(name = "benefits_description", columnDefinition = "TEXT")
    private String benefitsDescription;
}
