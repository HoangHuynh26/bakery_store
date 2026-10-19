package com.maisondouce.bakery.modules.review.repository;

import com.maisondouce.bakery.modules.review.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {

    List<ProductReview> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(UUID productId);

    List<ProductReview> findByApprovedTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<ProductReview> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByProductIdAndApprovedTrue(UUID productId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating as double)), 5.0) FROM ProductReview r WHERE r.product.id = :productId AND r.approved = true")
    Double findAverageRatingByProductId(@Param("productId") UUID productId);
}
