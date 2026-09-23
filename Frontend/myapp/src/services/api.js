import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8008/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Initialize Authorization header from localStorage on load if available
const initialToken = localStorage.getItem('smartlms_token') || localStorage.getItem('token');
if (initialToken) {
  const cleanInit = initialToken.startsWith('Bearer ') ? initialToken.substring(7).trim() : initialToken.trim();
  api.defaults.headers.common['Authorization'] = `Bearer ${cleanInit}`;
}

// Request Interceptor: attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem('smartlms_token') || localStorage.getItem('token');
    if (rawToken) {
      const cleanToken = rawToken.startsWith('Bearer ') ? rawToken.substring(7).trim() : rawToken.trim();
      const bearerValue = `Bearer ${cleanToken}`;
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', bearerValue);
      }
      config.headers['Authorization'] = bearerValue;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 & session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear tokens and redirect to login if session expired
      localStorage.removeItem('smartlms_token');
      localStorage.removeItem('token');
      localStorage.removeItem('smartlms_user');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
