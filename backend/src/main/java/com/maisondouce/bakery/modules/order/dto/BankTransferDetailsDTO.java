package com.maisondouce.bakery.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankTransferDetailsDTO {
    private String bankName;
    private String accountNumber;
    private String accountName;
    private BigDecimal amount;
    private String transferNote;
    private String qrCodeUrl;
}
