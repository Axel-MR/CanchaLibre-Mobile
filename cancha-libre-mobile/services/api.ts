// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// La URL base ya incluye /api, así que no necesitamos repetirlo en las rutas del frontend
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
    // Log para depuración
    console.log('API Request:', config.method, config.url, config.headers);
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mejorar el interceptor de respuesta para más información de depuración
instance.interceptors.response.use(
  (response) => {
    console.log(`API Response (${response.config.url}):`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error(`API Error (${error.config?.url}):`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('API Error (No Response):', error.request);
    } else {
      // Algo sucedió al configurar la solicitud que desencadenó un error
      console.error('API Error (Request Setup):', error.message);
    }
    return Promise.reject(error);
  }
);

// Asegúrate de que la exportación sea correcta
const api = instance;
export default api;