package com.maisondouce.bakery.modules.loyalty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTransactionDTO {
    private UUID id;
    private int pointsChange;
    private String transactionType;
    private String referenceOrderNumber;
    private String description;
    private Instant createdAt;
}
