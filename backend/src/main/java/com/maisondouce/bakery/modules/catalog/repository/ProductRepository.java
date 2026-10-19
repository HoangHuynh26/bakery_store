package com.maisondouce.bakery.modules.catalog.repository;

import com.maisondouce.bakery.modules.catalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findBySlugAndActiveTrue(String slug);

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findByIdAndActiveTrue(UUID id);

    List<Product> findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT p.nameVi FROM Product p WHERE p.active = true AND (LOWER(p.nameVi) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.nameEn) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<String> findSearchSuggestions(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}
