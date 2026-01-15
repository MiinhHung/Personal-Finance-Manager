// src/api/transactionsApi.js
import axiosClient from './axiosClient';

const transactionsApi = {
  // List với filter + phân trang
  getList(params) {
    return axiosClient.get('/transactions', { params });
  },

  // Tạo giao dịch mới
  create(data) {
    return axiosClient.post('/transactions', data);
  },

  // Cập nhật giao dịch
  update(id, data) {
    return axiosClient.put(`/transactions/${id}`, data);
  },

  // Xóa giao dịch
  remove(id) {
    return axiosClient.delete(`/transactions/${id}`);
  },

  // Giao dịch gần nhất cho dashboard
  getRecent(limit = 5) {
    return axiosClient.get('/transactions/recent', {
      params: { limit },
    });
  },
};

export default transactionsApi;