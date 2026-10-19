package com.maisondouce.bakery.modules.catalog.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.catalog.dto.*;
import com.maisondouce.bakery.modules.catalog.entity.Category;
import com.maisondouce.bakery.modules.catalog.entity.Product;
import com.maisondouce.bakery.modules.catalog.entity.ProductImage;
import com.maisondouce.bakery.modules.catalog.entity.ProductVariant;
import com.maisondouce.bakery.modules.catalog.repository.CategoryRepository;
import com.maisondouce.bakery.modules.catalog.repository.ProductRepository;
import com.maisondouce.bakery.modules.catalog.service.AdminCatalogService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminCatalogServiceImpl implements AdminCatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDetailDTO> getAdminProducts(String search, UUID categoryId, Boolean active, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameViMatch = cb.like(cb.lower(root.get("nameVi")), pattern);
                Predicate nameEnMatch = cb.like(cb.lower(root.get("nameEn")), pattern);
                Predicate skuMatch = cb.like(cb.lower(root.get("sku")), pattern);
                predicates.add(cb.or(nameViMatch, nameEnMatch, skuMatch));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(ProductDetailDTO::fromEntity);
    }

    @Override
    @Transactional
    public ProductDetailDTO createProduct(AdminProductRequest request) {
        if (productRepository.findBySku(request.getSku()).isPresent()) {
            throw new BadRequestException("Mã SKU '" + request.getSku() + "' đã tồn tại trong hệ thống.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        String slug = StringUtils.hasText(request.getSlug())
                ? toSlug(request.getSlug())
                : toSlug(request.getNameEn() + "-" + request.getSku());

        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        Product product = new Product();
        product.setSku(request.getSku().trim().toUpperCase());
        product.setSlug(slug);
        product.setNameVi(request.getNameVi().trim());
        product.setNameEn(request.getNameEn().trim());
        product.setCategory(category);
        product.setDescriptionVi(request.getDescriptionVi());
        product.setDescriptionEn(request.getDescriptionEn());
        product.setBasePrice(request.getBasePrice());
        product.setPromotionalPrice(request.getPromotionalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setLeadTimeHours(request.getLeadTimeHours());
        product.setShelfLifeDays(request.getShelfLifeDays());
        product.setStorageInstructions(request.getStorageInstructions());
        product.setIngredientsVi(request.getIngredientsVi());
        product.setIngredientsEn(request.getIngredientsEn());
        product.setDietaryTags(request.getDietaryTags());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());
        product.setImages(new ArrayList<>());
        product.setVariants(new ArrayList<>());

        // Main Image
        if (StringUtils.hasText(request.getMainImageUrl())) {
            ProductImage mainImg = ProductImage.builder()
                    .product(product)
                    .imageUrl(request.getMainImageUrl().trim())
                    .altText(request.getNameVi())
                    .thumbnail(true)
                    .displayOrder(0)
                    .build();
            product.getImages().add(mainImg);
        }

        // Gallery Images
        if (request.getGalleryImageUrls() != null) {
            int order = 1;
            for (String imgUrl : request.getGalleryImageUrls()) {
                if (StringUtils.hasText(imgUrl) && !imgUrl.trim().equals(request.getMainImageUrl())) {
                    ProductImage gImg = ProductImage.builder()
                            .product(product)
                            .imageUrl(imgUrl.trim())
                            .altText(request.getNameVi())
                            .thumbnail(false)
                            .displayOrder(order++)
                            .build();
                    product.getImages().add(gImg);
                }
            }
        }

        // Variants
        if (request.getVariants() != null) {
            for (AdminVariantRequest varReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .nameEn(varReq.getNameEn())
                        .nameVi(varReq.getNameVi())
                        .sku(varReq.getSku() != null ? varReq.getSku() : product.getSku() + "-" + (varReq.getNameEn() != null ? varReq.getNameEn().replaceAll("\\s+", "-") : "VAR"))
                        .priceAdjustment(varReq.getPriceAdjustment())
                        .stockQuantity(varReq.getStockQuantity())
                        .servingCount(varReq.getSize())
                        .active(true)
                        .build();
                product.getVariants().add(variant);
            }
        }

        Product saved = productRepository.save(product);
        return ProductDetailDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductDetailDTO updateProduct(UUID productId, AdminProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.getSku().equalsIgnoreCase(request.getSku().trim())) {
            if (productRepository.findBySku(request.getSku().trim()).isPresent()) {
                throw new BadRequestException("Mã SKU '" + request.getSku() + "' đã thuộc về sản phẩm khác.");
            }
            product.setSku(request.getSku().trim().toUpperCase());
        }

        if (!product.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        product.setNameVi(request.getNameVi().trim());
        product.setNameEn(request.getNameEn().trim());
        product.setDescriptionVi(request.getDescriptionVi());
        product.setDescriptionEn(request.getDescriptionEn());
        product.setBasePrice(request.getBasePrice());
        product.setPromotionalPrice(request.getPromotionalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setLeadTimeHours(request.getLeadTimeHours());
        product.setShelfLifeDays(request.getShelfLifeDays());
        product.setStorageInstructions(request.getStorageInstructions());
        product.setIngredientsVi(request.getIngredientsVi());
        product.setIngredientsEn(request.getIngredientsEn());
        product.setDietaryTags(request.getDietaryTags());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        // Update main image if specified
        if (StringUtils.hasText(request.getMainImageUrl())) {
            boolean hasPrimary = false;
            for (ProductImage img : product.getImages()) {
                if (img.isThumbnail()) {
                    img.setImageUrl(request.getMainImageUrl().trim());
                    hasPrimary = true;
                    break;
                }
            }
            if (!hasPrimary) {
                ProductImage newPrimary = ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getMainImageUrl().trim())
                        .altText(product.getNameVi())
                        .thumbnail(true)
                        .displayOrder(0)
                        .build();
                product.getImages().add(0, newPrimary);
            }
        }

        Product saved = productRepository.save(product);
        return ProductDetailDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductDetailDTO toggleProductStatus(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        product.setActive(!product.isActive());
        Product saved = productRepository.save(product);
        return ProductDetailDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductDetailDTO updateStock(UUID productId, int newStock) {
        if (newStock < 0) {
            throw new BadRequestException("Số lượng tồn kho không thể âm.");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        product.setStockQuantity(newStock);
        Product saved = productRepository.save(product);
        return ProductDetailDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        // Soft delete to protect historical order records
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(AdminCategoryRequest request) {
        String slug = StringUtils.hasText(request.getSlug())
                ? toSlug(request.getSlug())
                : toSlug(request.getNameEn());

        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        Category category = Category.builder()
                .slug(slug)
                .nameVi(request.getNameVi().trim())
                .nameEn(request.getNameEn().trim())
                .descriptionVi(request.getDescriptionVi())
                .descriptionEn(request.getDescriptionEn())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder())
                .active(request.isActive())
                .build();

        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(UUID categoryId, AdminCategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        category.setNameVi(request.getNameVi().trim());
        category.setNameEn(request.getNameEn().trim());
        category.setDescriptionVi(request.getDescriptionVi());
        category.setDescriptionEn(request.getDescriptionEn());
        if (StringUtils.hasText(request.getImageUrl())) {
            category.setImageUrl(request.getImageUrl().trim());
        }
        category.setDisplayOrder(request.getDisplayOrder());
        category.setActive(request.isActive());

        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        category.setActive(false);
        categoryRepository.save(category);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
