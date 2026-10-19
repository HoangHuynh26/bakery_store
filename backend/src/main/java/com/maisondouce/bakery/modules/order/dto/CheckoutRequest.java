package com.maisondouce.bakery.modules.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @NotBlank(message = "Recipient name is required")
    @Size(max = 150)
    private String recipientName;

    @NotBlank(message = "Recipient phone is required")
    @Size(max = 20)
    private String recipientPhone;

    private String recipientEmail;

    @Builder.Default
    private String fulfillmentType = "DELIVERY"; // DELIVERY, STORE_PICKUP

    private String deliveryAddress;

    private UUID deliveryZoneId;

    @NotNull(message = "Delivery date is required")
    private LocalDate deliveryDate;

    private UUID deliveryTimeSlotId;

    @Builder.Default
    private String paymentMethod = "COD"; // COD, STORE_PICKUP, BANK_TRANSFER

    private String couponCode;

    private String customerNotes;

    private String guestSessionToken;
}
