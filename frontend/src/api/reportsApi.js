// src/api/reportsApi.js
import axiosClient from './axiosClient';

const reportsApi = {
  getMonthlySummary(month) {
    const params = {};
    if (month) params.month = month; // format YYYY-MM
    return axiosClient.get('/reports/summary', { params });
  },

  getByCategory({ from, to, type }) {
    return axiosClient.get('/reports/by-category', {
      params: { from, to, type }, // type: 'income' | 'expense'
    });
  },
};

export default reportsApi;