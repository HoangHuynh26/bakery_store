package com.maisondouce.bakery.modules.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductRequest {

    @NotBlank(message = "Tên bánh tiếng Việt không được để trống")
    private String nameVi;

    @NotBlank(message = "Tên bánh tiếng Anh không được để trống")
    private String nameEn;

    private String slug;

    @NotBlank(message = "Mã SKU không được để trống")
    private String sku;

    @NotNull(message = "Danh mục bánh không được để trống")
    private UUID categoryId;

    private String descriptionVi;
    private String descriptionEn;

    @NotNull(message = "Giá gốc không được để trống")
    @DecimalMin(value = "0.00", message = "Giá gốc phải lớn hơn hoặc bằng 0")
    private BigDecimal basePrice;

    private BigDecimal promotionalPrice;

    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private int stockQuantity = 10;

    @Min(value = 0, message = "Thời gian chuẩn bị không được âm")
    private int leadTimeHours = 2;

    @Min(value = 1, message = "Hạn sử dụng tối thiểu 1 ngày")
    private int shelfLifeDays = 3;

    private String storageInstructions;
    private String ingredientsVi;
    private String ingredientsEn;
    private String dietaryTags;

    private boolean featured = false;
    private boolean active = true;

    private String mainImageUrl;
    private List<String> galleryImageUrls = new ArrayList<>();
    private List<AdminVariantRequest> variants = new ArrayList<>();
}
