package com.campusride.config;

import com.campusride.model.User;
import com.campusride.model.UserRole;
import com.campusride.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedAdmin(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            users.findByEmail("admin@gmail.com").orElseGet(() -> {
                User admin = new User();
                admin.setUsername("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(encoder.encode("admin@123"));
                admin.setRole(UserRole.Admin);
                return users.save(admin);
            });
        };
    }
}

