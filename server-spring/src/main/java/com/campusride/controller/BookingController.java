package com.campusride.controller;

import com.campusride.model.Booking;
import com.campusride.service.BookingService;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    record CreateBookingRequest(Long riderId, Long rideId, @Min(1) int seats) {}

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody CreateBookingRequest req) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(req.riderId(), req.rideId(), req.seats()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<Booking>> listAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.listAllBookings(page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Booking>> listForUser(@PathVariable Long userId,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.listUserBookings(userId, page, size));
    }
}

