package com.maisondouce.bakery.modules.system.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@Tag(name = "System", description = "System health, version, and operational telemetry")
public class SystemController {

    @Value("${spring.application.name:maison-douce-bakery-api}")
    private String appName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping("/status")
    @Operation(summary = "Get system operational status and timezone")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        ZoneId zoneHcm = ZoneId.of("Asia/Ho_Chi_Minh");
        ZonedDateTime hcmTime = ZonedDateTime.now(zoneHcm);

        Map<String, Object> statusData = Map.of(
                "application", appName,
                "status", "OPERATIONAL",
                "version", "1.0.0",
                "environment", activeProfile,
                "defaultCurrency", "VND",
                "timezoneUtc", Instant.now().toString(),
                "timezoneLocal", hcmTime.toString(),
                "motto", "Crafted with Love, Baked with Passion."
        );

        return ResponseEntity.ok(ApiResponse.success("System operational", statusData));
    }
}
