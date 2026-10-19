package com.maisondouce.bakery.modules.inventory.dto;

import com.maisondouce.bakery.modules.inventory.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientDTO {
    private UUID id;
    private String code;
    private String name;
    private String unit;
    private BigDecimal currentStock;
    private BigDecimal minimumThreshold;
    private BigDecimal costPerUnit;
    private boolean isLowStock;
    private Instant updatedAt;

    public static IngredientDTO fromEntity(Ingredient ingredient) {
        if (ingredient == null) return null;
        boolean low = ingredient.getCurrentStock().compareTo(ingredient.getMinimumThreshold()) <= 0;
        return IngredientDTO.builder()
                .id(ingredient.getId())
                .code(ingredient.getCode())
                .name(ingredient.getName())
                .unit(ingredient.getUnit())
                .currentStock(ingredient.getCurrentStock())
                .minimumThreshold(ingredient.getMinimumThreshold())
                .costPerUnit(ingredient.getCostPerUnit())
                .isLowStock(low)
                .updatedAt(ingredient.getUpdatedAt())
                .build();
    }
}
