package com.maisondouce.bakery;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BakeryApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Spring Application Context Loads Successfully")
    void contextLoads() {
        assertThat(passwordEncoder).isNotNull();
    }

    @Test
    @DisplayName("PasswordEncoder verifies BCrypt hashing correctly")
    void testPasswordEncoder() {
        String rawPassword = "Admin@MaisonDouce2026!";
        String encoded = passwordEncoder.encode(rawPassword);
        assertThat(passwordEncoder.matches(rawPassword, encoded)).isTrue();
    }

    @Test
    @DisplayName("GET /api/v1/system/status returns 200 OK and valid status payload")
    void testSystemStatusEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/system/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("OPERATIONAL"))
                .andExpect(jsonPath("$.data.defaultCurrency").value("VND"))
                .andExpect(jsonPath("$.data.motto").value("Crafted with Love, Baked with Passion."));
    }

    @Test
    @DisplayName("GET /actuator/health returns 200 and UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
