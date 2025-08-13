package com.campusride.service;

import com.campusride.model.*;
import com.campusride.repository.BookingRepository;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, RideRepository rideRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Long riderId, Long rideId, int seats) {
        Ride ride = rideRepository.findById(rideId).orElseThrow();
        if (ride.getSeatsAvailable() < seats) {
            throw new IllegalArgumentException("No seats available");
        }
        User rider = userRepository.findById(riderId).orElseThrow();
        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setRider(rider);
        booking.setSeats(seats);
        booking.setStatus(BookingStatus.Confirmed);
        ride.setSeatsAvailable(ride.getSeatsAvailable() - seats);
        rideRepository.save(ride);
        return bookingRepository.save(booking);
    }

    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (booking.getStatus() != BookingStatus.Canceled) {
            Ride ride = booking.getRide();
            ride.setSeatsAvailable(ride.getSeatsAvailable() + booking.getSeats());
            booking.setStatus(BookingStatus.Canceled);
            rideRepository.save(ride);
            bookingRepository.save(booking);
        }
    }

    public Page<Booking> listUserBookings(Long riderId, int page, int size) {
        User rider = userRepository.findById(riderId).orElseThrow();
        return bookingRepository.findByRider(rider, PageRequest.of(page, size));
    }

    public Page<Booking> listAllBookings(int page, int size) {
        return bookingRepository.findAll(PageRequest.of(page, size));
    }
}

