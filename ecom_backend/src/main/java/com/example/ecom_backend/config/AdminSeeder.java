package com.example.ecom_backend.config;

import com.example.ecom_backend.repositories.UserRepo;
import com.example.ecom_backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSeeder {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    @Bean
    CommandLineRunner seedInitialAdmin(
            UserRepo userRepo,
            UserService userService,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password,
            @Value("${app.admin.email}") String email) {
        return args -> {
            if (userRepo.findByUsername(username).isPresent()) {
                log.info("Admin '{}' already exists; skipping seed.", username);
                return;
            }
            userService.createAdmin(username, password, "Initial Admin", email, "N/A");
            log.info("Seeded initial admin user '{}'.", username);
        };
    }
}
