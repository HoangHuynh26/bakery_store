package com.maisondouce.bakery.modules.order.service;

import com.maisondouce.bakery.modules.order.dto.CheckoutRequest;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.dto.OrderTrackingDTO;
import com.maisondouce.bakery.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDTO checkout(UserPrincipal principal, CheckoutRequest request);
    OrderResponseDTO getOrderByNumber(String orderNumber);
    OrderResponseDTO getOrderById(UUID orderId);
    OrderTrackingDTO getOrderTracking(String orderNumber);
    List<OrderResponseDTO> getCustomerOrders(UUID userId);
    Page<OrderResponseDTO> getAdminOrders(String status, String search, Pageable pageable);
    OrderResponseDTO updateOrderStatus(UUID orderId, String newStatus, String comment, UserPrincipal staffPrincipal);
    OrderResponseDTO updateAdminNotes(UUID orderId, String adminNotes);
    List<OrderResponseDTO> getKitchenOrdersForToday();
}

