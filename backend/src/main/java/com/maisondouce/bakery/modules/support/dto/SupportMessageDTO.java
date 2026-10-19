package com.maisondouce.bakery.modules.support.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportMessageDTO {
    private UUID id;
    private String senderName;
    private boolean staffReply;
    private String message;
    private Instant createdAt;
}
