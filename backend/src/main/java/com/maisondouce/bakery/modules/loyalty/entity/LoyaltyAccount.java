package com.maisondouce.bakery.modules.loyalty.entity;

import com.maisondouce.bakery.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "loyalty_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "points_balance", nullable = false)
    @Builder.Default
    private int pointsBalance = 0;

    @Column(name = "lifetime_points", nullable = false)
    @Builder.Default
    private int lifetimePoints = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_tier_id", nullable = false)
    private LoyaltyTier currentTier;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "loyaltyAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<LoyaltyTransaction> transactions = new ArrayList<>();
}
