// src/api/authApi.js
import axiosClient from './axiosClient';

const authApi = {
  register(data) {
    // { fullName, email, password }
    return axiosClient.post('/auth/register', data);
  },

  login(data) {
    // { email, password }
    return axiosClient.post('/auth/login', data);
  },

  getMe() {
    return axiosClient.get('/auth/me');
  },
};

export default authApi;