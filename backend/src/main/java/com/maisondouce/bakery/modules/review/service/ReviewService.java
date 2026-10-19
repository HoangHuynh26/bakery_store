package com.maisondouce.bakery.modules.review.service;

import com.maisondouce.bakery.modules.review.dto.CreateReviewRequest;
import com.maisondouce.bakery.modules.review.dto.ProductReviewDTO;
import com.maisondouce.bakery.modules.review.dto.ReviewSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    ReviewSummaryDTO getProductReviews(UUID productId);

    List<ProductReviewDTO> getFeaturedReviews();

    ProductReviewDTO createReview(UUID userId, CreateReviewRequest request);

    Page<ProductReviewDTO> getAllReviewsAdmin(Pageable pageable);

    ProductReviewDTO updateReviewApproval(UUID reviewId, boolean approved);

    void deleteReview(UUID reviewId);
}
