package com.maisondouce.bakery.modules.analytics.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.analytics.dto.AdminDashboardSummaryDTO;
import com.maisondouce.bakery.modules.analytics.dto.LowStockProductDTO;
import com.maisondouce.bakery.modules.analytics.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Analytics", description = "Operational metrics, revenue, and inventory warnings for bakery management")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get high-level dashboard metrics (sales, orders, pipeline, stock)")
    public ResponseEntity<ApiResponse<AdminDashboardSummaryDTO>> getDashboardSummary() {
        AdminDashboardSummaryDTO summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success("Tải dữ liệu tổng quan thành công.", summary));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get products currently running low on stock")
    public ResponseEntity<ApiResponse<List<LowStockProductDTO>>> getLowStockAlerts(
            @RequestParam(defaultValue = "10") int threshold) {
        List<LowStockProductDTO> alerts = dashboardService.getLowStockAlerts(threshold);
        return ResponseEntity.ok(ApiResponse.success("Tải danh sách cảnh báo tồn kho thành công.", alerts));
    }
}
