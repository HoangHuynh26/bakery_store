package com.maisondouce.bakery.modules.catalog.dto;

import com.maisondouce.bakery.modules.catalog.entity.Allergen;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllergenDTO {
    private UUID id;
    private String code;
    private String nameEn;
    private String nameVi;
    private String iconName;

    public static AllergenDTO fromEntity(Allergen allergen) {
        if (allergen == null) return null;
        return AllergenDTO.builder()
                .id(allergen.getId())
                .code(allergen.getCode())
                .nameEn(allergen.getNameEn())
                .nameVi(allergen.getNameVi())
                .iconName(allergen.getIconName())
                .build();
    }
}
