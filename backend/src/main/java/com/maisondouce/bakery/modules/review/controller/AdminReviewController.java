package com.maisondouce.bakery.modules.review.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.review.dto.ProductReviewDTO;
import com.maisondouce.bakery.modules.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin Reviews", description = "Admin Review Moderation")
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Get all customer reviews with pagination")
    public ResponseEntity<ApiResponse<Page<ProductReviewDTO>>> getAllReviews(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<ProductReviewDTO> page = reviewService.getAllReviewsAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PatchMapping("/{id}/approval")
    @Operation(summary = "Approve or hide a customer review")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> updateApproval(
            @PathVariable UUID id,
            @RequestParam boolean approved
    ) {
        ProductReviewDTO updated = reviewService.updateReviewApproval(id, approved);
        return ResponseEntity.ok(ApiResponse.success("Trạng thái đánh giá đã được cập nhật", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inappropriate review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Đánh giá đã được xoá thành công", null));
    }
}
