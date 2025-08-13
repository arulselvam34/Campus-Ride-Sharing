package com.campusride.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campusride.model.User;
import com.campusride.model.UserRole;
import com.campusride.repository.UserRepository;
import com.campusride.security.JwtService;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Map<String, Object> register(String username, String email, String rawPassword, UserRole role) {
        userRepository.findByEmail(email).ifPresent(u -> { throw new IllegalArgumentException("Email already registered"); });
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name(), "id", user.getId()));
        return Map.of("token", token, "user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }

    public Map<String, Object> login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name(), "id", user.getId()));
        return Map.of("token", token, "user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }
}

