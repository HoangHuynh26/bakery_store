package com.maisondouce.bakery.modules.user.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.user.dto.WishlistItemDTO;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.entity.Wishlist;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import com.maisondouce.bakery.modules.user.repository.WishlistRepository;
import com.maisondouce.bakery.modules.user.service.WishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemDTO> getWishlist(UUID userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToWishlistItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean toggleWishlist(UUID userId, UUID productId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false; // Removed
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .createdAt(Instant.now())
                    .build();
            wishlistRepository.save(wishlist);
            return true; // Added
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(UUID userId, UUID productId) {
        wishlistRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistRepository::delete);
    }

    private WishlistItemDTO mapToWishlistItemDTO(Wishlist wishlist) {
        Product p = wishlist.getProduct();
        String primaryImage = p.getImages() != null && !p.getImages().isEmpty()
                ? p.getImages().get(0).getImageUrl()
                : "/images/placeholder-cake.jpg";

        return WishlistItemDTO.builder()
                .id(wishlist.getId())
                .productId(p.getId())
                .productSlug(p.getSlug())
                .nameEn(p.getNameEn())
                .nameVi(p.getNameVi())
                .basePrice(p.getBasePrice())
                .promotionalPrice(p.getPromotionalPrice())
                .primaryImageUrl(primaryImage)
                .categorySlug(p.getCategory() != null ? p.getCategory().getSlug() : null)
                .categoryNameEn(p.getCategory() != null ? p.getCategory().getNameEn() : null)
                .categoryNameVi(p.getCategory() != null ? p.getCategory().getNameVi() : null)
                .inStock(p.getStockQuantity() > 0)
                .addedAt(wishlist.getCreatedAt())
                .build();
    }
}
