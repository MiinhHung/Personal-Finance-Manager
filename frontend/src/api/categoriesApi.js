// src/api/categoriesApi.js
import axiosClient from './axiosClient';

const categoriesApi = {
  // Lấy tất cả categories cho user hiện tại (system + user)
  getAll(params) {
    return axiosClient.get('/categories', { params });
  },

  // Tạo category mới (của user)
  create(data) {
    // { name, type: 'income' | 'expense' }
    return axiosClient.post('/categories', data);
  },

  // Cập nhật category của user
  update(id, data) {
    return axiosClient.put(`/categories/${id}`, data);
  },

  // Xóa category của user
  remove(id) {
    return axiosClient.delete(`/categories/${id}`);
  },
};

export default categoriesApi;