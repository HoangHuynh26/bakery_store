package com.maisondouce.bakery.modules.support.repository;

import com.maisondouce.bakery.modules.support.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);

    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Page<SupportTicket> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
