package com.campusride.controller;

import com.campusride.dto.UserDto;
import com.campusride.model.UserRole;
import com.campusride.repository.UserRepository;
import com.campusride.service.AuthService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    record RegisterRequest(@NotBlank String username, @Email String email, @NotBlank String password, String role) {}
    record LoginRequest(@Email String email, @NotBlank String password) {}

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest req) {
        UserRole role = req.role() == null ? UserRole.Rider : UserRole.valueOf(req.role());
        return ResponseEntity.ok(authService.register(req.username(), req.email(), req.password(), role));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req.email(), req.password()));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Principal principal) {
        if (principal == null) return ResponseEntity.ok(null);
        return userRepository.findByEmail(principal.getName())
                .map(u -> ResponseEntity.ok(Map.<String, Object>of("user", UserDto.from(u))))
                .orElseGet(() -> ResponseEntity.ok(null));
    }
}

