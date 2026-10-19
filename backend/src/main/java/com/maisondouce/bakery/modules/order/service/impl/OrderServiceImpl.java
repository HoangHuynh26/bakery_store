package com.maisondouce.bakery.modules.order.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.cart.entity.CartItem;
import com.maisondouce.bakery.modules.cart.entity.ShoppingCart;
import com.maisondouce.bakery.modules.cart.repository.CartItemRepository;
import com.maisondouce.bakery.modules.cart.repository.ShoppingCartRepository;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.entity.ProductVariant;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.catalog.repository.ProductVariantRepository;
import com.maisondouce.bakery.modules.delivery.entity.DeliveryTimeSlot;
import com.maisondouce.bakery.modules.delivery.entity.DeliveryZone;
import com.maisondouce.bakery.modules.delivery.repository.DeliveryTimeSlotRepository;
import com.maisondouce.bakery.modules.delivery.repository.DeliveryZoneRepository;
import com.maisondouce.bakery.modules.order.dto.*;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.order.entity.OrderItem;
import com.maisondouce.bakery.modules.order.entity.OrderStatusHistory;
import com.maisondouce.bakery.modules.order.repository.OrderItemRepository;
import com.maisondouce.bakery.modules.order.repository.OrderRepository;
import com.maisondouce.bakery.modules.order.repository.OrderStatusHistoryRepository;
import com.maisondouce.bakery.modules.order.service.OrderService;
import com.maisondouce.bakery.modules.payment.entity.Payment;
import com.maisondouce.bakery.modules.payment.repository.PaymentRepository;
import com.maisondouce.bakery.modules.promotion.dto.CouponValidationResponse;
import com.maisondouce.bakery.modules.promotion.entity.Coupon;
import com.maisondouce.bakery.modules.promotion.repository.CouponRepository;
import com.maisondouce.bakery.modules.promotion.service.PromotionService;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import com.maisondouce.bakery.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final PaymentRepository paymentRepository;
    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final DeliveryTimeSlotRepository timeSlotRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final PromotionService promotionService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderStatusHistoryRepository statusHistoryRepository,
            PaymentRepository paymentRepository,
            ShoppingCartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            DeliveryZoneRepository deliveryZoneRepository,
            DeliveryTimeSlotRepository timeSlotRepository,
            CouponRepository couponRepository,
            UserRepository userRepository,
            PromotionService promotionService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.paymentRepository = paymentRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
        this.promotionService = promotionService;
    }

    @Override
    @Transactional
    public OrderResponseDTO checkout(UserPrincipal principal, CheckoutRequest request) {
        // 1. Locate Shopping Cart
        ShoppingCart cart = null;
        User user = null;
        if (principal != null) {
            user = userRepository.findById(principal.getId()).orElse(null);
            cart = cartRepository.findByUserId(principal.getId()).orElse(null);
        } else if (request.getGuestSessionToken() != null && !request.getGuestSessionToken().isBlank()) {
            cart = cartRepository.findBySessionToken(request.getGuestSessionToken()).orElse(null);
        }

        if (cart == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng của bạn đang trống. Vui lòng chọn bánh trước khi đặt hàng.");
        }

        // 2. Validate Delivery Date & Time Slot
        if (request.getDeliveryDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Ngày nhận bánh không thể ở quá khứ.");
        }

        DeliveryTimeSlot timeSlot = null;
        if (request.getDeliveryTimeSlotId() != null) {
            timeSlot = timeSlotRepository.findById(request.getDeliveryTimeSlotId()).orElse(null);
            if (timeSlot != null) {
                long currentCount = orderRepository.countOrdersForSlotOnDate(request.getDeliveryDate(), timeSlot.getId());
                if (currentCount >= timeSlot.getMaxOrdersCapacity()) {
                    throw new BadRequestException("Khung giờ " + timeSlot.getSlotName() + " vào ngày " + request.getDeliveryDate() + " đã kín lịch làm bánh.");
                }
            }
        }

        // 3. Concurrency Protection & Atomic Stock Verification
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", cartItem.getProduct().getId()));

            if (!product.isActive()) {
                throw new BadRequestException("Sản phẩm '" + product.getNameVi() + "' hiện không còn kinh doanh.");
            }

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Sản phẩm '" + product.getNameVi() + "' chỉ còn " + product.getStockQuantity() + " chiếc trong bếp.");
            }

            // Atomic stock deduction
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Calculate precise line price
            BigDecimal unitPrice = calculateUnitPrice(product, cartItem.getVariant());
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // 4. Calculate Delivery Fee
        BigDecimal deliveryFee = BigDecimal.ZERO;
        DeliveryZone zone = null;
        if ("DELIVERY".equalsIgnoreCase(request.getFulfillmentType())) {
            if (request.getDeliveryZoneId() != null) {
                zone = deliveryZoneRepository.findById(request.getDeliveryZoneId()).orElse(null);
            }
            if (zone != null) {
                deliveryFee = subtotal.compareTo(zone.getFreeDeliveryThreshold()) >= 0
                        ? BigDecimal.ZERO
                        : zone.getStandardFee();
            } else {
                deliveryFee = subtotal.compareTo(new BigDecimal("500000.00")) >= 0
                        ? BigDecimal.ZERO
                        : new BigDecimal("30000.00");
            }
        }

        // 5. Apply Promotional Coupon
        BigDecimal discount = BigDecimal.ZERO;
        Coupon appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            CouponValidationResponse couponResp = promotionService.validateCoupon(request.getCouponCode(), subtotal);
            if (couponResp.isValid()) {
                discount = couponResp.getCalculatedDiscount();
                appliedCoupon = couponRepository.findById(couponResp.getCouponId()).orElse(null);
                if (appliedCoupon != null) {
                    appliedCoupon.setUsedCount(appliedCoupon.getUsedCount() + 1);
                    couponRepository.save(appliedCoupon);
                }
            }
        }

        BigDecimal totalAmount = subtotal.add(deliveryFee).subtract(discount).max(BigDecimal.ZERO);

        // 6. Generate Unique Order Number: MD-YYYYMMDD-XXXX
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = String.format("%04d", new Random().nextInt(10000));
        String orderNumber = "MD-" + datePrefix + "-" + randomSuffix;

        // Initial Status
        String initialStatus = "BANK_TRANSFER".equalsIgnoreCase(request.getPaymentMethod())
                ? "PENDING_PAYMENT"
                : "CONFIRMED";
        String initialPaymentStatus = "PENDING";

        // 7. Persist Order
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus(initialStatus);
        order.setPaymentStatus(initialPaymentStatus);
        order.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        order.setFulfillmentType(request.getFulfillmentType().toUpperCase());
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(totalAmount);
        order.setCoupon(appliedCoupon);
        order.setRecipientName(request.getRecipientName().trim());
        order.setRecipientPhone(request.getRecipientPhone().trim());
        order.setDeliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress().trim() : null);
        order.setDeliveryZone(zone);
        order.setDeliveryDate(request.getDeliveryDate());
        order.setDeliveryTimeSlot(timeSlot);
        order.setTimeSlotName(timeSlot != null ? timeSlot.getSlotName() : null);
        order.setCustomerNotes(request.getCustomerNotes() != null ? request.getCustomerNotes().trim() : null);
        order.setItems(new ArrayList<>());

        Order savedOrder = orderRepository.save(order);

        // 8. Snapshot Order Items
        for (CartItem cartItem : cart.getItems()) {
            Product p = cartItem.getProduct();
            ProductVariant v = cartItem.getVariant();
            BigDecimal unitPrice = calculateUnitPrice(p, v);

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(p)
                    .variant(v)
                    .productName(p.getNameVi() + " (" + p.getNameEn() + ")")
                    .variantName(v != null ? v.getNameEn() : null)
                    .sku(v != null ? v.getSku() : p.getSku())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .customizationSnapshot(cartItem.getCustomizationNotes())
                    .build();

            savedOrder.getItems().add(orderItem);
            orderItemRepository.save(orderItem);
        }

        // 9. Initial Status Audit Log
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(savedOrder)
                .previousStatus(null)
                .newStatus(initialStatus)
                .changedByUser(user)
                .comment("Đơn hàng được khởi tạo thành công qua website")
                .createdAt(Instant.now())
                .build();
        statusHistoryRepository.save(history);

        // 10. Record Payment
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod().toUpperCase())
                .amount(totalAmount)
                .currency("VND")
                .status("PENDING")
                .createdAt(Instant.now())
                .build();
        paymentRepository.save(payment);

        // 11. Clear Cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponseDTO(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return mapToOrderResponseDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderTrackingDTO getOrderTracking(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId());
        List<OrderTrackingDTO.TrackingStepDTO> timeline = buildTimeline(order, history);

        return OrderTrackingDTO.builder()
                .orderNumber(order.getOrderNumber())
                .currentStatus(order.getStatus())
                .currentStatusLabelEn(mapStatusLabelEn(order.getStatus()))
                .currentStatusLabelVi(mapStatusLabelVi(order.getStatus()))
                .fulfillmentType(order.getFulfillmentType())
                .timeline(timeline)
                .orderDetails(mapToOrderResponseDTO(order))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getCustomerOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return mapToOrderResponseDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getAdminOrders(String status, String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return orderRepository.findByOrderNumberContainingIgnoreCaseOrRecipientPhoneContainingOrRecipientNameContainingIgnoreCaseOrderByCreatedAtDesc(
                    search.trim(), search.trim(), search.trim(), pageable).map(this::mapToOrderResponseDTO);
        }
        if (StringUtils.hasText(status)) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(), pageable)
                    .map(this::mapToOrderResponseDTO);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToOrderResponseDTO);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateAdminNotes(UUID orderId, String adminNotes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setAdminNotes(adminNotes != null ? adminNotes.trim() : null);
        Order saved = orderRepository.save(order);
        return mapToOrderResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getKitchenOrdersForToday() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        return orderRepository.findKitchenOrdersForDate(today).stream()
                .map(this::mapToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrderStatus(UUID orderId, String newStatus, String comment, UserPrincipal staffPrincipal) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String oldStatus = order.getStatus();
        order.setStatus(newStatus.toUpperCase());

        if ("DELIVERED".equalsIgnoreCase(newStatus) || "COMPLETED".equalsIgnoreCase(newStatus)) {
            order.setPaymentStatus("PAID");
            paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
                p.setStatus("COMPLETED");
                p.setPaidAt(Instant.now());
                paymentRepository.save(p);
            });
        }

        Order saved = orderRepository.save(order);

        User staffUser = staffPrincipal != null
                ? userRepository.findById(staffPrincipal.getId()).orElse(null)
                : null;

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(saved)
                .previousStatus(oldStatus)
                .newStatus(newStatus.toUpperCase())
                .changedByUser(staffUser)
                .comment(comment)
                .createdAt(Instant.now())
                .build();
        statusHistoryRepository.save(history);

        return mapToOrderResponseDTO(saved);
    }

    private BigDecimal calculateUnitPrice(Product product, ProductVariant variant) {
        BigDecimal base = (product.getPromotionalPrice() != null && product.getPromotionalPrice().compareTo(BigDecimal.ZERO) > 0)
                ? product.getPromotionalPrice()
                : product.getBasePrice();

        if (variant != null && variant.getPriceAdjustment() != null) {
            return base.add(variant.getPriceAdjustment());
        }
        return base;
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(i -> OrderItemDTO.builder()
                        .id(i.getId())
                        .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                        .productName(i.getProductName())
                        .variantId(i.getVariant() != null ? i.getVariant().getId() : null)
                        .variantName(i.getVariantName())
                        .sku(i.getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .customizationSnapshot(i.getCustomizationSnapshot())
                        .build())
                .collect(Collectors.toList());

        List<OrderStatusHistoryDTO> historyDTOs = statusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()).stream()
                .map(h -> OrderStatusHistoryDTO.builder()
                        .id(h.getId())
                        .previousStatus(h.getPreviousStatus())
                        .newStatus(h.getNewStatus())
                        .comment(h.getComment())
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        BankTransferDetailsDTO bankDetails = null;
        if ("BANK_TRANSFER".equalsIgnoreCase(order.getPaymentMethod())) {
            String encodedNote = URLEncoder.encode(order.getOrderNumber(), StandardCharsets.UTF_8);
            String qrUrl = String.format("https://img.vietqr.io/image/970407-190367898888-compact.png?amount=%s&addInfo=%s&accountName=MAISON+DOUCE+BAKERY",
                    order.getTotalAmount().toPlainString(), encodedNote);

            bankDetails = BankTransferDetailsDTO.builder()
                    .bankName("Techcombank (Ngân hàng Kỹ thương Việt Nam)")
                    .accountNumber("190367898888")
                    .accountName("MAISON DOUCE BAKERY CO LTD")
                    .amount(order.getTotalAmount())
                    .transferNote(order.getOrderNumber())
                    .qrCodeUrl(qrUrl)
                    .build();
        }

        return OrderResponseDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .fulfillmentType(order.getFulfillmentType())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null)
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryZoneName(order.getDeliveryZone() != null ? order.getDeliveryZone().getName() : null)
                .deliveryDate(order.getDeliveryDate())
                .timeSlotName(order.getTimeSlotName())
                .customerNotes(order.getCustomerNotes())
                .items(itemDTOs)
                .statusHistory(historyDTOs)
                .bankTransferDetails(bankDetails)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private List<OrderTrackingDTO.TrackingStepDTO> buildTimeline(Order order, List<OrderStatusHistory> history) {
        String[] statuses = "STORE_PICKUP".equalsIgnoreCase(order.getFulfillmentType())
                ? new String[]{"CONFIRMED", "PREPARING", "BAKING", "DECORATING", "READY_FOR_PICKUP", "COMPLETED"}
                : new String[]{"CONFIRMED", "PREPARING", "BAKING", "DECORATING", "OUT_FOR_DELIVERY", "DELIVERED"};

        Map<String, Instant> timestamps = new HashMap<>();
        for (OrderStatusHistory h : history) {
            timestamps.put(h.getNewStatus(), h.getCreatedAt());
        }

        int currentIndex = -1;
        for (int i = 0; i < statuses.length; i++) {
            if (statuses[i].equalsIgnoreCase(order.getStatus())) {
                currentIndex = i;
                break;
            }
        }

        List<OrderTrackingDTO.TrackingStepDTO> timeline = new ArrayList<>();
        for (int i = 0; i < statuses.length; i++) {
            String code = statuses[i];
            boolean isCompleted = currentIndex >= i;
            boolean isCurrent = currentIndex == i;

            timeline.add(OrderTrackingDTO.TrackingStepDTO.builder()
                    .statusCode(code)
                    .labelVi(mapStatusLabelVi(code))
                    .labelEn(mapStatusLabelEn(code))
                    .description(mapStatusDescVi(code))
                    .completed(isCompleted)
                    .current(isCurrent)
                    .timestamp(timestamps.get(code))
                    .build());
        }

        return timeline;
    }

    private String mapStatusLabelVi(String status) {
        return switch (status.toUpperCase()) {
            case "PENDING_PAYMENT" -> "Chờ thanh toán";
            case "PAYMENT_REVIEW" -> "Kiểm tra chuyển khoản";
            case "CONFIRMED" -> "Đã xác nhận";
            case "PREPARING" -> "Chuẩn bị nguyên liệu";
            case "BAKING" -> "Đang nướng bánh";
            case "DECORATING" -> "Trang trí hoàn thiện";
            case "READY_FOR_PICKUP" -> "Sẵn sàng nhận tại tiệm";
            case "OUT_FOR_DELIVERY" -> "Đang giao bánh";
            case "DELIVERED" -> "Đã giao thành công";
            case "COMPLETED" -> "Đã hoàn thành";
            case "CANCELLED" -> "Đã hủy đơn";
            default -> status;
        };
    }

    private String mapStatusLabelEn(String status) {
        return switch (status.toUpperCase()) {
            case "PENDING_PAYMENT" -> "Pending Payment";
            case "PAYMENT_REVIEW" -> "Payment Review";
            case "CONFIRMED" -> "Order Confirmed";
            case "PREPARING" -> "Preparing Ingredients";
            case "BAKING" -> "Baking in Oven";
            case "DECORATING" -> "Artisan Decorating";
            case "READY_FOR_PICKUP" -> "Ready for Store Pickup";
            case "OUT_FOR_DELIVERY" -> "Out for Delivery";
            case "DELIVERED" -> "Delivered";
            case "COMPLETED" -> "Completed";
            case "CANCELLED" -> "Cancelled";
            default -> status;
        };
    }

    private String mapStatusDescVi(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> "Đơn hàng đã được ghi nhận vào hệ thống Maison Douce.";
            case "PREPARING" -> "Đầu bếp đang tuyển chọn bơ Pháp, vani Madagascar và bột tươi.";
            case "BAKING" -> "Bánh đang được nướng ở nhiệt độ tiêu chuẩn để đạt độ mềm ẩm hoàn hảo.";
            case "DECORATING" -> "Nghệ nhân pastry đang tỉ mỉ tạo hình kem tươi và hoa quả tự nhiên.";
            case "READY_FOR_PICKUP" -> "Hộp bánh sang trọng đã sẵn sàng tại quầy đón khách.";
            case "OUT_FOR_DELIVERY" -> "Tài xế chuyên dụng đang vận chuyển bánh trong thùng giữ nhiệt.";
            case "DELIVERED", "COMPLETED" -> "Chúc quý khách có những phút giây ngọt ngào trọn vẹn!";
            default -> "";
        };
    }
}
