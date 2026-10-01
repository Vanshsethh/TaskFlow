import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://taskflow-qlfe.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Helper to get stored auth token
export const getStoredToken = () => {
  return localStorage.getItem('taskflow_token') || sessionStorage.getItem('taskflow_token');
};

// Request interceptor: Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error formatting and 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Clean up stored auth tokens upon 401
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        sessionStorage.removeItem('taskflow_token');
        sessionStorage.removeItem('taskflow_user');

        // If not already on login page, redirect
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login?sessionExpired=true';
        }
      }

      customError = data?.message || data?.errors?.[0]?.message || `Error: ${status}`;
    } else if (error.request) {
      // Network failure
      customError = 'Unable to connect to the server. Please check your network or server status.';
    } else {
      customError = error.message;
    }

    const enhancedError = new Error(customError);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export default api;
