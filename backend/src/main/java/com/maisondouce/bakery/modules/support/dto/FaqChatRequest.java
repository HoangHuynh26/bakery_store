package com.maisondouce.bakery.modules.support.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaqChatRequest {
    @NotBlank(message = "Tin nhắn không được để trống")
    private String message;
}
