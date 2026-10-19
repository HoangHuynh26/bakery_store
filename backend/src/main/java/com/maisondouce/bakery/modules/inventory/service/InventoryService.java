package com.maisondouce.bakery.modules.inventory.service;

import com.maisondouce.bakery.modules.inventory.dto.IngredientDTO;
import com.maisondouce.bakery.modules.inventory.dto.StockAdjustmentRequest;
import com.maisondouce.bakery.modules.inventory.entity.StockMovement;

import java.util.List;

public interface InventoryService {
    List<IngredientDTO> getAllIngredients();
    IngredientDTO adjustStock(StockAdjustmentRequest request);
    List<StockMovement> getRecentMovements();
}
