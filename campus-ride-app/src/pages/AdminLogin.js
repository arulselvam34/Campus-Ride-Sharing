import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { loginUser } from '../api';

const AdminLogin = () => {
    const { dispatch } = useApp();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser({ email, password });
            if (user.role !== 'Admin') {
                setError('Not an admin account');
                return;
            }
            dispatch({ type: 'LOGIN', payload: { id: user.id, name: user.username, email: user.email, role: user.role, isLoggedIn: true } });
            history.push('/admin');
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 8, width: 360 }}>
                <h2>Admin Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <button type="submit" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;

