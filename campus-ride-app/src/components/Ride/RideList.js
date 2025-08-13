import React, { useEffect, useState } from 'react';
import { fetchRides } from '../../api'; // Assuming fetchRides is a function in api/index.js

const RideList = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRides = async () => {
            try {
                const data = await fetchRides();
                setRides(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getRides();
    }, []);

    if (loading) return <div>Loading rides...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Available Rides</h2>
            <ul>
                {rides.map(ride => (
                    <li key={ride.id}>
                        <h3>{ride.pickup} to {ride.drop}</h3>
                        <p>Time: {ride.time}</p>
                        <p>Seats Available: {ride.seats}</p>
                        <button>Join Ride</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RideList;