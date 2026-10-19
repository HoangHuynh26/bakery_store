package com.maisondouce.bakery.modules.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDTO {
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> ratingCounts;
    private List<ProductReviewDTO> reviews;
}
