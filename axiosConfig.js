// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.101:5000/api/',
  timeout: 10000,
});

export default api;
