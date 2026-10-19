package com.maisondouce.bakery.modules.loyalty.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyAccountDTO;
import com.maisondouce.bakery.modules.loyalty.dto.LoyaltyTierDTO;
import com.maisondouce.bakery.modules.loyalty.service.LoyaltyService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loyalty")
@RequiredArgsConstructor
@Tag(name = "Loyalty & Rewards", description = "Maison Douce Club loyalty tiers and rewards")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current customer's loyalty account, points, and tiers")
    public ResponseEntity<ApiResponse<LoyaltyAccountDTO>> getMyLoyaltyAccount(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        LoyaltyAccountDTO account = loyaltyService.getOrCreateAccountForUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(account));
    }

    @GetMapping("/tiers")
    @Operation(summary = "Get list of all loyalty membership tiers and benefits")
    public ResponseEntity<ApiResponse<List<LoyaltyTierDTO>>> getTiers() {
        List<LoyaltyTierDTO> tiers = loyaltyService.getAllTiers();
        return ResponseEntity.ok(ApiResponse.success(tiers));
    }
}
