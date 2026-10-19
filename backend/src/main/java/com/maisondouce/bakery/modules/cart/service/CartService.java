package com.maisondouce.bakery.modules.cart.service;

import com.maisondouce.bakery.modules.cart.dto.AddToCartRequest;
import com.maisondouce.bakery.modules.cart.dto.CartDTO;
import com.maisondouce.bakery.modules.cart.dto.MergeCartRequest;
import com.maisondouce.bakery.modules.cart.dto.UpdateCartItemRequest;
import com.maisondouce.bakery.security.UserPrincipal;

import java.util.UUID;

public interface CartService {
    CartDTO getCart(UserPrincipal principal, String sessionToken);
    CartDTO addItem(UserPrincipal principal, String sessionToken, AddToCartRequest request);
    CartDTO updateItem(UserPrincipal principal, String sessionToken, UUID itemId, UpdateCartItemRequest request);
    CartDTO removeItem(UserPrincipal principal, String sessionToken, UUID itemId);
    CartDTO clearCart(UserPrincipal principal, String sessionToken);
    CartDTO mergeCart(UserPrincipal principal, MergeCartRequest request);
}
