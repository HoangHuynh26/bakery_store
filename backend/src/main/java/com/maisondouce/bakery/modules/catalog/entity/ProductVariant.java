package com.maisondouce.bakery.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true, length = 60)
    private String sku;

    @Column(name = "name_en", nullable = false, length = 100)
    private String nameEn;

    @Column(name = "name_vi", nullable = false, length = 100)
    private String nameVi;

    @Column(name = "size_diameter_cm")
    private Integer sizeDiameterCm;

    @Column(name = "serving_count", length = 50)
    private String servingCount;

    @Column(name = "price_adjustment", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal priceAdjustment = BigDecimal.ZERO;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private int stockQuantity = 10;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
