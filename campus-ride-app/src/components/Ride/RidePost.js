import React, { useState } from 'react';
import { createRide } from '../../api';
import { useApp } from '../../contexts/AppContext';

const RidePost = () => {
    const { state, dispatch } = useApp();
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seats, setSeats] = useState(1);
    const [price, setPrice] = useState('');
    const [car, setCar] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pickup || !drop || !date || !time || seats < 1 || !price) {
            setError('Please fill in all required fields correctly.');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Try backend API first
            await createRide({
                startLocation: pickup,
                destination: drop,
                date: date,
                time: time,
                seatsAvailable: parseInt(seats),
                pricePerSeat: parseFloat(price),
                vehicleInfo: car || 'Personal Vehicle'
            });
            
            // Reset form after successful post
            setPickup('');
            setDrop('');
            setDate('');
            setTime('');
            setSeats(1);
            setPrice('');
            setCar('');
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Ride posted successfully!', type: 'success' }
            });
        } catch (err) {
            // Fallback to local state if backend fails
            const newRide = {
                id: Date.now(),
                driver: state.user.name,
                driverId: state.user.id,
                from: pickup,
                to: drop,
                date: date,
                time: time,
                seats: parseInt(seats),
                price: parseFloat(price),
                rating: state.user.rating || 4.5,
                car: car || 'Personal Vehicle',
                status: 'active'
            };
            
            dispatch({ type: 'POST_RIDE', payload: newRide });
            
            // Reset form
            setPickup('');
            setDrop('');
            setDate('');
            setTime('');
            setSeats(1);
            setPrice('');
            setCar('');
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Ride posted successfully (offline mode)!', type: 'success' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>Post a New Ride</h2>
            {error && <p style={{ color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Pickup Location *</label>
                    <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="e.g., Main Gate, Library, Hostel Block A"
                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Drop-off Location *</label>
                    <input
                        type="text"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="e.g., City Mall, Railway Station, Airport"
                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                        required
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Date *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Time *</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                            required
                        />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Available Seats *</label>
                        <select
                            value={seats}
                            onChange={(e) => setSeats(parseInt(e.target.value))}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                            required
                        >
                            <option value={1}>1 Seat</option>
                            <option value={2}>2 Seats</option>
                            <option value={3}>3 Seats</option>
                            <option value={4}>4 Seats</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Price per Seat (₹) *</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="50"
                            min="1"
                            style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                            required
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151' }}>Vehicle Info (Optional)</label>
                    <input
                        type="text"
                        value={car}
                        onChange={(e) => setCar(e.target.value)}
                        placeholder="e.g., Honda City, Maruti Swift"
                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '5px', fontSize: '14px' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '15px', 
                        background: loading ? '#94a3b8' : '#22c55e', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Posting Ride...' : 'Post Ride'}
                </button>
            </form>
        </div>
    );
};

export default RidePost;