package com.maisondouce.bakery.modules.support.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.support.dto.CreateTicketRequest;
import com.maisondouce.bakery.modules.support.dto.FaqChatRequest;
import com.maisondouce.bakery.modules.support.dto.FaqChatResponse;
import com.maisondouce.bakery.modules.support.dto.SupportTicketDTO;
import com.maisondouce.bakery.modules.support.service.SupportService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
@Tag(name = "Customer Support & Concierge", description = "Customer tickets and rule-based concierge chat")
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/faq-chat")
    @Operation(summary = "Ask the Maison Douce Boutique Concierge a question")
    public ResponseEntity<ApiResponse<FaqChatResponse>> askConcierge(
            @Valid @RequestBody FaqChatRequest request
    ) {
        FaqChatResponse response = supportService.answerConciergeQuestion(request.getMessage());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/tickets")
    @Operation(summary = "Create a customer inquiry support ticket")
    public ResponseEntity<ApiResponse<SupportTicketDTO>> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        UUID userId = currentUser != null ? currentUser.getId() : null;
        SupportTicketDTO ticket = supportService.createTicket(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Yêu cầu hỗ trợ đã được tạo thành công", ticket));
    }

    @GetMapping("/my-tickets")
    @Operation(summary = "Get list of support tickets for current user")
    public ResponseEntity<ApiResponse<List<SupportTicketDTO>>> getMyTickets(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }
        List<SupportTicketDTO> tickets = supportService.getUserTickets(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(tickets));
    }

    @GetMapping("/tickets/{ticketNumber}")
    @Operation(summary = "Get ticket details by ticket number")
    public ResponseEntity<ApiResponse<SupportTicketDTO>> getTicket(@PathVariable String ticketNumber) {
        SupportTicketDTO ticket = supportService.getTicketByNumber(ticketNumber);
        return ResponseEntity.ok(ApiResponse.success(ticket));
    }
}
