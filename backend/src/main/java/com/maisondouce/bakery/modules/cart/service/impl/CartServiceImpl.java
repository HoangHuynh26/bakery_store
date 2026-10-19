package com.maisondouce.bakery.modules.cart.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.cart.dto.*;
import com.maisondouce.bakery.modules.cart.entity.CartItem;
import com.maisondouce.bakery.modules.cart.entity.ShoppingCart;
import com.maisondouce.bakery.modules.cart.repository.CartItemRepository;
import com.maisondouce.bakery.modules.cart.repository.ShoppingCartRepository;
import com.maisondouce.bakery.modules.cart.service.CartService;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.entity.ProductVariant;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.catalog.repository.ProductVariantRepository;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import com.maisondouce.bakery.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class CartServiceImpl implements CartService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = new BigDecimal("500000.00");
    private static final BigDecimal STANDARD_DELIVERY_FEE = new BigDecimal("30000.00");

    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(
            ShoppingCartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CartDTO getCart(UserPrincipal principal, String sessionToken) {
        ShoppingCart cart = getOrCreateCart(principal, sessionToken);
        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addItem(UserPrincipal principal, String sessionToken, AddToCartRequest request) {
        ShoppingCart cart = getOrCreateCart(principal, sessionToken);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("Product is currently unavailable");
        }

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "id", request.getVariantId()));
            if (!variant.getProduct().getId().equals(product.getId())) {
                throw new BadRequestException("Variant does not belong to selected product");
            }
        }

        BigDecimal unitPrice = calculateUnitPrice(product, variant);

        Optional<CartItem> existingItem;
        if (variant != null) {
            existingItem = cartItemRepository.findByCartIdAndProductIdAndVariantId(cart.getId(), product.getId(), variant.getId());
        } else {
            existingItem = cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(cart.getId(), product.getId());
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(Math.min(100, item.getQuantity() + request.getQuantity()));
            item.setUnitPrice(unitPrice);
            if (request.getCustomizationNotes() != null && !request.getCustomizationNotes().isBlank()) {
                item.setCustomizationNotes(request.getCustomizationNotes().trim());
            }
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .customizationNotes(request.getCustomizationNotes() != null ? request.getCustomizationNotes().trim() : null)
                    .unitPrice(unitPrice)
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateItem(UserPrincipal principal, String sessionToken, UUID itemId, UpdateCartItemRequest request) {
        ShoppingCart cart = getOrCreateCart(principal, sessionToken);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(request.getQuantity());
            if (request.getCustomizationNotes() != null) {
                item.setCustomizationNotes(request.getCustomizationNotes().trim());
            }
            // Refresh unit price from product
            item.setUnitPrice(calculateUnitPrice(item.getProduct(), item.getVariant()));
            cartItemRepository.save(item);
        }

        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO removeItem(UserPrincipal principal, String sessionToken, UUID itemId) {
        ShoppingCart cart = getOrCreateCart(principal, sessionToken);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO clearCart(UserPrincipal principal, String sessionToken) {
        ShoppingCart cart = getOrCreateCart(principal, sessionToken);
        cart.getItems().clear();
        cartRepository.save(cart);
        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO mergeCart(UserPrincipal principal, MergeCartRequest request) {
        if (principal == null) {
            throw new BadRequestException("User must be authenticated to merge carts");
        }

        ShoppingCart userCart = getOrCreateCart(principal, null);
        Optional<ShoppingCart> guestCartOpt = cartRepository.findBySessionToken(request.getSessionToken());

        if (guestCartOpt.isPresent()) {
            ShoppingCart guestCart = guestCartOpt.get();
            if (!guestCart.getId().equals(userCart.getId())) {
                for (CartItem guestItem : new ArrayList<>(guestCart.getItems())) {
                    Product product = guestItem.getProduct();
                    ProductVariant variant = guestItem.getVariant();

                    Optional<CartItem> existingUserItem = (variant != null)
                            ? cartItemRepository.findByCartIdAndProductIdAndVariantId(userCart.getId(), product.getId(), variant.getId())
                            : cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(userCart.getId(), product.getId());

                    if (existingUserItem.isPresent()) {
                        CartItem userItem = existingUserItem.get();
                        userItem.setQuantity(Math.min(100, userItem.getQuantity() + guestItem.getQuantity()));
                        cartItemRepository.save(userItem);
                    } else {
                        guestItem.setCart(userCart);
                        userCart.getItems().add(guestItem);
                        cartItemRepository.save(guestItem);
                    }
                }
                guestCart.getItems().clear();
                cartRepository.delete(guestCart);
            }
        }

        return mapToCartDTO(userCart);
    }

    private ShoppingCart getOrCreateCart(UserPrincipal principal, String sessionToken) {
        if (principal != null) {
            return cartRepository.findByUserId(principal.getId()).orElseGet(() -> {
                User user = userRepository.findById(principal.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
                ShoppingCart newCart = ShoppingCart.builder()
                        .user(user)
                        .items(new ArrayList<>())
                        .build();
                return cartRepository.save(newCart);
            });
        }

        String token = (sessionToken != null && !sessionToken.isBlank())
                ? sessionToken.trim()
                : UUID.randomUUID().toString();

        return cartRepository.findBySessionToken(token).orElseGet(() -> {
            ShoppingCart newCart = ShoppingCart.builder()
                    .sessionToken(token)
                    .items(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });
    }

    private BigDecimal calculateUnitPrice(Product product, ProductVariant variant) {
        BigDecimal base = (product.getPromotionalPrice() != null && product.getPromotionalPrice().compareTo(BigDecimal.ZERO) > 0)
                ? product.getPromotionalPrice()
                : product.getBasePrice();

        if (variant != null && variant.getPriceAdjustment() != null) {
            return base.add(variant.getPriceAdjustment());
        }
        return base;
    }

    private CartDTO mapToCartDTO(ShoppingCart cart) {
        List<CartItemDTO> itemDTOs = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalCount = 0;

        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            ProductVariant v = item.getVariant();

            BigDecimal currentPrice = calculateUnitPrice(p, v);
            item.setUnitPrice(currentPrice); // Keep refreshed
            BigDecimal lineTotal = currentPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
            totalCount += item.getQuantity();

            String image = (p.getImages() != null && !p.getImages().isEmpty())
                    ? p.getImages().get(0).getImageUrl()
                    : "/images/placeholder-cake.jpg";

            itemDTOs.add(CartItemDTO.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productSlug(p.getSlug())
                    .nameEn(p.getNameEn())
                    .nameVi(p.getNameVi())
                    .imageUrl(image)
                    .variantId(v != null ? v.getId() : null)
                    .variantName(v != null ? v.getNameEn() : null)
                    .quantity(item.getQuantity())
                    .unitPrice(currentPrice)
                    .lineTotal(lineTotal)
                    .customizationNotes(item.getCustomizationNotes())
                    .inStock(p.getStockQuantity() > 0)
                    .maxStock(p.getStockQuantity())
                    .build());
        }

        BigDecimal deliveryFee = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : STANDARD_DELIVERY_FEE;

        BigDecimal total = subtotal.add(deliveryFee);
        BigDecimal neededForFree = FREE_DELIVERY_THRESHOLD.subtract(subtotal).max(BigDecimal.ZERO);

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalItemCount(totalCount)
                .subtotal(subtotal)
                .estimatedDeliveryFee(deliveryFee)
                .estimatedTotal(total)
                .freeDeliveryThreshold(FREE_DELIVERY_THRESHOLD)
                .amountNeededForFreeDelivery(neededForFree)
                .build();
    }
}
