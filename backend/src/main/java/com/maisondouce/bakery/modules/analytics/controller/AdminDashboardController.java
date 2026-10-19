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
@Tag(name = "Admin Analytics", description = "Operational metrics, revenue, and inventory warnings for bakery management")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    public AdminDashboardController(AdminDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

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

    @GetMapping("/export/orders.csv")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Export all orders as UTF-8 CSV")
    public ResponseEntity<byte[]> exportOrdersCsv() {
        byte[] csvData = dashboardService.exportOrdersCsv();
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"maison_douce_orders.csv\"")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(csvData);
    }

    @GetMapping("/export/inventory.csv")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Export bakery product inventory as UTF-8 CSV")
    public ResponseEntity<byte[]> exportInventoryCsv() {
        byte[] csvData = dashboardService.exportInventoryCsv();
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"maison_douce_inventory.csv\"")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(csvData);
    }
}
