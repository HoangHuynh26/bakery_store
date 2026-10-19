package com.maisondouce.bakery.modules.delivery.repository;

import com.maisondouce.bakery.modules.delivery.entity.DeliveryTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryTimeSlotRepository extends JpaRepository<DeliveryTimeSlot, UUID> {
    List<DeliveryTimeSlot> findAllByActiveTrueOrderByStartTimeAsc();
}
