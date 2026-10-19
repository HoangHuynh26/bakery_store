package com.maisondouce.bakery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maisondouce.bakery.modules.auth.dto.LoginRequest;
import com.maisondouce.bakery.modules.auth.dto.RegisterRequest;
import com.maisondouce.bakery.modules.auth.dto.TokenRefreshRequest;
import com.maisondouce.bakery.modules.auth.repository.RefreshTokenRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Test
    @DisplayName("Should successfully register a new customer")
    void testRegisterSuccess() throws Exception {
        String uniqueEmail = "patisserie_lover_" + System.currentTimeMillis() + "@maisondouce.vn";
        RegisterRequest req = RegisterRequest.builder()
                .email(uniqueEmail)
                .password("Secret@1234")
                .fullName("Camille Laurent")
                .phoneNumber("+84901234567")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(uniqueEmail))
                .andExpect(jsonPath("$.data.user.roles", hasItem("ROLE_CUSTOMER")));
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest req = RegisterRequest.builder()
                .email("admin@maisondouce.vn") // Bootstrap admin email
                .password("NewSecret@1234")
                .fullName("Duplicate Admin")
                .phoneNumber("+84901234568")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("CONFLICT"));
    }

    @Test
    @DisplayName("Should reject registration with invalid email or short password")
    void testRegisterValidationFailure() throws Exception {
        RegisterRequest req = RegisterRequest.builder()
                .email("not-an-email")
                .password("123")
                .fullName("")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("Should login successfully with valid admin credentials")
    void testLoginSuccess() throws Exception {
        LoginRequest req = LoginRequest.builder()
                .email("admin@maisondouce.vn")
                .password("Admin@MaisonDouce2026!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("admin@maisondouce.vn"))
                .andExpect(jsonPath("$.data.user.roles", hasItem("ROLE_SUPER_ADMIN")));
    }

    @Test
    @DisplayName("Should reject login with wrong password")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest req = LoginRequest.builder()
                .email("admin@maisondouce.vn")
                .password("WrongPassword123")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("INVALID_CREDENTIALS"));
    }

    @Test
    @DisplayName("Should rotate refresh token properly")
    void testRefreshTokenRotation() throws Exception {
        // First, login to get tokens
        LoginRequest req = LoginRequest.builder()
                .email("admin@maisondouce.vn")
                .password("Admin@MaisonDouce2026!")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String refreshToken = objectMapper.readTree(responseBody).get("data").get("refreshToken").asText();

        // Refresh token
        TokenRefreshRequest refreshReq = TokenRefreshRequest.builder()
                .refreshToken(refreshToken)
                .build();

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty());

        // Attempting to reuse old refresh token should now be rejected as revoked
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should fetch current user profile with valid JWT")
    void testGetCurrentUser() throws Exception {
        LoginRequest req = LoginRequest.builder()
                .email("admin@maisondouce.vn")
                .password("Admin@MaisonDouce2026!")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String accessToken = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("admin@maisondouce.vn"));
    }
}
