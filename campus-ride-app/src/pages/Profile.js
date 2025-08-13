import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Navigation from '../components/Navigation';

const Profile = () => {
    const { state, dispatch } = useApp();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(state.user);

    const stats = {
        totalRides: state.bookings.length + state.pastBookings.length,
        rating: state.user.rating,
        savings: state.pastBookings.reduce((total, booking) => total + (booking.price * booking.seats), 0)
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: { message: 'Profile updated successfully!', type: 'success' }
        });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
            <Navigation />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                    <div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '120px', height: '120px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontSize: '48px' }}>👤</div>
                            <h2 style={{ margin: '0 0 10px', color: '#1e293b' }}>{profileData.name}</h2>
                            <p style={{ margin: '0', color: '#64748b' }}>{profileData.department}</p>
                            <p style={{ margin: '5px 0 0', color: '#64748b' }}>{profileData.year}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <span style={{ color: '#f59e0b', marginRight: '5px' }}>★</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>{stats.rating}</span>
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px', color: '#1e293b' }}>Your Impact</h3>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{stats.totalRides}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Total Rides</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>₹{stats.savings}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Money Saved</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', marginBottom: '20px', background: 'white', borderRadius: '10px', padding: '5px' }}>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                style={{ 
                                    flex: 1, 
                                    padding: '15px', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    background: activeTab === 'profile' ? '#22c55e' : 'transparent',
                                    color: activeTab === 'profile' ? 'white' : '#64748b',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Profile Info
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                style={{ 
                                    flex: 1, 
                                    padding: '15px', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    background: activeTab === 'settings' ? '#22c55e' : 'transparent',
                                    color: activeTab === 'settings' ? 'white' : '#64748b',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Settings
                            </button>
                        </div>

                        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                            {activeTab === 'profile' ? (
                                <div>
                                    <h2 style={{ margin: '0 0 25px', color: '#1e293b' }}>Profile Information</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>Full Name</label>
                                                <input type="text" name="name" value={profileData.name} onChange={handleChange}
                                                       style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '2px solid #e2e8f0' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>Student ID</label>
                                                <input type="text" name="studentId" value={profileData.studentId} onChange={handleChange}
                                                       style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '2px solid #e2e8f0' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>Email</label>
                                            <input type="email" name="email" value={profileData.email} onChange={handleChange}
                                                   style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '2px solid #e2e8f0' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>Phone</label>
                                                <input type="tel" name="phone" value={profileData.phone} onChange={handleChange}
                                                       style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '2px solid #e2e8f0' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>Department</label>
                                                <input type="text" name="department" value={profileData.department} onChange={handleChange}
                                                       style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '2px solid #e2e8f0' }} />
                                            </div>
                                        </div>
                                        <button type="submit" style={{ width: '100%', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Update Profile</button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h2 style={{ margin: '0 0 25px', color: '#1e293b' }}>Settings</h2>
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        <div style={{ padding: '20px', border: '2px solid #e2e8f0', borderRadius: '8px' }}>
                                            <h4 style={{ margin: '0 0 10px', color: '#1e293b' }}>Notifications</h4>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                                                <span>Ride confirmations</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                                                <span>New messages</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                                <input type="checkbox" style={{ marginRight: '10px' }} />
                                                <span>Marketing emails</span>
                                            </label>
                                        </div>
                                        <div style={{ padding: '20px', border: '2px solid #e2e8f0', borderRadius: '8px' }}>
                                            <h4 style={{ margin: '0 0 10px', color: '#1e293b' }}>Privacy</h4>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                                                <span>Show profile to other users</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                                <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                                                <span>Allow contact via phone</span>
                                            </label>
                                        </div>
                                        <button style={{ padding: '15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Delete Account</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;