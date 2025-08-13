package com.campusride.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_ride", columnList = "ride_id"),
        @Index(name = "idx_booking_rider", columnList = "rider_id")
})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ride_id")
    private Ride ride;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rider_id")
    private User rider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.Confirmed;

    private int seats = 1;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }
    public User getRider() { return rider; }
    public void setRider(User rider) { this.rider = rider; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }
}

