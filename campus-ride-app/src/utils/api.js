// Mock API functions for backend integration
const API_BASE_URL = 'http://localhost:8080/api';

// Authentication APIs
export const authAPI = {
    login: async (credentials) => {
        // Mock login - replace with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        name: 'John Student',
                        email: credentials.email,
                        phone: '+91 98765 43210',
                        studentId: 'CS2021001',
                        department: 'Computer Science',
                        year: '3rd Year',
                        rating: 4.8
                    }
                });
            }, 1000);
        });
    },
    
    register: async (userData) => {
        // Mock register - replace with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        ...userData,
                        rating: 5.0
                    }
                });
            }, 1000);
        });
    }
};

// Rides APIs
export const ridesAPI = {
    getAllRides: async () => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    rides: [
                        { id: 1, driver: 'John D.', from: 'Main Gate', to: 'City Mall', date: '2024-01-15', time: '2:00 PM', seats: 3, price: 50, rating: 4.8, car: 'Honda City' }
                    ]
                });
            }, 500);
        });
    },
    
    createRide: async (rideData) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    ride: { 
                        id: Date.now(), 
                        ...rideData,
                        driver: { username: 'Current User' },
                        status: 'active'
                    }
                });
            }, 500);
        });
    },
    
    postRide: async (rideData) => {
        // Alias for createRide
        return ridesAPI.createRide(rideData);
    },
    
    bookRide: async (bookingData) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    booking: { id: Date.now(), ...bookingData }
                });
            }, 500);
        });
    }
};

// Chat APIs
export const chatAPI = {
    getMessages: async (chatId) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    messages: []
                });
            }, 300);
        });
    },
    
    sendMessage: async (messageData) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: { id: Date.now(), ...messageData }
                });
            }, 300);
        });
    }
};

// Profile APIs
export const profileAPI = {
    updateProfile: async (profileData) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: profileData
                });
            }, 500);
        });
    }
};

// Ratings APIs
export const ratingsAPI = {
    submitRating: async (ratingData) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    rating: { id: Date.now(), ...ratingData }
                });
            }, 500);
        });
    }
};