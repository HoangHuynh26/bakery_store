package com.maisondouce.bakery.modules.support.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketDTO {
    private UUID id;
    private String ticketNumber;
    private String customerName;
    private String customerEmail;
    private String subject;
    private String category;
    private String status;
    private String priority;
    private String referenceOrderNumber;
    private Instant createdAt;
    private Instant updatedAt;
    private List<SupportMessageDTO> messages;
}
