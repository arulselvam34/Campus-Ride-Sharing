import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    rating: 0,
    isLoggedIn: false
  },
  notifications: [],
  rides: [
    { id: 1, driver: 'John D.', driverId: 2, from: 'Main Gate', to: 'Academic Block A', date: '2024-01-15', time: '2:00 PM', seats: 3, price: 50, rating: 4.8, car: 'Honda City', status: 'active' },
    { id: 2, driver: 'Sarah M.', driverId: 3, from: 'Library', to: 'Hostel Block B', date: '2024-01-15', time: '6:30 PM', seats: 2, price: 80, rating: 4.9, car: 'Maruti Swift', status: 'active' },
    { id: 3, driver: 'Mike R.', driverId: 4, from: 'Hostel Block A', to: 'Academic Block C', date: '2024-01-16', time: '4:15 PM', seats: 1, price: 200, rating: 4.7, car: 'Toyota Innova', status: 'active' }
  ],
  bookings: [
    { id: 1, rideId: 1, userId: 1, driver: 'John D.', from: 'Main Gate', to: 'City Mall', date: '2024-01-15', time: '2:00 PM', status: 'confirmed', price: 50, seats: 2 },
    { id: 2, rideId: 2, userId: 1, driver: 'Sarah M.', from: 'Library', to: 'Railway Station', date: '2024-01-16', time: '6:30 PM', status: 'pending', price: 80, seats: 1 }
  ],
  pastBookings: [
    { id: 3, rideId: 3, userId: 1, driver: 'Mike R.', from: 'Hostel', to: 'AB block', date: '2024-01-10', time: '4:15 PM', status: 'completed', price: 200, seats: 1, rating: 5 }
  ],
  chats: [
    { id: 1, name: 'John D.', lastMessage: 'See you at the pickup point!', time: '2:30 PM', unread: 2, online: true },
    { id: 2, name: 'Sarah M.', lastMessage: 'Thanks for the ride!', time: '1:15 PM', unread: 0, online: false },
    { id: 3, name: 'Mike R.', lastMessage: 'Running 5 minutes late', time: '12:45 PM', unread: 1, online: true }
  ],
  messages: {
    1: [
      { id: 1, sender: 'John D.', message: 'Hi! I\'m the driver for tomorrow\'s ride to City Mall', time: '2:00 PM', isMe: false },
      { id: 2, sender: 'You', message: 'Great! What time should I be ready?', time: '2:05 PM', isMe: true },
      { id: 3, sender: 'John D.', message: 'I\'ll pick you up at 2:00 PM sharp from Main Gate', time: '2:10 PM', isMe: false },
      { id: 4, sender: 'John D.', message: 'See you at the pickup point!', time: '2:30 PM', isMe: false }
    ]
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { ...state.user, ...action.payload, isLoggedIn: true }
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: { id: null, name: '', email: '', phone: '', studentId: '', department: '', year: '', rating: 0, isLoggedIn: false },
        bookings: [],
        pastBookings: []
      };
    
    case 'REGISTER':
      return {
        ...state,
        user: { ...state.user, ...action.payload, isLoggedIn: true }
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'RATE_RIDE':
      return {
        ...state,
        pastBookings: state.pastBookings.map(booking => 
          booking.id === action.payload.bookingId 
            ? { ...booking, rating: action.payload.rating, comment: action.payload.comment }
            : booking
        )
      };
    
    case 'BOOK_RIDE':
      const newBooking = {
        id: Date.now(),
        rideId: action.payload.rideId,
        userId: state.user.id,
        driver: action.payload.driver,
        from: action.payload.from,
        to: action.payload.to,
        date: action.payload.date,
        time: action.payload.time,
        status: 'pending',
        price: action.payload.price,
        seats: action.payload.seats
      };
      return {
        ...state,
        bookings: [...state.bookings, newBooking],
        rides: state.rides.map(ride => 
          ride.id === action.payload.rideId 
            ? { ...ride, seats: ride.seats - action.payload.seats }
            : ride
        )
      };
    
    case 'CANCEL_BOOKING':
      const cancelledBooking = state.bookings.find(b => b.id === action.payload);
      return {
        ...state,
        bookings: state.bookings.filter(b => b.id !== action.payload),
        rides: state.rides.map(ride => 
          ride.id === cancelledBooking?.rideId 
            ? { ...ride, seats: ride.seats + cancelledBooking.seats }
            : ride
        )
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'SEND_MESSAGE':
      const chatId = action.payload.chatId;
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        message: action.payload.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage]
        },
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? { ...chat, lastMessage: action.payload.message, time: newMessage.time }
            : chat
        )
      };
    
    case 'POST_RIDE':
      const newRide = {
        id: Date.now(),
        driver: state.user.name,
        driverId: state.user.id,
        from: action.payload.from,
        to: action.payload.to,
        date: action.payload.date,
        time: action.payload.time,
        seats: parseInt(action.payload.seats),
        price: parseInt(action.payload.price),
        rating: state.user.rating,
        car: action.payload.car || 'Personal Vehicle',
        status: 'active'
      };
      return {
        ...state,
        rides: [...state.rides, newRide]
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}