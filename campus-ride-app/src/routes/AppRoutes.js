import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Rides from '../pages/Rides';
import Bookings from '../pages/Bookings';
import Profile from '../pages/Profile';
import Chat from '../pages/Chat';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rides" component={Rides} />
            <Route path="/bookings" component={Bookings} />
            <Route path="/profile" component={Profile} />
            <Route path="/chat" component={Chat} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin" exact component={AdminDashboard} />
        </Switch>
    );
};

export default AppRoutes;