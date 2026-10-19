package com.maisondouce.bakery.modules.support.service;

import com.maisondouce.bakery.modules.support.dto.CreateTicketRequest;
import com.maisondouce.bakery.modules.support.dto.FaqChatResponse;
import com.maisondouce.bakery.modules.support.dto.SupportTicketDTO;

import java.util.List;
import java.util.UUID;

public interface SupportService {

    SupportTicketDTO createTicket(UUID userId, CreateTicketRequest request);

    List<SupportTicketDTO> getUserTickets(UUID userId);

    SupportTicketDTO getTicketByNumber(String ticketNumber);

    FaqChatResponse answerConciergeQuestion(String userMessage);
}
