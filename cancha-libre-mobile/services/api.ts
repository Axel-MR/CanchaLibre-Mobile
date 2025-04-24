// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.100.13:3000/api'; 

// Crear la instancia de axios
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para el token
instance.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Agregar interceptor para logs de depuración
instance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status || error.message);
    return Promise.reject(error);
  }
);

// Asegúrate de que la exportación sea correcta
const api = instance;
export default api;