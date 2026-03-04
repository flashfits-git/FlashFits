import axios, { InternalAxiosRequestConfig } from 'axios';
import Constants from "expo-constants";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL ||
    (Constants as any).manifest2?.extra?.expoConfig?.extra?.BACKEND_URL ||
    "https://ff-api-web-1.onrender.com";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/`,
    timeout: 10000,
});

// Add interceptor to attach token to each request
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItemAsync('token');
        if (token && config.headers) {
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
            router.replace('/(auth)' as any);
        }
        return Promise.reject(error);
    }
);

export default api;
