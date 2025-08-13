import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Navigation from '../components/Navigation';
import { getRides, bookRide } from '../api';

const Rides = () => {
    const { state, dispatch } = useApp();
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [serverRides, setServerRides] = useState({ content: [], totalPages: 0, number: 0 });
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        from: '',
        to: '',
        date: '',
        seats: '1'
    });
    const [selectedSeats, setSelectedSeats] = useState({});

    // Fetch rides from backend
    useEffect(() => {
        const fetchRides = async () => {
            try {
                setLoading(true);
                const params = { page, size };
                if (searchFilters.from) params.start = searchFilters.from;
                if (searchFilters.to) params.destination = searchFilters.to;
                if (searchFilters.date) params.date = searchFilters.date;
                
                const data = await getRides(params);
                setServerRides(data);
            } catch (error) {
                console.error('Error fetching rides:', error);
                // Fallback to local rides if API fails
                const localRides = state.rides.filter(ride => {
                    if (searchFilters.from && !ride.from.toLowerCase().includes(searchFilters.from.toLowerCase())) return false;
                    if (searchFilters.to && !ride.to.toLowerCase().includes(searchFilters.to.toLowerCase())) return false;
                    if (searchFilters.date && ride.date !== searchFilters.date) return false;
                    return true;
                });
                setServerRides({ content: localRides, totalPages: 1, number: 0 });
            } finally {
                setLoading(false);
            }
        };
        
        fetchRides();
    }, [page, size, searchFilters, state.rides]);

    const handleBookRide = async (ride) => {
        if (!state.user?.id) {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Please login to book a ride', type: 'error' }
            });
            return;
        }

        const seatsToBook = selectedSeats[ride.id] || 1;
        try {
            setLoading(true);
            await bookRide({ 
                rideId: ride.id, 
                riderId: state.user.id, 
                seats: seatsToBook 
            });
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: `Ride booked successfully! ${seatsToBook} seat(s) reserved.`, type: 'success' }
            });
            
            // Refresh the rides list to update seat availability
            const params = { page, size };
            if (searchFilters.from) params.start = searchFilters.from;
            if (searchFilters.to) params.destination = searchFilters.to;
            if (searchFilters.date) params.date = searchFilters.date;
            
            const data = await getRides(params);
            setServerRides(data);
            
            // Navigate to bookings page
            history.push('/bookings');
        } catch (error) {
            console.error('Booking error:', error);
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { 
                    message: error?.response?.data?.message || 'Booking failed. Please try again.', 
                    type: 'error' 
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        // The useEffect will handle the search with new filters
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
            <Navigation />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Search Rides</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="From" 
                            value={searchFilters.from}
                            onChange={(e) => setSearchFilters({...searchFilters, from: e.target.value})}
                            style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px' }} 
                        />
                        <input 
                            type="text" 
                            placeholder="To" 
                            value={searchFilters.to}
                            onChange={(e) => setSearchFilters({...searchFilters, to: e.target.value})}
                            style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px' }} 
                        />
                        <input 
                            type="date" 
                            value={searchFilters.date}
                            onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                            style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px' }} 
                        />
                        <select 
                            value={searchFilters.seats}
                            onChange={(e) => setSearchFilters({...searchFilters, seats: e.target.value})}
                            style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                        >
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                            <option value="3">3 Seats</option>
                            <option value="4">4 Seats</option>
                        </select>
                        <button onClick={handleSearch} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
                    </div>
                </div>

                <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>Available Rides</h1>
                
                {loading && (
                    <div style={{ background: 'white', padding: 20, borderRadius: 8, textAlign: 'center', color: '#64748b' }}>
                        Loading rides...
                    </div>
                )}
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    {(!loading && (serverRides.content || []).length === 0) && (
                        <div style={{ background: 'white', padding: 20, borderRadius: 8, textAlign: 'center', color: '#64748b' }}>
                            No rides found
                        </div>
                    )}
                    {(loading ? [] : serverRides.content || []).map(ride => (
                        <div key={ride.id} style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderTop: '4px solid #22c55e' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'white', fontSize: '24px' }}>👤</div>
                                    <h4 style={{ margin: '0', color: '#1e293b' }}>{ride.driver?.username || ride.driver || 'Driver'}</h4>
                                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}></p>
                                </div>
                                
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', marginRight: '10px' }}></div>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{ride.startLocation || ride.from}</span>
                                    </div>
                                    <div style={{ borderLeft: '2px dashed #e2e8f0', marginLeft: '4px', paddingLeft: '14px', marginBottom: '10px' }}>
                                        <span style={{ color: '#64748b', fontSize: '14px' }}>{ride.date} at {ride.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{ride.destination || ride.to}</span>
                                    </div>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>Available Seats</p>
                                    <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{ride.seatsAvailable ?? ride.seats}</p>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>Seats to book</p>
                                    <select 
                                        value={selectedSeats[ride.id] || 1}
                                        onChange={(e) => setSelectedSeats({...selectedSeats, [ride.id]: parseInt(e.target.value)})}
                                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                                    >
                                         {[...Array(Math.min((ride.seatsAvailable ?? ride.seats) || 0, 4))].map((_, i) => (
                                            <option key={i+1} value={i+1}>{i+1} Seat{i > 0 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => handleBookRide(ride)}
                                         disabled={((ride.seatsAvailable ?? ride.seats) || 0) === 0 || loading}
                                        style={{ 
                                             background: ((ride.seatsAvailable ?? ride.seats) || 0) === 0 || loading ? '#94a3b8' : '#ef4444', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '12px 20px', 
                                            borderRadius: '5px', 
                                             cursor: ((ride.seatsAvailable ?? ride.seats) || 0) === 0 || loading ? 'not-allowed' : 'pointer', 
                                            fontWeight: '600',
                                            width: '100%'
                                        }}
                                    >
                                         {loading ? 'Booking...' : ((ride.seatsAvailable ?? ride.seats) || 0) === 0 ? 'Full' : 'Book Ride'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</button>
                    <span>Page {serverRides.number + 1} of {serverRides.totalPages}</span>
                    <button disabled={serverRides.number + 1 >= serverRides.totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Rides;