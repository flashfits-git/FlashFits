// services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // baseURL: 'http://192.168.0.106:5000/api/',
  baseURL: 'http://192.168.0.102:5000/api/',
  timeout: 10000,
});

// Add interceptor to attach token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
