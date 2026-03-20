// services/api.js
import axios from 'axios';
import Constants from "expo-constants";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

const BACKEND_URL = "https://ff-api-web-1.onrender.com";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/`,
  timeout: 10000,
});

let inMemoryToken = null;

/**
 * Update the in-memory token for immediate use by axios.
 * This helps avoid race conditions with SecureStore lookup.
 */
export const setAuthToken = (token) => {
  inMemoryToken = token;
};

// Add interceptor to attach token to each request
api.interceptors.request.use(
  async (config) => {
    const token = inMemoryToken || await SecureStore.getItemAsync('token');
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
      
      setAuthToken(null);

      // Notify UI via event emitter (used in _layout.tsx)
      DeviceEventEmitter.emit('auth_unauthorized');

      // Fallback redirect
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
