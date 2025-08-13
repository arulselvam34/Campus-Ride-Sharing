package com.campusride.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RideRequest(
    @NotBlank String startLocation,
    @NotBlank String destination,
    @NotNull LocalDate date,
    @NotBlank String time,
    @Min(0) int seatsAvailable
) {}


