package com.campusride.controller;

import com.campusride.model.User;
import com.campusride.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<List<User>> list() { return ResponseEntity.ok(userRepository.findAll()); }

    @PostMapping
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<User> create(@RequestBody User user) { return ResponseEntity.ok(userRepository.save(user)); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User incoming) {
        return userRepository.findById(id)
                .map(u -> { u.setUsername(incoming.getUsername()); u.setEmail(incoming.getEmail()); u.setRole(incoming.getRole()); return ResponseEntity.ok(userRepository.save(u)); })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<Void> delete(@PathVariable Long id) { userRepository.deleteById(id); return ResponseEntity.noContent().build(); }
}

