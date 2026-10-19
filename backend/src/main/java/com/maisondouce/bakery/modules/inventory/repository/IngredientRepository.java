package com.maisondouce.bakery.modules.inventory.repository;

import com.maisondouce.bakery.modules.inventory.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, UUID> {
    Optional<Ingredient> findByCode(String code);
    List<Ingredient> findAllByOrderByNameAsc();
}
