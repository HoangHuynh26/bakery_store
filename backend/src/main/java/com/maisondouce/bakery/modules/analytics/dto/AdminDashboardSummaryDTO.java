package com.maisondouce.bakery.modules.analytics.dto;

import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardSummaryDTO {

    private BigDecimal todayRevenue = BigDecimal.ZERO;
    private long todayOrdersCount = 0;
    private BigDecimal totalGrossRevenue = BigDecimal.ZERO;
    private long totalOrdersCount = 0;
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    private long pendingOrdersCount = 0;
    private long preparingOrdersCount = 0;
    private long readyOrShippingCount = 0;
    private long completedOrdersCount = 0;

    private long lowStockCount = 0;
    private long totalCustomerCount = 0;

    private List<LowStockProductDTO> lowStockProducts = new ArrayList<>();
    private List<OrderResponseDTO> recentOrders = new ArrayList<>();
    private Map<String, BigDecimal> categoryRevenue = new HashMap<>();
}
