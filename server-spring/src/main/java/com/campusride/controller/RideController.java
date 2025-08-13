package com.campusride.controller;

import com.campusride.dto.RideRequest;
import com.campusride.model.Ride;
import com.campusride.service.RideService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin
public class RideController {
    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping
    public ResponseEntity<Page<Ride>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(rideService.listRides(page, size, start, destination, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ride> getOne(@PathVariable Long id) {
        return rideService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ride> create(Principal principal, @Valid @RequestBody RideRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(rideService.createRideForEmail(principal.getName(), req));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<Page<Ride>> listDriverRides(
            @PathVariable Long driverId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(rideService.listDriverRides(driverId, page, size));
    }
}

