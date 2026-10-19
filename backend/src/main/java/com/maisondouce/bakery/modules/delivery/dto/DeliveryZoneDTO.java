package com.maisondouce.bakery.modules.delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryZoneDTO {
    private UUID id;
    private String name;
    private String districts;
    private BigDecimal standardFee;
    private BigDecimal freeDeliveryThreshold;
    private boolean active;
}
