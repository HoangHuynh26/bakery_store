package com.maisondouce.bakery.modules.inventory.repository;

import com.maisondouce.bakery.modules.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findByIngredientIdOrderByCreatedAtDesc(UUID ingredientId);
    List<StockMovement> findTop30ByOrderByCreatedAtDesc();
}
