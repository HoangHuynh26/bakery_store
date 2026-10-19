package com.maisondouce.bakery.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private UUID id;
    private String orderNumber;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String fulfillmentType;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private String couponCode;
    private String recipientName;
    private String recipientPhone;
    private String deliveryAddress;
    private String deliveryZoneName;
    private LocalDate deliveryDate;
    private String timeSlotName;
    private String customerNotes;
    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();
    @Builder.Default
    private List<OrderStatusHistoryDTO> statusHistory = new ArrayList<>();
    private BankTransferDetailsDTO bankTransferDetails;
    private Instant createdAt;
}
