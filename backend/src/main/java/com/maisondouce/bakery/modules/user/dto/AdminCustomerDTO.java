package com.maisondouce.bakery.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Set<String> roles = new HashSet<>();
    private boolean active;
    private long orderCount = 0;
    private BigDecimal totalSpent = BigDecimal.ZERO;
    private Instant createdAt;
}
