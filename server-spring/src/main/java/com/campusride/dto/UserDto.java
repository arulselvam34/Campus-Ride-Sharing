package com.campusride.dto;

import com.campusride.model.User;

public record UserDto(Long id, String username, String email, String role) {
    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name());
    }
}


