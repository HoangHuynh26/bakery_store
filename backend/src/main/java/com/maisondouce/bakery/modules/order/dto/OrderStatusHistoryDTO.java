package com.maisondouce.bakery.modules.order.dto;

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
public class OrderStatusHistoryDTO {
    private UUID id;
    private String previousStatus;
    private String newStatus;
    private String comment;
    private Instant createdAt;
}
