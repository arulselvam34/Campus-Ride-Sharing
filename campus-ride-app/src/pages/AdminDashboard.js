import React, { useEffect, useState } from 'react';
import { getRides, getUserBookings } from '../api';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {
    const [rides, setRides] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRides: 0,
        totalBookings: 0,
        activeRides: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [debugInfo, setDebugInfo] = useState('');
    const history = useHistory();

    // Static sample data for demonstration
    const sampleRides = [
        {
            id: 1,
            startLocation: "Academic Block A",
            destination: "Hostel Block B",
            date: "2025-08-15",
            time: "09:00",
            seatsAvailable: 3,
            driver: { username: "John Doe", id: 1 }
        },
        {
            id: 2,
            startLocation: "Library",
            destination: "Cafeteria",
            date: "2025-08-15",
            time: "12:30",
            seatsAvailable: 2,
            driver: { username: "Jane Smith", id: 2 }
        },
        {
            id: 3,
            startLocation: "Hostel Block A",
            destination: "Academic Block C",
            date: "2025-08-16",
            time: "08:00",
            seatsAvailable: 4,
            driver: { username: "Mike Johnson", id: 3 }
        },
        {
            id: 4,
            startLocation: "Sports Complex",
            destination: "Academic Block B",
            date: "2025-08-16",
            time: "15:00",
            seatsAvailable: 1,
            driver: { username: "Sarah Wilson", id: 4 }
        }
    ];

    const sampleBookings = [
        {
            id: 1,
            seats: 2,
            status: "CONFIRMED",
            rider: { username: "Alex Brown", id: 5 },
            ride: { startLocation: "Academic Block A", destination: "Hostel Block B", date: "2025-08-15" }
        },
        {
            id: 2,
            seats: 1,
            status: "CONFIRMED",
            rider: { username: "Emma Davis", id: 6 },
            ride: { startLocation: "Library", destination: "Cafeteria", date: "2025-08-15" }
        },
        {
            id: 3,
            seats: 3,
            status: "PENDING",
            rider: { username: "Tom Wilson", id: 7 },
            ride: { startLocation: "Hostel Block A", destination: "Academic Block C", date: "2025-08-16" }
        }
    ];

    const sampleUsers = [
        { id: 1, username: "John Doe", email: "john@campus.edu", role: "Driver", status: "Active" },
        { id: 2, username: "Jane Smith", email: "jane@campus.edu", role: "Driver", status: "Active" },
        { id: 3, username: "Mike Johnson", email: "mike@campus.edu", role: "Driver", status: "Active" },
        { id: 4, username: "Sarah Wilson", email: "sarah@campus.edu", role: "Driver", status: "Active" },
        { id: 5, username: "Alex Brown", email: "alex@campus.edu", role: "Rider", status: "Active" },
        { id: 6, username: "Emma Davis", email: "emma@campus.edu", role: "Rider", status: "Active" },
        { id: 7, username: "Tom Wilson", email: "tom@campus.edu", role: "Rider", status: "Active" }
    ];

    console.log('AdminDashboard component rendering...');

    useEffect(() => {
        console.log('AdminDashboard useEffect triggered');
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                setDebugInfo('Loading dashboard data...');
                
                // Check if user is logged in
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please login again.');
                    setLoading(false);
                    return;
                }
                
                setDebugInfo('Fetching rides and bookings...');
                
                // Try to fetch data with better error handling
                let ridesData = [];
                let bookingsData = [];
                
                try {
                    const ridesPage = await getRides({ page: 0, size: 50 });
                    ridesData = ridesPage.content || ridesPage || [];
                    setDebugInfo('Rides loaded successfully');
                } catch (e) {
                    console.error('Error fetching rides:', e);
                    setDebugInfo('Using sample data - API not available');
                    ridesData = sampleRides; // Use sample data if API fails
                }
                
                try {
                    const bookingsPage = await getUserBookings({ page: 0, size: 50 });
                    bookingsData = bookingsPage.content || bookingsPage || [];
                    setDebugInfo('Bookings loaded successfully');
                } catch (e) {
                    console.error('Error fetching bookings:', e);
                    setDebugInfo('Using sample data - API not available');
                    bookingsData = sampleBookings; // Use sample data if API fails
                }
                
                console.log('Rides data:', ridesData);
                console.log('Bookings data:', bookingsData);
                
                setRides(ridesData);
                setBookings(bookingsData);
                
                // Calculate statistics
                const totalRides = ridesData.length;
                const totalBookings = bookingsData.length;
                const activeRides = ridesData.filter(ride => new Date(ride.date) >= new Date()).length;
                
                // Extract unique users from rides and bookings
                const allUsers = new Set();
                ridesData.forEach(ride => {
                    if (ride.driver) allUsers.add(ride.driver.id);
                });
                bookingsData.forEach(booking => {
                    if (booking.rider) allUsers.add(booking.rider.id);
                });
                
                setStats({
                    totalUsers: sampleUsers.length, // Use sample user count
                    totalRides,
                    totalBookings,
                    activeRides
                });
                
                setDebugInfo(`Dashboard loaded: ${totalRides} rides, ${totalBookings} bookings, ${sampleUsers.length} users`);
                
            } catch (e) {
                console.error('Dashboard loading error:', e);
                setError(`Failed to load dashboard data: ${e.message}`);
                setDebugInfo(`Error: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        loadDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    };

    const StatCard = ({ title, value, color, icon, subtitle }) => (
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: `3px solid ${color}`,
            textAlign: 'center',
            minWidth: '200px'
        }}>
            <div style={{ fontSize: '48px', color: color, marginBottom: '8px' }}>{icon}</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '18px' }}>{title}</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: color }}>{value}</div>
            {subtitle && (
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{subtitle}</div>
            )}
        </div>
    );

    const TabButton = ({ id, label, active }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                padding: '12px 24px',
                border: 'none',
                background: active ? '#dc2626' : '#f3f4f6',
                color: active ? 'white' : '#374151',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: active ? '600' : '500',
                marginRight: '8px'
            }}
        >
            {label}
        </button>
    );

    // Always render something, even if there are errors
    console.log('AdminDashboard render state:', { loading, error, debugInfo, rides: rides.length, bookings: bookings.length });

    // Simple test render to verify component is working
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#f9fafb',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Test Header - Always visible */}
            <div style={{
                background: 'white',
                padding: '20px 32px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#dc2626', fontSize: '28px' }}>🚗 CampusRide Admin</h1>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Administrative Dashboard</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Logout
                </button>
            </div>

            <div style={{ padding: '32px' }}>
                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '200px',
                        fontSize: '18px',
                        color: '#6b7280'
                    }}>
                        <div>Loading Admin Dashboard...</div>
                    </div>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '24px',
                            marginBottom: '32px'
                        }}>
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                color="#3b82f6"
                                icon="👥"
                                subtitle="Registered users"
                            />
                            <StatCard
                                title="Total Rides"
                                value={stats.totalRides}
                                color="#10b981"
                                icon="🚗"
                                subtitle="Posted rides"
                            />
                            <StatCard
                                title="Total Bookings"
                                value={stats.totalBookings}
                                color="#f59e0b"
                                icon="📋"
                                subtitle="Confirmed bookings"
                            />
                            <StatCard
                                title="Active Rides"
                                value={stats.activeRides}
                                color="#ef4444"
                                icon="🟢"
                                subtitle="Today & future"
                            />
                        </div>

                        {/* Quick Stats Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '32px'
                        }}>
                            <div style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>4</div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>Drivers</div>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>3</div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>Riders</div>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>2</div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>Confirmed</div>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>1</div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{ marginBottom: '24px' }}>
                            <TabButton id="overview" label="Overview" active={activeTab === 'overview'} />
                            <TabButton id="users" label="Users" active={activeTab === 'users'} />
                            <TabButton id="rides" label="Rides" active={activeTab === 'rides'} />
                            <TabButton id="bookings" label="Bookings" active={activeTab === 'bookings'} />
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <h2 style={{ margin: '0 0 24px 0', color: '#374151' }}>System Overview</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <h3 style={{ color: '#6b7280', marginBottom: '16px' }}>Recent Rides ({rides.length})</h3>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {rides.length > 0 ? rides.slice(0, 5).map(ride => (
                                                <div key={ride.id} style={{
                                                    padding: '12px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    marginBottom: '8px'
                                                }}>
                                                    <div style={{ fontWeight: '600' }}>{ride.startLocation} → {ride.destination}</div>
                                                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                                        {ride.date} • {ride.driver?.username || 'Unknown'} • {ride.seatsAvailable} seats
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                                                    No rides found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#6b7280', marginBottom: '16px' }}>Recent Bookings ({bookings.length})</h3>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {bookings.length > 0 ? bookings.slice(0, 5).map(booking => (
                                                <div key={booking.id} style={{
                                                    padding: '12px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    marginBottom: '8px'
                                                }}>
                                                    <div style={{ fontWeight: '600' }}>Booking #{booking.id}</div>
                                                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                                        {booking.ride?.startLocation} → {booking.ride?.destination}
                                                    </div>
                                                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                                        Status: {booking.status}
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                                                    No bookings found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rides' && (
                            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <h2 style={{ margin: '0 0 24px 0', color: '#374151' }}>All Rides ({rides.length})</h2>
                                {rides.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f9fafb' }}>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Driver</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>From</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>To</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Date</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Time</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Seats</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rides.map(ride => (
                                                    <tr key={ride.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '12px' }}>{ride.id}</td>
                                                        <td style={{ padding: '12px' }}>{ride.driver?.username || 'N/A'}</td>
                                                        <td style={{ padding: '12px' }}>{ride.startLocation}</td>
                                                        <td style={{ padding: '12px' }}>{ride.destination}</td>
                                                        <td style={{ padding: '12px' }}>{ride.date}</td>
                                                        <td style={{ padding: '12px' }}>{ride.time}</td>
                                                        <td style={{ padding: '12px' }}>{ride.seatsAvailable}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                background: new Date(ride.date) >= new Date() ? '#dcfce7' : '#fef2f2',
                                                                color: new Date(ride.date) >= new Date() ? '#166534' : '#dc2626'
                                                            }}>
                                                                {new Date(ride.date) >= new Date() ? 'Active' : 'Past'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                        No rides found in the system
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <h2 style={{ margin: '0 0 24px 0', color: '#374151' }}>All Bookings ({bookings.length})</h2>
                                {bookings.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f9fafb' }}>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Rider</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Ride</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Seats</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map(booking => (
                                                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '12px' }}>{booking.id}</td>
                                                        <td style={{ padding: '12px' }}>{booking.rider?.username || 'N/A'}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            {booking.ride?.startLocation} → {booking.ride?.destination}
                                                        </td>
                                                        <td style={{ padding: '12px' }}>{booking.seats}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                background: booking.status === 'CONFIRMED' ? '#dcfce7' : 
                                                                           booking.status === 'CANCELLED' ? '#fef2f2' : '#fef3c7',
                                                                color: booking.status === 'CONFIRMED' ? '#166534' : 
                                                                       booking.status === 'CANCELLED' ? '#dc2626' : '#d97706'
                                                            }}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>{booking.ride?.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                        No bookings found in the system
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <h2 style={{ margin: '0 0 24px 0', color: '#374151' }}>User Management ({sampleUsers.length} Users)</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb' }}>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Username</th>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Email</th>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Role</th>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sampleUsers.map(user => (
                                                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '12px' }}>{user.id}</td>
                                                    <td style={{ padding: '12px' }}>{user.username}</td>
                                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            background: user.role === 'Driver' ? '#dbeafe' : '#fef3c7',
                                                            color: user.role === 'Driver' ? '#1e40af' : '#d97706'
                                                        }}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px' }}>
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            background: '#dcfce7',
                                                            color: '#166534'
                                                        }}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px' }}>
                                                        <button style={{
                                                            padding: '4px 8px',
                                                            background: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px',
                                                            marginRight: '4px'
                                                        }}>
                                                            Edit
                                                        </button>
                                                        <button style={{
                                                            padding: '4px 8px',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;



