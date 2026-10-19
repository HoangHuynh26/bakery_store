package com.maisondouce.bakery.config;

import com.maisondouce.bakery.modules.user.entity.Role;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.RoleRepository;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email:admin@maisondouce.vn}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin@MaisonDouce2026!}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verifying bootstrap security accounts and roles...");

        // Ensure roles exist
        Role superAdminRole = roleRepository.findById("ROLE_SUPER_ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().id("ROLE_SUPER_ADMIN").name("ROLE_SUPER_ADMIN").description("Super Admin").build()));
        Role adminRole = roleRepository.findById("ROLE_ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().id("ROLE_ADMIN").name("ROLE_ADMIN").description("Admin").build()));
        Role staffRole = roleRepository.findById("ROLE_STAFF").orElseGet(() ->
                roleRepository.save(Role.builder().id("ROLE_STAFF").name("ROLE_STAFF").description("Staff").build()));
        Role customerRole = roleRepository.findById("ROLE_CUSTOMER").orElseGet(() ->
                roleRepository.save(Role.builder().id("ROLE_CUSTOMER").name("ROLE_CUSTOMER").description("Customer").build()));

        // Bootstrap Super Admin
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                admin -> {
                    admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                    admin.getRoles().add(superAdminRole);
                    admin.getRoles().add(adminRole);
                    userRepository.save(admin);
                    log.info("Super admin account synced: {}", adminEmail);
                },
                () -> {
                    User admin = User.builder()
                            .email(adminEmail)
                            .passwordHash(passwordEncoder.encode(adminPassword))
                            .fullName("Boutique Director")
                            .phoneNumber("0901234567")
                            .active(true)
                            .emailVerified(true)
                            .roles(new HashSet<>(Set.of(superAdminRole, adminRole)))
                            .build();
                    userRepository.save(admin);
                    log.info("Super admin account created: {}", adminEmail);
                }
        );

        // Bootstrap Staff
        String staffEmail = "chef@maisondouce.vn";
        userRepository.findByEmail(staffEmail).ifPresent(staff -> {
            staff.setPasswordHash(passwordEncoder.encode("Staff@MaisonDouce2026!"));
            staff.getRoles().add(staffRole);
            userRepository.save(staff);
            log.info("Staff account synced: {}", staffEmail);
        });

        // Bootstrap Demo Customer
        String customerEmail = "customer@example.com";
        userRepository.findByEmail(customerEmail).ifPresent(customer -> {
            customer.setPasswordHash(passwordEncoder.encode("Customer@2026!"));
            customer.getRoles().add(customerRole);
            userRepository.save(customer);
            log.info("Demo customer account synced: {}", customerEmail);
        });

        log.info("Bootstrap initialization complete.");
    }
}
