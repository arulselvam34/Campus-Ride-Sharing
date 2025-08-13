import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Axios instance with token
const api = axios.create({ baseURL: API_URL }); 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Authentication
export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  if (data?.token) localStorage.setItem('token', data.token);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  if (data?.token) localStorage.setItem('token', data.token);
  return data?.user || data;
};

export const logoutUser = async () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('token');
    return { success: true };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const { data } = await api.get('/auth/me');
    return data?.user || data;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

// Ride Management
export const createRide = async (rideData) => {
  const { data } = await api.post('/rides', rideData);
  return data;
};

export const getRides = async ({ page = 0, size = 10, date, start, destination } = {}) => {
  const params = { page, size };
  if (date) params.date = date;
  if (start) params.start = start;
  if (destination) params.destination = destination;
  const { data } = await api.get('/rides', { params });
  return data; // { content, totalElements, totalPages, number, size }
};

export const getRideDetails = async (rideId) => {
  const { data } = await api.get(`/rides/${rideId}`);
  return data;
};

// Booking Management
export const bookRide = async (bookingData) => {
  const { data } = await api.post('/bookings', bookingData);
  return data;
};

export const getUserBookings = async ({ page = 0, size = 10 } = {}) => {
  const { data } = await api.get('/bookings', { params: { page, size } });
  return data;
};

export const getAllBookings = async ({ page = 0, size = 10 } = {}) => {
  const { data } = await api.get('/bookings', { params: { page, size } });
  return data;
};

export const cancelBooking = async (bookingId) => {
  const { data } = await api.delete(`/bookings/${bookingId}`);
  return data;
};

// Chat Management
export const sendMessage = async (messageData) => {
    const response = await axios.post(`${API_URL}/messages`, messageData);
    return response.data;
};

export const getMessages = async (rideId) => {
    const response = await axios.get(`${API_URL}/messages/${rideId}`);
    return response.data;
};

// Ratings Management
export const submitRating = async (ratingData) => {
    const response = await axios.post(`${API_URL}/ratings`, ratingData);
    return response.data;
};

export const getRatings = async (rideId) => {
    const response = await axios.get(`${API_URL}/ratings/${rideId}`);
    return response.data;
};

// Alias for backward compatibility
export const postRide = createRide;