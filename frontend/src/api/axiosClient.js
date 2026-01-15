// src/api/axiosClient.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy token từ localStorage
const getToken = () => localStorage.getItem('pf_token');

// Request interceptor: gắn Authorization header nếu có token
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: có thể xử lý 401 chung
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu cần, sau này ta có thể auto-logout khi 401
    return Promise.reject(error);
  },
);

export default axiosClient;