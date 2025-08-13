import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Navigation from '../components/Navigation';
import RatingModal from '../components/RatingModal';
import { getUserBookings, cancelBooking } from '../api';

const Bookings = () => {
    const { state, dispatch } = useApp();
    const [serverBookings, setServerBookings] = useState({ content: [], totalPages: 0, number: 0 });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const load = async () => {
            if (!state.user?.id) return;
            try {
                const data = await getUserBookings({ page, size });
                setServerBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                // Fallback to empty state if API fails
                setServerBookings({ content: [], totalPages: 0, number: 0 });
            }
        };
        load();
    }, [state.user?.id, page, size]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [ratingModal, setRatingModal] = useState({ isOpen: false, booking: null });
    
    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(bookingId);
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: { message: 'Booking cancelled successfully!', type: 'success' }
                });
                // Refresh the bookings list
                const data = await getUserBookings({ page, size });
                setServerBookings(data);
            } catch (error) {
                console.error('Error cancelling booking:', error);
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: { 
                        message: error?.response?.data?.message || 'Failed to cancel booking', 
                        type: 'error' 
                    }
                });
            }
        }
    };
    
    const handleContactDriver = (driverName) => {
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: { message: `Opening chat with ${driverName}...`, type: 'info' }
        });
    };
    
    const handleRateRide = (booking) => {
        setRatingModal({ isOpen: true, booking });
    };
    
    const submitRating = (ratingData) => {
        dispatch({
            type: 'RATE_RIDE',
            payload: {
                bookingId: ratingModal.booking.id,
                rating: ratingData.rating,
                comment: ratingData.comment
            }
        });
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: { message: 'Thank you for your feedback!', type: 'success' }
        });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
            <Navigation />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>My Bookings</h1>
                
                <div style={{ display: 'flex', marginBottom: '30px', background: 'white', borderRadius: '10px', padding: '5px' }}>
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        style={{ 
                            flex: 1, 
                            padding: '15px', 
                            border: 'none', 
                            borderRadius: '8px',
                            background: activeTab === 'upcoming' ? '#22c55e' : 'transparent',
                            color: activeTab === 'upcoming' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Upcoming Rides
                    </button>
                    <button 
                        onClick={() => setActiveTab('past')}
                        style={{ 
                            flex: 1, 
                            padding: '15px', 
                            border: 'none', 
                            borderRadius: '8px',
                            background: activeTab === 'past' ? '#22c55e' : 'transparent',
                            color: activeTab === 'past' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Past Rides
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {(activeTab === 'upcoming' ? (serverBookings.content || []) : state.pastBookings).map(booking => (
                        <div key={booking.id} style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderTop: `4px solid ${booking.status === 'confirmed' ? '#22c55e' : booking.status === 'pending' ? '#f59e0b' : '#64748b'}` }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'white', fontSize: '24px' }}>👤</div>
                                    <h4 style={{ margin: '0', color: '#1e293b' }}>{booking.driver}</h4>
                                    <span style={{ 
                                        display: 'inline-block',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        marginTop: '5px',
                                        background: booking.status === 'confirmed' ? '#dcfce7' : booking.status === 'pending' ? '#fef3c7' : '#f1f5f9',
                                        color: booking.status === 'confirmed' ? '#166534' : booking.status === 'pending' ? '#92400e' : '#475569'
                                    }}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', marginRight: '10px' }}></div>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{booking.ride?.startLocation || booking.from}</span>
                                    </div>
                                    <div style={{ borderLeft: '2px dashed #e2e8f0', marginLeft: '4px', paddingLeft: '14px', marginBottom: '10px' }}>
                                        <span style={{ color: '#64748b', fontSize: '14px' }}>{booking.date} at {booking.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{booking.ride?.destination || booking.to}</span>
                                    </div>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>Seats Booked</p>
                                    <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{booking.seats}</p>
                                    <p style={{ margin: '0', color: '#22c55e', fontWeight: '600' }}>₹{booking.price * booking.seats}</p>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    {activeTab === 'upcoming' ? (
                                        <div>
                                            <button 
                                                onClick={() => handleCancelBooking(booking.id)}
                                                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginBottom: '8px', width: '100%' }}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleContactDriver(booking.driver)}
                                                style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                                            >
                                                Contact
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: '14px' }}>Your Rating</p>
                                            <div style={{ color: '#f59e0b', fontSize: '18px', marginBottom: '10px' }}>{'★'.repeat(booking.rating)}{'☆'.repeat(5-booking.rating)}</div>
                                            <button 
                                                onClick={() => handleRateRide(booking)}
                                                style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginBottom: '8px', width: '100%' }}
                                            >
                                                {booking.rating ? 'Update Rating' : 'Rate Ride'}
                                            </button>
                                            <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Book Again</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <RatingModal
                    isOpen={ratingModal.isOpen}
                    onClose={() => setRatingModal({ isOpen: false, booking: null })}
                    onSubmit={submitRating}
                    driverName={ratingModal.booking?.driver}
                />
            </div>
        </div>
    );
};

export default Bookings;