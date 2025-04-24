// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.0.178:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return config}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar respuestas (¡FALTANTE EN TU VERSIÓN!)
api.interceptors.response.use(
  (response) => {
    // Extrae directamente data de la respuesta
    return response.data;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // Error con respuesta del servidor (4xx, 5xx)
      const serverError = {
        status: error.response.status,
        message: error.response.data?.message || 
                error.response.data?.error || 
                'Error en el servidor',
        data: error.response.data
      };
      return Promise.reject(serverError);
    } else if (error.request) {
      // Error sin respuesta (problemas de red)
      return Promise.reject({
        message: 'No se recibió respuesta del servidor',
        isNetworkError: true
      });
    } else {
      // Otros errores
      return Promise.reject({
        message: error.message || 'Error desconocido'
      });
    }
  }
);

export default api;