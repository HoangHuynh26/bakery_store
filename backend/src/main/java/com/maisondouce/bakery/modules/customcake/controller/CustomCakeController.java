package com.maisondouce.bakery.modules.customcake.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeCreateRequest;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeResponse;
import com.maisondouce.bakery.modules.customcake.service.CustomCakeService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/custom-cakes")
@RequiredArgsConstructor
@Tag(name = "Custom Cakes", description = "Customer Custom Cake Design & Quotations")
public class CustomCakeController {

    private final CustomCakeService customCakeService;

    @PostMapping
    @Operation(summary = "Submit a custom celebration cake design request")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> createRequest(
            @Valid @RequestBody CustomCakeCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        UUID userId = currentUser != null ? currentUser.getId() : null;
        CustomCakeResponse response = customCakeService.createRequest(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Yêu cầu thiết kế bánh đã được gửi thành công!", response));
    }

    @GetMapping("/{requestNumber}")
    @Operation(summary = "Get custom cake request details by request number")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> getByRequestNumber(@PathVariable String requestNumber) {
        CustomCakeResponse response = customCakeService.getByRequestNumber(requestNumber);
        return ResponseEntity.ok(ApiResponse.success("Thông tin yêu cầu bánh thiết kế", response));
    }

    @GetMapping("/my-requests")
    @Operation(summary = "Get current customer's custom cake requests")
    public ResponseEntity<ApiResponse<List<CustomCakeResponse>>> getMyRequests(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CustomCakeResponse> list = customCakeService.getCustomerRequests(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Danh sách yêu cầu bánh thiết kế của bạn", list));
    }

    @PatchMapping("/{id}/accept")
    @Operation(summary = "Customer accepts bakery quotation")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> acceptQuotation(@PathVariable UUID id) {
        CustomCakeResponse response = customCakeService.updateStatus(id, "ACCEPTED");
        return ResponseEntity.ok(ApiResponse.success("Đã chấp nhận báo giá thiết kế bánh!", response));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Customer rejects bakery quotation")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> rejectQuotation(@PathVariable UUID id) {
        CustomCakeResponse response = customCakeService.updateStatus(id, "REJECTED");
        return ResponseEntity.ok(ApiResponse.success("Đã từ chối báo giá thiết kế bánh.", response));
    }
}
