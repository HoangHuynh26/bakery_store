package com.maisondouce.bakery.modules.user.repository;

import com.maisondouce.bakery.modules.user.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    List<Wishlist> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Wishlist> findByUserIdAndProductId(UUID userId, UUID productId);

    boolean existsByUserIdAndProductId(UUID userId, UUID productId);

    void deleteByUserIdAndProductId(UUID userId, UUID productId);
}
