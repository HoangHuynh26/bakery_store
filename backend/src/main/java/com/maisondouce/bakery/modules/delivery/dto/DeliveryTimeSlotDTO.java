package com.maisondouce.bakery.modules.delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryTimeSlotDTO {
    private UUID id;
    private String slotName;
    private LocalTime startTime;
    private LocalTime endTime;
    private int maxOrdersCapacity;
    private boolean active;
}
