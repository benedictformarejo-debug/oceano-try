const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => makeRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login:    (credentials) => makeRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => makeRequest('/auth/profile'),
};

// Rooms API
export const roomsAPI = {
  getAll:  () => makeRequest('/rooms'),
  getById: (id) => makeRequest(`/rooms/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create:           (bookingData) => makeRequest('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getBookedDates:   (roomId) => makeRequest(`/bookings/booked-dates/${roomId}`),
  getUserBookings:  () => makeRequest('/bookings/user'),
  getAllBookings:    () => makeRequest('/bookings/all'),
  updateStatus:     (id, status) => makeRequest(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteBooking:    (id) => makeRequest(`/bookings/${id}`, { method: 'DELETE' }),
  getBookingByRef:   (refCode, email) => makeRequest(`/bookings/manage?refCode=${refCode}&email=${encodeURIComponent(email)}`),
cancelBookingByRef:(refCode, email) => makeRequest('/bookings/cancel', { method: 'POST', body: JSON.stringify({ refCode, email }) }),
  modifyBooking: (id, data) => makeRequest(`/bookings/${id}/modify`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Users API
export const usersAPI = {
  getAll:       ()            => makeRequest('/users'),
  updateRole:   (id, role)    => makeRequest(`/users/${id}/role`,   { method: 'PATCH', body: JSON.stringify({ role })   }),
  updateStatus: (id, status)  => makeRequest(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// Settings API
export const settingsAPI = {
  get:    () => makeRequest('/settings'),
  update: (data) => makeRequest('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Requests API
export const requestsAPI = {
  getAll:       () => makeRequest('/requests'),
  create:       (data) => makeRequest('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => makeRequest(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
