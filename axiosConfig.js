// services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from "expo-constants";

const { BACKEND_URL } = Constants.expoConfig.extra;
// const api = axios.create({
//   // baseURL: 'http://192.168.0.106:5000/api/',
//   baseURL: 'https://55a299101e7c.ngrok-free.app/api/',
//   timeout: 10000,
// });
const api = axios.create({
  baseURL: `${BACKEND_URL}/api/`,
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
