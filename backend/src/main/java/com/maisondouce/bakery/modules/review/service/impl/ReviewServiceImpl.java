package com.maisondouce.bakery.modules.review.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.order.repository.OrderItemRepository;
import com.maisondouce.bakery.modules.review.dto.CreateReviewRequest;
import com.maisondouce.bakery.modules.review.dto.ProductReviewDTO;
import com.maisondouce.bakery.modules.review.dto.ReviewSummaryDTO;
import com.maisondouce.bakery.modules.review.entity.ProductReview;
import com.maisondouce.bakery.modules.review.repository.ProductReviewRepository;
import com.maisondouce.bakery.modules.review.service.ReviewService;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewServiceImpl(ProductReviewRepository reviewRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository,
                             OrderItemRepository orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryDTO getProductReviews(UUID productId) {
        List<ProductReview> reviews = reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId);

        double avgRating = 5.0;
        Map<Integer, Long> ratingCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingCounts.put(i, 0L);
        }

        if (!reviews.isEmpty()) {
            double sum = 0.0;
            for (ProductReview r : reviews) {
                sum += r.getRating();
                ratingCounts.put(r.getRating(), ratingCounts.getOrDefault(r.getRating(), 0L) + 1);
            }
            avgRating = Math.round((sum / reviews.size()) * 10.0) / 10.0;
        }

        List<ProductReviewDTO> dtoList = reviews.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ReviewSummaryDTO.builder()
                .averageRating(avgRating)
                .totalReviews(reviews.size())
                .ratingCounts(ratingCounts)
                .reviews(dtoList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductReviewDTO> getFeaturedReviews() {
        return reviewRepository.findByApprovedTrueOrderByCreatedAtDesc(PageRequest.of(0, 6))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductReviewDTO createReview(UUID userId, CreateReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        boolean isVerified = orderItemRepository.existsByOrderUserIdAndProductId(userId, product.getId());

        ProductReview review = ProductReview.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .imageUrl(request.getImageUrl())
                .verifiedPurchase(isVerified)
                .approved(true) // default approved for authentic experience
                .build();

        ProductReview saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductReviewDTO> getAllReviewsAdmin(Pageable pageable) {
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional
    public ProductReviewDTO updateReviewApproval(UUID reviewId, boolean approved) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductReview", "id", reviewId));
        review.setApproved(approved);
        return mapToDTO(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("ProductReview", "id", reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    private ProductReviewDTO mapToDTO(ProductReview review) {
        return ProductReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .productName(review.getProduct() != null ? review.getProduct().getNameVi() : null)
                .authorName(review.getUser() != null ? review.getUser().getFullName() : "Khách hàng Maison Douce")
                .rating(review.getRating())
                .comment(review.getComment())
                .imageUrl(review.getImageUrl())
                .verifiedPurchase(review.isVerifiedPurchase())
                .approved(review.isApproved())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
