package com.maisondouce.bakery.modules.support.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {

    @NotBlank(message = "Tiêu đề yêu cầu hỗ trợ không được để trống")
    private String subject;

    @NotBlank(message = "Danh mục yêu cầu không được để trống")
    private String category; // ORDER_INQUIRY, CUSTOM_CAKE, DELIVERY, PRODUCT_FEEDBACK, OTHER

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String message;

    private UUID orderId;
}
