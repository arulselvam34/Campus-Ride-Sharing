package com.campusride.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campusride.model.Ride;
import com.campusride.model.User;

public interface RideRepository extends JpaRepository<Ride, Long> {
    Page<Ride> findByDriver(User driver, Pageable pageable);
    Page<Ride> findByStartLocationContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndDate(
            String start, String destination, LocalDate date, Pageable pageable);
    Page<Ride> findByStartLocationContainingIgnoreCaseAndDestinationContainingIgnoreCase(
            String start, String destination, Pageable pageable);
}

