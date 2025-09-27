import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual API base URL

export const userAPI = {
  get: (url, config) => axios.get(`${API_BASE_URL}${url}`, config),
  post: (url, data, config) => axios.post(`${API_BASE_URL}${url}`, data, config),
  put: (url, data, config) => axios.put(`${API_BASE_URL}${url}`, data, config),
  delete: (url, config) => axios.delete(`${API_BASE_URL}${url}`, config),
  updateUser: (userId, data) => axios.put(`${API_BASE_URL}/users/${userId}`, data),
};