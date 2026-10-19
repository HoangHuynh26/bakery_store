package com.maisondouce.bakery.modules.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private UUID id;
    @Builder.Default
    private List<CartItemDTO> items = new ArrayList<>();
    private int totalItemCount;
    private BigDecimal subtotal;
    private BigDecimal estimatedDeliveryFee;
    private BigDecimal estimatedTotal;
    private BigDecimal freeDeliveryThreshold;
    private BigDecimal amountNeededForFreeDelivery;
}
