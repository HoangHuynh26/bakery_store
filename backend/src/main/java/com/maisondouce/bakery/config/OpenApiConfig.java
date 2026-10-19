package com.maisondouce.bakery.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI maisonDouceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Maison Douce Bakery API")
                        .description("Production REST API documentation for Maison Douce Bakery E-Commerce Platform. " +
                                "Crafted with Love, Baked with Passion.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Maison Douce Concierge")
                                .email("bonjour@maisondouce.vn")
                                .url("https://maisondouce.vn"))
                        .license(new License().name("Proprietary").url("https://maisondouce.vn/terms")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token in the format: Bearer <token>")));
    }
}
