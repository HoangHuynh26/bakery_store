package com.maisondouce.bakery.modules.user.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.auth.dto.UserProfileDTO;
import com.maisondouce.bakery.modules.user.dto.AddressDTO;
import com.maisondouce.bakery.modules.user.dto.AddressRequest;
import com.maisondouce.bakery.modules.user.dto.ChangePasswordRequest;
import com.maisondouce.bakery.modules.user.dto.UpdateProfileRequest;
import com.maisondouce.bakery.modules.user.service.UserService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Customer Account", description = "Customer profile, saved addresses, password management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDTO profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO updated = userService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/password")
    @Operation(summary = "Change account password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get customer's saved delivery addresses")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        List<AddressDTO> addresses = userService.getAddresses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add a new saved delivery address")
    public ResponseEntity<ApiResponse<AddressDTO>> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddressRequest request) {
        AddressDTO created = userService.addAddress(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Address added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/addresses/{id}")
    @Operation(summary = "Update an existing delivery address")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request) {
        AddressDTO updated = userService.updateAddress(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete a saved delivery address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        userService.deleteAddress(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }

    @PutMapping("/addresses/{id}/default")
    @Operation(summary = "Set address as default delivery destination")
    public ResponseEntity<ApiResponse<AddressDTO>> setDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        AddressDTO updated = userService.setDefaultAddress(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", updated));
    }
}
