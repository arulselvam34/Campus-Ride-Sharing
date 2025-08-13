package com.campusride.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campusride.model.Booking;
import com.campusride.model.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByRider(User rider, Pageable pageable);
}

