package com.maisondouce.bakery.modules.support.repository;

import com.maisondouce.bakery.modules.support.entity.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupportMessageRepository extends JpaRepository<SupportMessage, UUID> {
    List<SupportMessage> findByTicketIdOrderByCreatedAtAsc(UUID ticketId);
}
