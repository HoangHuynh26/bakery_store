package com.maisondouce.bakery.modules.order.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.dto.OrderTrackingDTO;
import com.maisondouce.bakery.modules.order.service.OrderService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders & Fulfillment", description = "Order tracking, history, and status progression")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get full order details by order number")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponseDTO order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/{orderNumber}/track")
    @Operation(summary = "Get detailed order tracking timeline")
    public ResponseEntity<ApiResponse<OrderTrackingDTO>> getOrderTracking(@PathVariable String orderNumber) {
        OrderTrackingDTO tracking = orderService.getOrderTracking(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(tracking));
    }

    @GetMapping("/history")
    @Operation(summary = "Get current customer's order history")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getCustomerOrders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<OrderResponseDTO> orders = orderService.getCustomerOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'STAFF')")
    @Operation(summary = "Update order preparation and fulfillment status (Staff / Admin)")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateStatus(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal staffPrincipal) {
        String newStatus = body.get("status");
        String comment = body.getOrDefault("comment", "Status updated by staff");
        OrderResponseDTO updated = orderService.updateOrderStatus(orderId, newStatus, comment, staffPrincipal);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", updated));
    }
}
