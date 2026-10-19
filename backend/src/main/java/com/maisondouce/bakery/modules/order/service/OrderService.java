package com.maisondouce.bakery.modules.order.service;

import com.maisondouce.bakery.modules.order.dto.CheckoutRequest;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.dto.OrderTrackingDTO;
import com.maisondouce.bakery.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDTO checkout(UserPrincipal principal, CheckoutRequest request);
    OrderResponseDTO getOrderByNumber(String orderNumber);
    OrderTrackingDTO getOrderTracking(String orderNumber);
    List<OrderResponseDTO> getCustomerOrders(UUID userId);
    OrderResponseDTO updateOrderStatus(UUID orderId, String newStatus, String comment, UserPrincipal staffPrincipal);
}
