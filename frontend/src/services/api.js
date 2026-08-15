import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response) {
      if (error.response.data && error.response.data.error) {
        message = error.response.data.error;
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          message += `: ${error.response.data.details.join(', ')}`;
        }
      } else {
        message = `Server error (${error.response.status})`;
      }
    } else if (error.request) {
      message = 'Unable to connect to the server. Please ensure the backend is running.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
