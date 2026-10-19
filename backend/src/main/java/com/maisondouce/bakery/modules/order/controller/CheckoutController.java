package com.maisondouce.bakery.modules.order.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.order.dto.CheckoutRequest;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.service.OrderService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkout")
@Tag(name = "Checkout", description = "Multi-step checkout and order creation")
public class CheckoutController {

    private final OrderService orderService;

    public CheckoutController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Submit checkout to create order and reserve stock")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request) {
        OrderResponseDTO order = orderService.checkout(principal, request);
        return new ResponseEntity<>(
                ApiResponse.success("Đơn hàng của bạn đã được tiếp nhận thành công!", order),
                HttpStatus.CREATED
        );
    }
}
