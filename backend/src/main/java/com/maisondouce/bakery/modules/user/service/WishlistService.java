package com.maisondouce.bakery.modules.user.service;

import com.maisondouce.bakery.modules.user.dto.WishlistItemDTO;

import java.util.List;
import java.util.UUID;

public interface WishlistService {
    List<WishlistItemDTO> getWishlist(UUID userId);
    boolean toggleWishlist(UUID userId, UUID productId);
    void removeFromWishlist(UUID userId, UUID productId);
}
