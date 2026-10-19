package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private UUID id;
    private String slug;
    private String nameEn;
    private String nameVi;
    private String descriptionEn;
    private String descriptionVi;
    private String imageUrl;
    private int displayOrder;
    private boolean active;

    public static CategoryDTO fromEntity(Category category) {
        if (category == null) return null;
        return CategoryDTO.builder()
                .id(category.getId())
                .slug(category.getSlug())
                .nameEn(category.getNameEn())
                .nameVi(category.getNameVi())
                .descriptionEn(category.getDescriptionEn())
                .descriptionVi(category.getDescriptionVi())
                .imageUrl(category.getImageUrl())
                .displayOrder(category.getDisplayOrder())
                .active(category.isActive())
                .build();
    }
}
