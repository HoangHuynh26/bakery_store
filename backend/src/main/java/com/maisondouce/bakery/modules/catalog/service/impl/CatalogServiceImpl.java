package com.maisondouce.bakery.modules.catalog.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.catalog.dto.*;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.repository.CategoryRepository;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.catalog.service.CatalogService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CatalogServiceImpl implements CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CatalogServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryBySlug(String slug) {
        return categoryRepository.findBySlugAndActiveTrue(slug)
                .map(CategoryDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductSummaryDTO> getProducts(CatalogFilterCriteria criteria) {
        Sort sort = determineSort(criteria.getSortBy());
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only active products
            predicates.add(cb.isTrue(root.get("active")));

            // Category filter
            if (StringUtils.hasText(criteria.getCategory())) {
                predicates.add(cb.equal(root.get("category").get("slug"), criteria.getCategory()));
            }

            // Keyword search (Vietnamese or English name or description)
            if (StringUtils.hasText(criteria.getKeyword())) {
                String pattern = "%" + criteria.getKeyword().trim().toLowerCase() + "%";
                Predicate nameViMatch = cb.like(cb.lower(root.get("nameVi")), pattern);
                Predicate nameEnMatch = cb.like(cb.lower(root.get("nameEn")), pattern);
                Predicate descViMatch = cb.like(cb.lower(root.get("descriptionVi")), pattern);
                predicates.add(cb.or(nameViMatch, nameEnMatch, descViMatch));
            }

            // Price range
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), criteria.getMaxPrice()));
            }

            // Dietary tags
            if (StringUtils.hasText(criteria.getDietaryTag())) {
                predicates.add(cb.like(cb.lower(root.get("dietaryTags")), "%" + criteria.getDietaryTag().toLowerCase() + "%"));
            }

            // Featured only
            if (Boolean.TRUE.equals(criteria.getFeaturedOnly())) {
                predicates.add(cb.isTrue(root.get("featured")));
            }

            // In stock only
            if (Boolean.TRUE.equals(criteria.getInStockOnly())) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(ProductSummaryDTO::fromEntity);
    }

    @Override
    @Transactional
    public ProductDetailDTO getProductBySlugOrId(String identifier) {
        Product product;
        try {
            UUID uuid = UUID.fromString(identifier);
            product = productRepository.findByIdAndActiveTrue(uuid)
                    .orElseGet(() -> productRepository.findBySlugAndActiveTrue(identifier)
                            .orElseThrow(() -> new ResourceNotFoundException("Product", "identifier", identifier)));
        } catch (IllegalArgumentException e) {
            product = productRepository.findBySlugAndActiveTrue(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", identifier));
        }

        // Increment view count asynchronously/in transaction
        productRepository.incrementViewCount(product.getId());

        return ProductDetailDTO.fromEntity(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc().stream()
                .map(ProductSummaryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSearchSuggestions(String query) {
        if (!StringUtils.hasText(query) || query.trim().length() < 2) {
            return List.of();
        }
        return productRepository.findSearchSuggestions(query.trim(), PageRequest.of(0, 8));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> getRelatedProducts(UUID productId, int limit) {
        Product current = productRepository.findById(productId).orElse(null);
        if (current == null || current.getCategory() == null) {
            return List.of();
        }

        CatalogFilterCriteria criteria = CatalogFilterCriteria.builder()
                .category(current.getCategory().getSlug())
                .size(limit + 1)
                .build();

        return getProducts(criteria).getContent().stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private Sort determineSort(String sortBy) {
        if (!StringUtils.hasText(sortBy)) {
            return Sort.by("createdAt").descending();
        }
        return switch (sortBy) {
            case "price_asc" -> Sort.by("basePrice").ascending();
            case "price_desc" -> Sort.by("basePrice").descending();
            case "popularity" -> Sort.by("viewCount").descending();
            case "name" -> Sort.by("nameVi").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
