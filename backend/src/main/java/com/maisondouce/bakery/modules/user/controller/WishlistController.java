package com.maisondouce.bakery.modules.user.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.user.dto.WishlistItemDTO;
import com.maisondouce.bakery.modules.user.service.WishlistService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlists")
@Tag(name = "Customer Wishlist", description = "Manage customer favorite cakes and pastries")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's wishlist items")
    public ResponseEntity<ApiResponse<List<WishlistItemDTO>>> getWishlist(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WishlistItemDTO> items = wishlistService.getWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Toggle a product in/out of customer's wishlist")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId) {
        boolean added = wishlistService.toggleWishlist(principal.getId(), productId);
        String message = added ? "Added to your wishlist" : "Removed from your wishlist";
        return ResponseEntity.ok(ApiResponse.success(message, Map.of("added", added, "productId", productId)));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove a product from customer's wishlist")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId) {
        wishlistService.removeFromWishlist(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from wishlist", null));
    }
}
