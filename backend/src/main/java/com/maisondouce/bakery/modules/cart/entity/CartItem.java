package com.maisondouce.bakery.modules.cart.entity;

import com.maisondouce.bakery.common.model.BaseEntity;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Builder.Default
    @Column(nullable = false)
    private int quantity = 1;

    @Column(name = "customization_notes", columnDefinition = "TEXT")
    private String customizationNotes;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;
}
