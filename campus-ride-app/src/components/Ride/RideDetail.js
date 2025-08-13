import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRideDetails } from '../../api';

const RideDetail = () => {
    const { rideId } = useParams();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const data = await getRideDetails(rideId);
                setRide(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRideDetails();
    }, [rideId]);

    const handleJoinRide = () => {
        // Logic to join the ride
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="ride-detail">
            <h2>Ride Details</h2>
            {ride ? (
                <div>
                    <h3>{ride.title}</h3>
                    <p>Pickup: {ride.pickup}</p>
                    <p>Drop-off: {ride.dropoff}</p>
                    <p>Time: {ride.time}</p>
                    <p>Available Seats: {ride.seats}</p>
                    <button onClick={handleJoinRide}>Join Ride</button>
                </div>
            ) : (
                <p>No ride details available.</p>
            )}
        </div>
    );
};

export default RideDetail;