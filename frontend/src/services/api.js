import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getQuotes = () => api.get('/quotes');
export const getMyQuotes = () => api.get('/quotes/my-quotes');
export const addQuote = (quoteData) => api.post('/quotes', quoteData);
export const updateQuote = (id, quoteData) => api.put(`/quotes/${id}`, quoteData);
export const deleteQuote = (id) => api.delete(`/quotes/${id}`);
export const toggleFavorite = (id) => api.patch(`/quotes/${id}/favorite`);
export const updateProfile = (userData) => api.put('/auth/profile', userData);
export const updatePassword = (passwordData) => api.put('/auth/password', passwordData);

export default api; 