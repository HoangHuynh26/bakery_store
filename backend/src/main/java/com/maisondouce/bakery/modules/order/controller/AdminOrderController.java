package com.maisondouce.bakery.modules.order.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.service.OrderService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin Orders", description = "Order fulfillment, kitchen workflow board, and status management")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get paginated orders list with status and customer search filter")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAdminOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<OrderResponseDTO> orders = orderService.getAdminOrders(status, search, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Tải danh sách đơn hàng thành công.", orders));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get full order details with status audit timeline")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Tải thông tin đơn hàng thành công.", order));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Advance or update order workflow status with staff audit note")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal staffPrincipal) {

        String newStatus = payload.get("status");
        String comment = payload.getOrDefault("comment", "Cập nhật trạng thái bởi nhân viên bếp");

        OrderResponseDTO updated = orderService.updateOrderStatus(id, newStatus, comment, staffPrincipal);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tiến trình đơn hàng thành công.", updated));
    }

    @PatchMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Save internal staff/admin note on order")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateAdminNotes(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {

        String notes = payload.get("notes");
        OrderResponseDTO updated = orderService.updateAdminNotes(id, notes);
        return ResponseEntity.ok(ApiResponse.success("Lưu ghi chú nội bộ thành công.", updated));
    }

    @GetMapping("/kitchen-queue")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get live orders scheduled for baking & decorating today (Kitchen Tablet Board)")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getKitchenOrdersForToday() {
        List<OrderResponseDTO> orders = orderService.getKitchenOrdersForToday();
        return ResponseEntity.ok(ApiResponse.success("Tải danh sách hàng đợi bếp thành công.", orders));
    }
}
