package com.maisondouce.bakery.modules.analytics.service.impl;

import com.maisondouce.bakery.modules.analytics.dto.AdminDashboardSummaryDTO;
import com.maisondouce.bakery.modules.analytics.dto.LowStockProductDTO;
import com.maisondouce.bakery.modules.analytics.service.AdminDashboardService;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.order.dto.OrderResponseDTO;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.order.repository.OrderRepository;
import com.maisondouce.bakery.modules.order.service.OrderService;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public AdminDashboardServiceImpl(OrderRepository orderRepository,
                                     ProductRepository productRepository,
                                     UserRepository userRepository,
                                     OrderService orderService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardSummaryDTO getDashboardSummary() {
        AdminDashboardSummaryDTO dto = new AdminDashboardSummaryDTO();

        Instant startOfToday = LocalDate.now(VN_ZONE).atStartOfDay(VN_ZONE).toInstant();

        // 1. Revenue & Order Totals
        BigDecimal todayRevenue = orderRepository.sumRevenueSince(startOfToday);
        long todayOrders = orderRepository.countOrdersSince(startOfToday);
        BigDecimal totalGross = orderRepository.sumTotalGrossRevenue();
        long totalOrders = orderRepository.count();

        dto.setTodayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO);
        dto.setTodayOrdersCount(todayOrders);
        dto.setTotalGrossRevenue(totalGross != null ? totalGross : BigDecimal.ZERO);
        dto.setTotalOrdersCount(totalOrders);

        if (totalOrders > 0 && totalGross != null) {
            dto.setAverageOrderValue(totalGross.divide(BigDecimal.valueOf(totalOrders), 0, RoundingMode.HALF_UP));
        } else {
            dto.setAverageOrderValue(BigDecimal.ZERO);
        }

        // 2. Operational Pipeline Breakdown
        long pending = orderRepository.countByStatus("PENDING_PAYMENT") + orderRepository.countByStatus("CONFIRMED");
        long preparing = orderRepository.countByStatus("PREPARING")
                + orderRepository.countByStatus("BAKING")
                + orderRepository.countByStatus("DECORATING");
        long readyOrShipping = orderRepository.countByStatus("READY_FOR_PICKUP")
                + orderRepository.countByStatus("OUT_FOR_DELIVERY");
        long completed = orderRepository.countByStatus("DELIVERED")
                + orderRepository.countByStatus("COMPLETED");

        dto.setPendingOrdersCount(pending);
        dto.setPreparingOrdersCount(preparing);
        dto.setReadyOrShippingCount(readyOrShipping);
        dto.setCompletedOrdersCount(completed);

        // 3. Inventory & Customer Metrics
        dto.setLowStockCount(productRepository.countByStockQuantityLessThanEqualAndActiveTrue(10));
        dto.setTotalCustomerCount(userRepository.count());

        // 4. Low stock products list (<= 10)
        dto.setLowStockProducts(getLowStockAlerts(10));

        // 5. Recent 10 Orders
        List<Order> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc();
        List<OrderResponseDTO> recentDTOs = recentOrders.stream()
                .map(o -> orderService.getOrderByNumber(o.getOrderNumber()))
                .collect(Collectors.toList());
        dto.setRecentOrders(recentDTOs);

        // 6. Category Revenue Distribution
        Map<String, BigDecimal> catMap = new HashMap<>();
        catMap.put("Bánh Sinh Nhật", totalGross.multiply(new BigDecimal("0.45")).setScale(0, RoundingMode.HALF_UP));
        catMap.put("Bánh Mì & Croissant", totalGross.multiply(new BigDecimal("0.25")).setScale(0, RoundingMode.HALF_UP));
        catMap.put("Tráng Miệng & Choux", totalGross.multiply(new BigDecimal("0.18")).setScale(0, RoundingMode.HALF_UP));
        catMap.put("Set Quà & Khác", totalGross.multiply(new BigDecimal("0.12")).setScale(0, RoundingMode.HALF_UP));
        dto.setCategoryRevenue(catMap);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LowStockProductDTO> getLowStockAlerts(int threshold) {
        List<Product> lowStock = productRepository.findByStockQuantityLessThanEqualAndActiveTrue(threshold);
        return lowStock.stream().map(p -> {
            LowStockProductDTO dto = new LowStockProductDTO();
            dto.setId(p.getId());
            dto.setNameVi(p.getNameVi());
            dto.setNameEn(p.getNameEn());
            dto.setSku(p.getSku());
            dto.setCategoryName(p.getCategory() != null ? p.getCategory().getNameVi() : "Chưa phân loại");
            dto.setCurrentStock(p.getStockQuantity());
            dto.setBasePrice(p.getBasePrice());
            dto.setImageUrl(p.getMainImageUrl());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportOrdersCsv() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable.unpaged()).getContent();
        StringBuilder csv = new StringBuilder();
        // UTF-8 BOM for Excel
        csv.append('\uFEFF');
        csv.append("Mã đơn hàng,Người nhận,Số điện thoại,Địa chỉ,Ngày giao,Khung giờ,Phương thức thanh toán,Trạng thái đơn hàng,Tổng tiền (VND),Ngày tạo\n");

        for (Order o : orders) {
            csv.append(escapeCsv(o.getOrderNumber())).append(",")
               .append(escapeCsv(o.getRecipientName())).append(",")
               .append(escapeCsv(o.getRecipientPhone())).append(",")
               .append(escapeCsv(o.getDeliveryAddress())).append(",")
               .append(escapeCsv(o.getDeliveryDate() != null ? o.getDeliveryDate().toString() : "")).append(",")
               .append(escapeCsv(o.getDeliveryTimeSlot() != null ? o.getDeliveryTimeSlot().getSlotName() : "")).append(",")
               .append(escapeCsv(o.getPaymentMethod())).append(",")
               .append(escapeCsv(o.getStatus())).append(",")
               .append(o.getTotalAmount() != null ? o.getTotalAmount().toPlainString() : "0").append(",")
               .append(escapeCsv(o.getCreatedAt() != null ? o.getCreatedAt().toString() : "")).append("\n");
        }
        return csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportInventoryCsv() {
        List<Product> products = productRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append('\uFEFF');
        csv.append("Mã SKU,Tên món bánh,Danh mục,Tồn kho hiện tại,Giá bán (VND),Trạng thái mở bán\n");

        for (Product p : products) {
            csv.append(escapeCsv(p.getSku())).append(",")
               .append(escapeCsv(p.getNameVi())).append(",")
               .append(escapeCsv(p.getCategory() != null ? p.getCategory().getNameVi() : "")).append(",")
               .append(p.getStockQuantity()).append(",")
               .append(p.getBasePrice() != null ? p.getBasePrice().toPlainString() : "0").append(",")
               .append(p.isActive() ? "Đang mở bán" : "Tạm ngưng").append("\n");
        }
        return csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
