package com.campusride.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.campusride.dto.RideRequest;
import com.campusride.model.Ride;
import com.campusride.model.User;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;

@Service
public class RideService {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideService(RideRepository rideRepository, UserRepository userRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    public Page<Ride> listRides(int page, int size, String start, String destination, LocalDate date) {
        PageRequest pageable = PageRequest.of(page, size);
        start = start == null ? "" : start;
        destination = destination == null ? "" : destination;
        if (date != null) {
            return rideRepository.findByStartLocationContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndDate(start, destination, date, pageable);
        }
        return rideRepository.findByStartLocationContainingIgnoreCaseAndDestinationContainingIgnoreCase(start, destination, pageable);
    }

    public Ride createRide(Long driverId, Ride ride) {
        User driver = userRepository.findById(driverId).orElseThrow();
        ride.setDriver(driver);
        if (ride.getSeatsAvailable() < 0) throw new IllegalArgumentException("Seats must be non-negative");
        return rideRepository.save(ride);
    }

    public Ride createRideForEmail(String email, RideRequest req) {
        User driver = userRepository.findByEmail(email).orElseThrow();
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setStartLocation(req.startLocation());
        ride.setDestination(req.destination());
        ride.setDate(req.date());
        ride.setTime(req.time());
        ride.setSeatsAvailable(req.seatsAvailable());
        if (ride.getSeatsAvailable() < 0) throw new IllegalArgumentException("Seats must be non-negative");
        return rideRepository.save(ride);
    }

    public Page<Ride> listDriverRides(Long driverId, int page, int size) {
        User driver = userRepository.findById(driverId).orElseThrow();
        return rideRepository.findByDriver(driver, PageRequest.of(page, size));
    }

    public java.util.Optional<Ride> findById(Long id) {
        return rideRepository.findById(id);
    }
}

