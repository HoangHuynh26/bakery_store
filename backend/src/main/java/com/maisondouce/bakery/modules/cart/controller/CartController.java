package com.maisondouce.bakery.modules.cart.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.cart.dto.*;
import com.maisondouce.bakery.modules.cart.service.CartService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
@Tag(name = "Shopping Cart", description = "Shopping cart operations for guests and authenticated customers")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current cart contents and totals")
    public ResponseEntity<ApiResponse<CartDTO>> getCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        CartDTO cart = cartService.getCart(principal, sessionToken);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add a product or variant to cart")
    public ResponseEntity<ApiResponse<CartDTO>> addItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @Valid @RequestBody AddToCartRequest request) {
        CartDTO cart = cartService.addItem(principal, sessionToken, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity or customization notes")
    public ResponseEntity<ApiResponse<CartDTO>> updateItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartDTO cart = cartService.updateItem(principal, sessionToken, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from cart")
    public ResponseEntity<ApiResponse<CartDTO>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @PathVariable UUID itemId) {
        CartDTO cart = cartService.removeItem(principal, sessionToken, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear all items in cart")
    public ResponseEntity<ApiResponse<CartDTO>> clearCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        CartDTO cart = cartService.clearCart(principal, sessionToken);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }

    @PostMapping("/merge")
    @Operation(summary = "Merge guest cart into user cart after login")
    public ResponseEntity<ApiResponse<CartDTO>> mergeCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MergeCartRequest request) {
        CartDTO cart = cartService.mergeCart(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Guest cart merged successfully", cart));
    }
}
