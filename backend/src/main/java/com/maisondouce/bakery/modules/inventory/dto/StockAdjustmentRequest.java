package com.maisondouce.bakery.modules.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class StockAdjustmentRequest {

    @NotNull(message = "ID nguyên liệu không được để trống")
    private UUID ingredientId;

    @NotNull(message = "Số lượng điều chỉnh không được để trống")
    private BigDecimal quantity;

    @NotBlank(message = "Loại biến động không được để trống")
    private String movementType; // INBOUND, PRODUCTION_DEDUCTION, SPOILAGE, MANUAL_ADJUSTMENT

    private String reason;
}
