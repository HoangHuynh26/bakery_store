package com.maisondouce.bakery.modules.customcake.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeResponse;
import com.maisondouce.bakery.modules.customcake.dto.QuotationSubmitRequest;
import com.maisondouce.bakery.modules.customcake.service.CustomCakeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/custom-cakes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'STAFF')")
@Tag(name = "Admin Custom Cakes", description = "Admin Review & Quotations for Custom Cakes")
public class AdminCustomCakeController {

    private final CustomCakeService customCakeService;

    @GetMapping
    @Operation(summary = "List all custom cake requests with optional status filtering")
    public ResponseEntity<ApiResponse<Page<CustomCakeResponse>>> getCustomCakeRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomCakeResponse> result = customCakeService.getAdminRequests(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Danh sách yêu cầu bánh thiết kế", result));
    }

    @PatchMapping("/{id}/quotation")
    @Operation(summary = "Submit price quotation for custom cake request")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> submitQuotation(
            @PathVariable UUID id,
            @Valid @RequestBody QuotationSubmitRequest quotationRequest
    ) {
        CustomCakeResponse response = customCakeService.submitQuotation(id, quotationRequest);
        return ResponseEntity.ok(ApiResponse.success("Báo giá bánh thiết kế thành công!", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update custom cake request operational status")
    public ResponseEntity<ApiResponse<CustomCakeResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> statusBody
    ) {
        String status = statusBody.get("status");
        CustomCakeResponse response = customCakeService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái bánh thiết kế thành công!", response));
    }
}
