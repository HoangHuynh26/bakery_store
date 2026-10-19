package com.maisondouce.bakery.modules.customcake.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationSubmitRequest {

    @NotNull(message = "Số tiền báo giá không được để trống")
    @Positive(message = "Số tiền báo giá phải lớn hơn 0")
    private BigDecimal quotationAmount;

    private String adminNotes;
}
