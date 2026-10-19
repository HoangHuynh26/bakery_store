package com.maisondouce.bakery.modules.customcake.dto;

import com.maisondouce.bakery.modules.customcake.entity.CustomCakeRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomCakeResponse {
    private UUID id;
    private String requestNumber;
    private UUID userId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String cakeType;
    private String shape;
    private String sizeServings;
    private String flavor;
    private String filling;
    private String frosting;
    private String colorTheme;
    private String pipingMessage;
    private String specialInstructions;
    private String referenceImageUrl;
    private LocalDate preferredDate;
    private String preferredTime;
    private String status;
    private BigDecimal quotationAmount;
    private String adminQuotationNotes;
    private Instant createdAt;
    private Instant updatedAt;

    public static CustomCakeResponse fromEntity(CustomCakeRequest entity) {
        if (entity == null) return null;
        return CustomCakeResponse.builder()
                .id(entity.getId())
                .requestNumber(entity.getRequestNumber())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .cakeType(entity.getCakeType())
                .shape(entity.getShape())
                .sizeServings(entity.getSizeServings())
                .flavor(entity.getFlavor())
                .filling(entity.getFilling())
                .frosting(entity.getFrosting())
                .colorTheme(entity.getColorTheme())
                .pipingMessage(entity.getPipingMessage())
                .specialInstructions(entity.getSpecialInstructions())
                .referenceImageUrl(entity.getReferenceImageUrl())
                .preferredDate(entity.getPreferredDate())
                .preferredTime(entity.getPreferredTime())
                .status(entity.getStatus())
                .quotationAmount(entity.getQuotationAmount())
                .adminQuotationNotes(entity.getAdminQuotationNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
