package com.campusride.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "rides", indexes = {
        @Index(name = "idx_ride_driver", columnList = "driver_id"),
        @Index(name = "idx_ride_start", columnList = "startLocation"),
        @Index(name = "idx_ride_dest", columnList = "destination"),
        @Index(name = "idx_ride_date", columnList = "date")
})
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "driver_id")
    private User driver;

    @NotBlank
    private String startLocation;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String time;

    @Min(0)
    private int seatsAvailable;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public int getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }
}

