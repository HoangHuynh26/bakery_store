package com.maisondouce.bakery.modules.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCategoryRequest {

    @NotBlank(message = "Tên danh mục tiếng Việt không được để trống")
    private String nameVi;

    @NotBlank(message = "Tên danh mục tiếng Anh không được để trống")
    private String nameEn;

    private String slug;
    private String descriptionVi;
    private String descriptionEn;
    private String imageUrl;
    private int displayOrder = 0;
    private boolean active = true;
}
