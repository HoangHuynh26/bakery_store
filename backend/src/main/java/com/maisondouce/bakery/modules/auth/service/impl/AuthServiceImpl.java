package com.maisondouce.bakery.modules.auth.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ConflictException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.common.exception.UnauthorizedException;
import com.maisondouce.bakery.modules.auth.dto.*;
import com.maisondouce.bakery.modules.auth.entity.RefreshToken;
import com.maisondouce.bakery.modules.auth.repository.RefreshTokenRepository;
import com.maisondouce.bakery.modules.auth.service.AuthService;
import com.maisondouce.bakery.modules.user.entity.Role;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.RoleRepository;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import com.maisondouce.bakery.security.JwtTokenProvider;
import com.maisondouce.bakery.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("An account with email " + request.getEmail() + " already exists.");
        }

        Role customerRole = roleRepository.findById("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .id("ROLE_CUSTOMER")
                        .name("ROLE_CUSTOMER")
                        .description("Customer")
                        .build()));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null)
                .active(true)
                .emailVerified(false)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        UserPrincipal principal = UserPrincipal.create(savedUser);

        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(savedUser.getId());

        saveRefreshToken(savedUser, refreshTokenStr);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(mapToProfileDTO(savedUser))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account has been deactivated. Please contact customer support.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId());

        saveRefreshToken(user, refreshTokenStr);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(mapToProfileDTO(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String tokenStr = request.getRefreshToken();
        if (!jwtTokenProvider.validateToken(tokenStr)) {
            throw new UnauthorizedException("Refresh token is invalid or expired.");
        }

        String hashedToken = hashToken(tokenStr);
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hashedToken)
                .orElseThrow(() -> new UnauthorizedException("Refresh token was not recognized."));

        if (refreshToken.isRevoked()) {
            // Suspicious reuse of revoked token! Security alert: revoke all active tokens for this user
            refreshTokenRepository.revokeAllByUserId(refreshToken.getUser().getId());
            throw new UnauthorizedException("Refresh token has been revoked due to security violation.");
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        User user = refreshToken.getUser();
        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive.");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(principal);
        String newRefreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId());

        // Rotate token
        refreshToken.setRevoked(true);
        refreshToken.setReplacedByToken(hashToken(newRefreshTokenStr));
        refreshTokenRepository.save(refreshToken);

        saveRefreshToken(user, newRefreshTokenStr);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(mapToProfileDTO(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshTokenStr) {
        if (refreshTokenStr != null && !refreshTokenStr.isBlank()) {
            refreshTokenRepository.findByTokenHash(hashToken(refreshTokenStr)).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated.");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        return mapToProfileDTO(user);
    }

    private void saveRefreshToken(User user, String tokenStr) {
        Instant expiresAt = Instant.now().plusMillis(jwtTokenProvider.getJwtRefreshExpirationMs());
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(tokenStr))
                .expiresAt(expiresAt)
                .revoked(false)
                .createdAt(Instant.now())
                .build();
        refreshTokenRepository.save(token);
    }

    private String hashToken(String token) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private UserProfileDTO mapToProfileDTO(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
