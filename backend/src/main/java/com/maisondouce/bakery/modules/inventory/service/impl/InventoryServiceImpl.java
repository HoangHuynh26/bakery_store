package com.maisondouce.bakery.modules.inventory.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.inventory.dto.IngredientDTO;
import com.maisondouce.bakery.modules.inventory.dto.StockAdjustmentRequest;
import com.maisondouce.bakery.modules.inventory.entity.Ingredient;
import com.maisondouce.bakery.modules.inventory.entity.StockMovement;
import com.maisondouce.bakery.modules.inventory.repository.IngredientRepository;
import com.maisondouce.bakery.modules.inventory.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements com.maisondouce.bakery.modules.inventory.service.InventoryService {

    private final IngredientRepository ingredientRepository;
    private final StockMovementRepository stockMovementRepository;

    @Override
    @Transactional(readOnly = true)
    public List<IngredientDTO> getAllIngredients() {
        return ingredientRepository.findAllByOrderByNameAsc()
                .stream()
                .map(IngredientDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IngredientDTO adjustStock(StockAdjustmentRequest req) {
        Ingredient ingredient = ingredientRepository.findById(req.getIngredientId())
                .orElseThrow(() -> new ResourceNotFoundException("Nguyên liệu", "id", req.getIngredientId()));

        BigDecimal qty = req.getQuantity();
        BigDecimal current = ingredient.getCurrentStock();
        BigDecimal newStock = current;

        switch (req.getMovementType().toUpperCase()) {
            case "INBOUND":
                newStock = current.add(qty);
                break;
            case "PRODUCTION_DEDUCTION":
            case "SPOILAGE":
                if (current.compareTo(qty) < 0) {
                    throw new BadRequestException("Số lượng tồn kho hiện tại (" + current + " " + ingredient.getUnit() + ") không đủ để trừ " + qty);
                }
                newStock = current.subtract(qty);
                break;
            case "MANUAL_ADJUSTMENT":
                if (qty.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BadRequestException("Số lượng tồn kho không được âm");
                }
                newStock = qty;
                break;
            default:
                throw new BadRequestException("Loại biến động không hợp lệ: " + req.getMovementType());
        }

        ingredient.setCurrentStock(newStock);
        Ingredient saved = ingredientRepository.save(ingredient);

        StockMovement movement = StockMovement.builder()
                .ingredient(saved)
                .movementType(req.getMovementType().toUpperCase())
                .quantity(qty)
                .reason(req.getReason() != null ? req.getReason() : "Điều chỉnh kho tiệm bánh")
                .build();
        stockMovementRepository.save(movement);

        log.info("Stock adjusted for {}: {} -> {} {}", ingredient.getName(), current, newStock, ingredient.getUnit());
        return IngredientDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovement> getRecentMovements() {
        return stockMovementRepository.findTop30ByOrderByCreatedAtDesc();
    }
}
