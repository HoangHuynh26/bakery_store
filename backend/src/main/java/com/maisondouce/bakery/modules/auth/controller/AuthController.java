package com.maisondouce.bakery.modules.auth.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.auth.dto.*;
import com.maisondouce.bakery.modules.auth.service.AuthService;
import com.maisondouce.bakery.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Customer & staff authentication, registration, token rotation")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("Account successfully registered. Welcome to Maison Douce Bakery!", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate and refresh JWT access token using valid refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out user and revoke refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) TokenRefreshRequest request) {
        if (request != null && request.getRefreshToken() != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.success("Successfully logged out", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDTO profile = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
