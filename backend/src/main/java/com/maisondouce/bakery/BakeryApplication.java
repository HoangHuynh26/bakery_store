package com.maisondouce.bakery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.TimeZone;

@SpringBootApplication
@EnableJpaAuditing
public class BakeryApplication {

    public static void main(String[] args) {
        // Enforce system-wide UTC default for all database persistence
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(BakeryApplication.class, args);
    }
}
