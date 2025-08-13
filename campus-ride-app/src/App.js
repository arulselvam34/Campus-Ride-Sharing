import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Home from './pages/Home';
import Rides from './pages/Rides';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotificationToast from './components/NotificationToast';
import './styles/main.css';

function AppContent() {
  const { state, dispatch } = useApp();
  const [notification, setNotification] = React.useState({ message: '', type: '', isVisible: false });

  React.useEffect(() => {
    if (state.notifications.length > 0) {
      const latest = state.notifications[state.notifications.length - 1];
      setNotification({ ...latest, isVisible: true });
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: latest.id });
      }, 3000);
    }
  }, [state.notifications, dispatch]);

  // Check if user is logged in and if they're trying to access admin routes
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  if (!state.user.isLoggedIn && !isAdminRoute) {
    return <Login />;
  }

  // If it's an admin route, render admin components
  if (isAdminRoute) {
    return (
      <>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" exact component={AdminDashboard} />
        </Switch>
        <NotificationToast
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />
      </>
    );
  }

  // Regular user routes
  return (
    <>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rides" component={Rides} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/profile" component={Profile} />
        <Route path="/chat" component={Chat} />
      </Switch>
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;