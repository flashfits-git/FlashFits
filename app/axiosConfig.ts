import axios, { InternalAxiosRequestConfig } from 'axios';
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL || "https://fdf0-2405-201-f001-8ff-5930-af76-cae3-335c.ngrok-free.app";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/`,
    timeout: 10000,
});

let inMemoryToken: string | null = null;

/**
 * Update the in-memory token for immediate use by axios.
 * This should be called during login/logout to avoid race conditions 
 * with SecureStore lookup.
 */
export const setAuthToken = (token: string | null) => {
    inMemoryToken = token;
};

// Add interceptor to attach token to each request
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Use in-memory token if available (faster and more reliable during login/logout)
        // otherwise fall back to SecureStore
        const token = inMemoryToken || await SecureStore.getItemAsync('token');
        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - Token: ${token ? 'Present' : 'Missing'} (inMemory: ${inMemoryToken ? 'Yes' : 'No'})`);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => {
        console.log(`[Response] ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        console.error(`[Response Error] ${error.response?.status} ${error.config?.url}`, error.response?.data);
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized event received, dispatching auth_unauthorized...');
            // Because we can't use React Context hooks here (outside of a component),
            // we dispatch a custom event that _layout.tsx will listen to and trigger signOut()
            // This ensures state is consistently cleared using the context.
            DeviceEventEmitter.emit('auth_unauthorized');
        }
        return Promise.reject(error);
    }
);

export default api;
