package com.maisondouce.bakery.modules.review.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.review.dto.CreateReviewRequest;
import com.maisondouce.bakery.modules.review.dto.ProductReviewDTO;
import com.maisondouce.bakery.modules.review.dto.ReviewSummaryDTO;
import com.maisondouce.bakery.modules.review.service.ReviewService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Product Reviews", description = "Customer reviews and verified product ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all approved reviews and rating breakdown for a product")
    public ResponseEntity<ApiResponse<ReviewSummaryDTO>> getProductReviews(@PathVariable UUID productId) {
        ReviewSummaryDTO summary = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured recent customer reviews")
    public ResponseEntity<ApiResponse<List<ProductReviewDTO>>> getFeaturedReviews() {
        List<ProductReviewDTO> featured = reviewService.getFeaturedReviews();
        return ResponseEntity.ok(ApiResponse.success(featured));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a customer product review")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> submitReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ProductReviewDTO response = reviewService.createReview(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đánh giá sản phẩm đã được gửi thành công!", response));
    }
}
