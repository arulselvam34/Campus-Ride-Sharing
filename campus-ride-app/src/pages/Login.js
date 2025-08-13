import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { loginUser, registerUser } from '../api';

const Login = () => {
    const { dispatch } = useApp();
    const history = useHistory();
    const [mode, setMode] = useState('user-login'); // 'user-login', 'admin-login', 'register'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        studentId: '',
        department: '',
        phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'register') {
                const data = await registerUser({ username: formData.name, email: formData.email, password: formData.password, role: 'Rider' });
                const u = data.user || data;
                const mapped = { id: u.id, name: u.username || u.name, email: u.email, role: u.role, isLoggedIn: true };
                dispatch({ type: 'REGISTER', payload: mapped });
                alert('Registration successful!');
                history.push('/');
            } else {
                const user = await loginUser({ email: formData.email, password: formData.password });
                const mapped = { id: user.id, name: user.username || user.name, email: user.email, role: user.role, isLoggedIn: true };
                dispatch({ type: 'LOGIN', payload: mapped });
                alert('Login successful!');
                history.push(user.role === 'Admin' ? '/admin' : '/');
            }
        } catch (err) {
            alert(err?.response?.data?.message || 'Authentication failed');
        }
    };

    const getButtonColor = (currentMode) => {
        if (currentMode === 'admin-login') return '#dc2626';
        if (currentMode === 'register') return '#f59e0b';
        return '#22c55e';
    };

    const getButtonText = () => {
        switch (mode) {
            case 'user-login': return 'Login as User';
            case 'admin-login': return 'Login as Admin';
            case 'register': return 'Register';
            default: return 'Submit';
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#22c55e', fontSize: '32px', margin: '0 0 10px' }}>CampusRide</h1>
                    <p style={{ color: '#64748b', margin: '0' }}>Campus Ride Sharing Platform</p>
                </div>

                {/* Three Options */}
                <div style={{ display: 'flex', marginBottom: '30px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                    <button
                        onClick={() => setMode('user-login')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            background: mode === 'user-login' ? '#22c55e' : 'transparent',
                            color: mode === 'user-login' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Login as User
                    </button>
                    <button
                        onClick={() => setMode('admin-login')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            background: mode === 'admin-login' ? '#dc2626' : 'transparent',
                            color: mode === 'admin-login' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Login as Admin
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            background: mode === 'register' ? '#f59e0b' : 'transparent',
                            color: mode === 'register' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Mode-specific Info */}
                {mode === 'admin-login' && (
                    <div style={{ 
                        background: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0', color: '#dc2626', fontWeight: '600' }}>
                            Admin Login
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: '#7f1d1d', fontSize: '14px' }}>
                            Use admin credentials to access the admin dashboard
                        </p>
                    </div>
                )}

                {mode === 'register' && (
                    <div style={{ 
                        background: '#fffbeb', 
                        border: '1px solid #fed7aa', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0', color: '#d97706', fontWeight: '600' }}>
                            New User Registration
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: '#92400e', fontSize: '14px' }}>
                            Create a new account to start using CampusRide
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Student ID"
                                value={formData.studentId}
                                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder={mode === 'admin-login' ? 'Admin Email' : 'College Email'}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '2px solid #e2e8f0', borderRadius: '5px' }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: getButtonColor(mode),
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {getButtonText()}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;