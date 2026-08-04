import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Events ──────────────────────────────────────────────────
export const getEvents = (params = {}) => api.get('/events', { params });
export const getEvent  = (id)          => api.get(`/events/${id}`);
export const createEvent = (data)      => api.post('/events', data);
export const updateEvent = (id, data)  => api.put(`/events/${id}`, data);
export const deleteEvent = (id)        => api.delete(`/events/${id}`);

// ── Bookings ─────────────────────────────────────────────────
export const createBooking  = (data) => api.post('/bookings', data);
export const getBookings    = ()     => api.get('/bookings');
export const getBookingByRef= (ref, email) => api.get(`/bookings/${ref}?email=${encodeURIComponent(email)}`);
export const deleteBooking  = (id)   => api.delete(`/bookings/${id}`);
export const deletePublicBooking = (ref, email) => api.delete(`/bookings/public/${ref}?email=${encodeURIComponent(email)}`);


// ── Vendors ──────────────────────────────────────────────────
export const getVendors   = (params = {}) => api.get('/vendors', { params });
export const createVendor = (data)        => api.post('/vendors', data);
export const updateVendor = (id, data)    => api.put(`/vendors/${id}`, data);
export const deleteVendor = (id)          => api.delete(`/vendors/${id}`);

// ── Announcements ────────────────────────────────────────────
export const getAnnouncements    = ()          => api.get('/announcements');
export const createAnnouncement  = (data)      => api.post('/announcements', data);
export const updateAnnouncement  = (id, data)  => api.put(`/announcements/${id}`, data);
export const deleteAnnouncement  = (id)        => api.delete(`/announcements/${id}`);

// ── Contact ──────────────────────────────────────────────────
export const submitContact  = (data) => api.post('/contact', data);
export const getMessages    = ()     => api.get('/contact');
export const deleteMessage  = (id)   => api.delete(`/contact/${id}`);

// ── Dashboard ────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats');

// ── Admin Auth ───────────────────────────────────────────────
export const adminLogin  = (data) => api.post('/admin/login', data);
export const adminLogout = ()     => api.post('/admin/logout');
export const adminMe     = ()     => api.get('/admin/me');

export default api;
