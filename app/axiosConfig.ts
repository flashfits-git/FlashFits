import axios, { InternalAxiosRequestConfig } from 'axios';
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

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
            // Because we can't use React Context hooks here (outside of a component),
            // we dispatch a custom event that _layout.tsx will listen to and trigger signOut()
            // This ensures state is consistently cleared using the context.
            DeviceEventEmitter.emit('auth_unauthorized');
        }
        return Promise.reject(error);
    }
);

export default api;
