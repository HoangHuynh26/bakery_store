package com.maisondouce.bakery.modules.delivery.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "delivery_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String districts;

    @Column(name = "standard_fee", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal standardFee = new BigDecimal("30000.00");

    @Column(name = "free_delivery_threshold", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal freeDeliveryThreshold = new BigDecimal("500000.00");

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
