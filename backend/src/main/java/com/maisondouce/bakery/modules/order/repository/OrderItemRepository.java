package com.maisondouce.bakery.modules.order.repository;

import com.maisondouce.bakery.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderId(UUID orderId);

    boolean existsByOrderUserIdAndProductId(UUID userId, UUID productId);
}
