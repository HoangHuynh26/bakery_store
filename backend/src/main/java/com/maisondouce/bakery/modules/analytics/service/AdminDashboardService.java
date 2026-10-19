package com.maisondouce.bakery.modules.analytics.service;

import com.maisondouce.bakery.modules.analytics.dto.AdminDashboardSummaryDTO;
import com.maisondouce.bakery.modules.analytics.dto.LowStockProductDTO;

import java.util.List;

public interface AdminDashboardService {
    AdminDashboardSummaryDTO getDashboardSummary();
    List<LowStockProductDTO> getLowStockAlerts(int threshold);
    byte[] exportOrdersCsv();
    byte[] exportInventoryCsv();
}
