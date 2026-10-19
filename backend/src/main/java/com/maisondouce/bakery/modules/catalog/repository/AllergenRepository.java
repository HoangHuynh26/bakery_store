package com.maisondouce.bakery.modules.catalog.repository;

import com.maisondouce.bakery.modules.catalog.entity.Allergen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AllergenRepository extends JpaRepository<Allergen, UUID> {
    Optional<Allergen> findByCode(String code);
}
