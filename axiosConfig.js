// services/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.0.100:5000/api/',
  baseURL: 'http://192.168.60.28:3000/api/',
  timeout: 10000,
});

export default api;
