package com.maisondouce.bakery.modules.delivery.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.delivery.dto.DeliveryTimeSlotDTO;
import com.maisondouce.bakery.modules.delivery.dto.DeliveryZoneDTO;
import com.maisondouce.bakery.modules.delivery.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")
@Tag(name = "Delivery & Zones", description = "Delivery zones, fees, and time slots")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/zones")
    @Operation(summary = "Get all active delivery zones and fees")
    public ResponseEntity<ApiResponse<List<DeliveryZoneDTO>>> getZones() {
        List<DeliveryZoneDTO> zones = deliveryService.getZones();
        return ResponseEntity.ok(ApiResponse.success(zones));
    }

    @GetMapping("/slots")
    @Operation(summary = "Get all active daily delivery time slots")
    public ResponseEntity<ApiResponse<List<DeliveryTimeSlotDTO>>> getTimeSlots() {
        List<DeliveryTimeSlotDTO> slots = deliveryService.getTimeSlots();
        return ResponseEntity.ok(ApiResponse.success(slots));
    }
}
