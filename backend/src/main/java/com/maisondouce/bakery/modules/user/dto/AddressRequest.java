package com.maisondouce.bakery.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    @NotBlank(message = "Recipient name is required")
    @Size(max = 150)
    private String recipientName;

    @NotBlank(message = "Phone number is required")
    @Size(max = 20)
    private String phoneNumber;

    @NotBlank(message = "Street address is required")
    @Size(max = 255)
    private String streetAddress;

    private String ward;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @Builder.Default
    private String city = "Ho Chi Minh City";

    private boolean defaultAddress;

    private String deliveryNote;
}
