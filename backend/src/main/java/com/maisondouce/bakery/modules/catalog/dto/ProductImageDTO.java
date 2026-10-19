package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private UUID id;
    private String imageUrl;
    private String altText;
    private int displayOrder;
    private boolean thumbnail;

    public static ProductImageDTO fromEntity(ProductImage image) {
        if (image == null) return null;
        return ProductImageDTO.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .altText(image.getAltText())
                .displayOrder(image.getDisplayOrder())
                .thumbnail(image.isThumbnail())
                .build();
    }
}
