package com.maisondouce.bakery.modules.cart.repository;

import com.maisondouce.bakery.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCartId(UUID cartId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(UUID cartId, UUID productId, UUID variantId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantIsNull(UUID cartId, UUID productId);
}
