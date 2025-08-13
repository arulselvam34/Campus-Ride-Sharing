import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { logoutUser } from '../api';

const Navigation = () => {
    const { state, dispatch } = useApp();
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;
    
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try { await logoutUser(); } catch (e) { /* ignore */ }
            dispatch({ type: 'LOGOUT' });
        }
    };
    
    return (
        <header style={{ background: '#1e293b', color: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', textDecoration: 'none' }}>
                    CampusRide
                </Link>
                <nav style={{ display: 'flex', gap: '30px' }}>
                    <Link 
                        to="/" 
                        style={{ 
                            color: isActive('/') ? '#22c55e' : 'white', 
                            textDecoration: 'none',
                            fontWeight: isActive('/') ? '600' : '500'
                        }}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/rides" 
                        style={{ 
                            color: isActive('/rides') ? '#22c55e' : 'white', 
                            textDecoration: 'none',
                            fontWeight: isActive('/rides') ? '600' : '500'
                        }}
                    >
                        Find Rides
                    </Link>
                    <Link 
                        to="/bookings" 
                        style={{ 
                            color: isActive('/bookings') ? '#22c55e' : 'white', 
                            textDecoration: 'none',
                            fontWeight: isActive('/bookings') ? '600' : '500',
                            position: 'relative'
                        }}
                    >
                        My Bookings
                        {state.bookings.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {state.bookings.length}
                            </span>
                        )}
                    </Link>
                    <Link 
                        to="/chat" 
                        style={{ 
                            color: isActive('/chat') ? '#22c55e' : 'white', 
                            textDecoration: 'none',
                            fontWeight: isActive('/chat') ? '600' : '500',
                            position: 'relative'
                        }}
                    >
                        Messages
                        {state.chats.reduce((total, chat) => total + chat.unread, 0) > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {state.chats.reduce((total, chat) => total + chat.unread, 0)}
                            </span>
                        )}
                    </Link>
                    <Link 
                        to="/profile" 
                        style={{ 
                            color: isActive('/profile') ? '#22c55e' : 'white', 
                            textDecoration: 'none',
                            fontWeight: isActive('/profile') ? '600' : '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            background: '#22c55e',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                        }}>
                            👤
                        </div>
                        {state.user.name.split(' ')[0]}
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navigation;