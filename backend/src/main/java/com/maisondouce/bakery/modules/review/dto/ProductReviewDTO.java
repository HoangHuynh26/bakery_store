package com.maisondouce.bakery.modules.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private String authorName;
    private int rating;
    private String comment;
    private String imageUrl;
    private boolean verifiedPurchase;
    private boolean approved;
    private Instant createdAt;
}
