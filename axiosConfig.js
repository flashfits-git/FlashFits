// services/api.js
import axios from 'axios';
import Constants from "expo-constants";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL || Constants.manifest2?.extra?.expoConfig?.extra?.BACKEND_URL || "https://fdf0-2405-201-f001-8ff-5930-af76-cae3-335c.ngrok-free.app";

// const api = axios.create({
//   // baseURL: 'http://192.168.0.106:5000/api/',
//   baseURL: 'https://55a299101e7c.ngrok-free.app/api/',
//   timeout: 10000,
// });
const api = axios.create({
  // baseURL: 'http://192.168.0.106:5000/api/',
  // baseURL: 'https://55a299101e7c.ngrok-free.app/api/',
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

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and related data
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('selectedAddress');
      await SecureStore.setItemAsync("addressSelectedOnce", "false");

      // Redirect to auth
      router.replace('/(auth)');
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => {
  // Only unwrap if it looks like an ApiResponse
  if (response.data?.success !== undefined && response.data?.data !== undefined) {
    response.data = response.data.data;
  }
  return response;
});

export default api;
