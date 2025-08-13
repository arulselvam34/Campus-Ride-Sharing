import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getBookings } from '../../api'; // Assuming this function is defined in your api/index.js

const BookingList = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getBookings(user.id); // Fetch bookings for the logged-in user
                setBookings(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            <p>Ride ID: {booking.rideId}</p>
                            <p>Pickup: {booking.pickup}</p>
                            <p>Drop-off: {booking.dropoff}</p>
                            <p>Time: {booking.time}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingList;