import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ridesAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import './Home.css';

const Home = () => {
    const { state, dispatch } = useApp();
    const history = useHistory();
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seats, setSeats] = useState('1');
    const [price, setPrice] = useState('');
    const [userType, setUserType] = useState('passenger');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!pickup || !destination || !date || !time) {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Please fill in all required fields', type: 'error' }
            });
            return;
        }
        
        if (userType === 'driver') {
            if (!price) {
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: { message: 'Please enter price per seat', type: 'error' }
                });
                return;
            }
            
            // Use local state directly for now
            const newRide = {
                from: pickup,
                to: destination,
                date: date,
                time: time,
                seats: parseInt(seats, 10),
                price: parseFloat(price),
                car: 'Personal Vehicle'
            };
            
            dispatch({ type: 'POST_RIDE', payload: newRide });
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: 'Ride posted successfully!', type: 'success' }
            });
        }
        
        history.push('/rides');
    };

    return (
        <div className="home-container">
            <div className="header-top">
                <div className="container">
                    <span>🎓 Campus Ride Sharing | 📞 +91 98765 43210 | 🔒 Verified Campus Members Only</span>
                </div>
            </div>
            
            <Navigation />

            <section className="hero-banner">
                <div className="container">
                    <div className="hero-content">
                        <h1>Campus Ride Sharing Platform</h1>
                        <p>Connect with Fellow Campus Members for Safe, Affordable Rides</p>
                        <div className="hero-stats">
                            <div className="stat">
                                <strong>500+</strong>
                                <span>Verified Users</span>
                            </div>
                            <div className="stat">
                                <strong>1000+</strong>
                                <span>Rides Completed</span>
                            </div>
                            <div className="stat">
                                <strong>4.8★</strong>
                                <span>Average Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="booking-section">
                <div className="container">
                    <div className="booking-tabs">
                        <button 
                            className={userType === 'passenger' ? 'tab active' : 'tab'}
                            onClick={() => setUserType('passenger')}
                        >
                            Find a Ride
                        </button>
                        <button 
                            className={userType === 'driver' ? 'tab active' : 'tab'}
                            onClick={() => setUserType('driver')}
                        >
                            Offer a Ride
                        </button>
                    </div>
                    
                    <div className="booking-form">
                        <h2>{userType === 'passenger' ? 'Find Your Ride' : 'Post Your Ride'}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>From (Pickup Location) *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Main Gate, Library, Hostel Block A"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>To (Drop Location) *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., City Mall, Railway Station, Airport"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time *</label>
                                <input 
                                    type="time" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{userType === 'passenger' ? 'Passengers' : 'Available Seats'}</label>
                                <select value={seats} onChange={(e) => setSeats(e.target.value)}>
                                    <option value="1">1 {userType === 'passenger' ? 'Passenger' : 'Seat'}</option>
                                    <option value="2">2 {userType === 'passenger' ? 'Passengers' : 'Seats'}</option>
                                    <option value="3">3 {userType === 'passenger' ? 'Passengers' : 'Seats'}</option>
                                    <option value="4">4 {userType === 'passenger' ? 'Passengers' : 'Seats'}</option>
                                </select>
                            </div>
                            {userType === 'driver' && (
                                <div className="form-group">
                                    <label>Price per Seat (₹)</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g., 50" 
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleSubmit}
                            className="search-btn"
                            type="button"
                        >
                            {userType === 'passenger' ? 'Search Rides' : 'Post Ride'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="services-section">
                <div className="container">
                    <h2>Platform Features</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🎓</div>
                            <h3>Student Verification</h3>
                            <p>Only verified campus members can join. Safe and trusted community.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💬</div>
                            <h3>In-App Chat</h3>
                            <p>Communicate with drivers and passengers directly through secure messaging.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">⭐</div>
                            <h3>Rating System</h3>
                            <p>Rate and review your ride experience. Build trust in the community.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🗺️</div>
                            <h3>Route Optimization</h3>
                            <p>Smart route planning and real-time tracking for efficient journeys.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💳</div>
                            <h3>Cost Splitting</h3>
                            <p>Automatic fare calculation and digital payment integration.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🔔</div>
                            <h3>Smart Notifications</h3>
                            <p>Get notified about ride confirmations, updates, and messages.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="auth" className="auth-section">
                <div className="container">
                    <h2>Join Campus Ride Sharing</h2>
                    <div className="auth-single">
                        <div className="auth-card">
                            <h3>Register Now</h3>
                            <p>Register with your college email ID for verified campus access</p>
                            <button className="auth-btn">Create Account</button>
                        </div>
                    </div>
                    <div className="login-section">
                        <p>Already have an account? <a href="#login">Login Here</a></p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>CampusRide</h3>
                            <p>Connecting campus members through safe, affordable ride sharing. Built for the campus community.</p>
                        </div>
                        <div className="footer-section">
                            <h3>Quick Links</h3>
                            <p><Link to="/">Home</Link></p>
                            <p><Link to="/rides">Find Rides</Link></p>
                            <p><Link to="/bookings">My Bookings</Link></p>
                            <p><Link to="/profile">Profile</Link></p>
                        </div>
                        <div className="footer-section">
                            <h3>Support</h3>
                            <p>📞 +91 98765 43210</p>
                            <p>📧 support@campusride.com</p>
                            <p>🔒 Privacy & Safety</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 CampusRide. All rights reserved. | Terms of Service | Privacy Policy</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;