package com.maisondouce.bakery.modules.order.repository;

import com.maisondouce.bakery.modules.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Page<Order> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Order> findByRecipientPhoneOrderByCreatedAtDesc(String recipientPhone);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.deliveryDate = :date AND o.deliveryTimeSlot.id = :slotId AND o.status <> 'CANCELLED'")
    long countOrdersForSlotOnDate(@Param("date") LocalDate date, @Param("slotId") UUID slotId);
}
