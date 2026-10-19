package com.maisondouce.bakery.modules.customcake.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomCakeCreateRequest {
    private String customerName;
    private String customerPhone;
    private String customerEmail;

    @NotBlank(message = "Loại bánh không được để trống")
    private String cakeType;

    @NotBlank(message = "Hình dáng bánh không được để trống")
    private String shape;

    @NotBlank(message = "Kích cỡ / số phần ăn không được để trống")
    private String sizeServings;

    @NotBlank(message = "Vị cốt bánh không được để trống")
    private String flavor;

    @NotBlank(message = "Nhân bánh không được để trống")
    private String filling;

    @NotBlank(message = "Loại kem phủ không được để trống")
    private String frosting;

    private String colorTheme;
    private String pipingMessage;
    private String specialInstructions;
    private String referenceImageUrl;

    @NotNull(message = "Ngày nhận bánh không được để trống")
    private LocalDate preferredDate;

    private String preferredTime;
}
