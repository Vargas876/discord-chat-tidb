/**
 * Servicio de API para comunicación con el backend
 * 
 * Base URL: http://localhost:3001/api
 */

import axios from 'axios';

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptores para logging en desarrollo
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`📥 API Response: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Servicio de Usuarios
 */
export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Crear un nuevo usuario
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

/**
 * Servicio de Conversaciones
 */
export const conversationService = {
  // Obtener todas las conversaciones
  getAll: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Crear una nueva conversación
  create: async (title) => {
    const response = await api.post('/conversations', { title });
    return response.data;
  },
};

/**
 * Servicio de Mensajes
 */
export const messageService = {
  // Obtener mensajes de una conversación
  getByConversation: async (conversationId) => {
    const response = await api.get('/messages', {
      params: { conversationId },
    });
    return response.data;
  },

  // Enviar un nuevo mensaje
  send: async (content, conversationId, senderId) => {
    const response = await api.post('/messages', {
      content,
      conversation_id: conversationId,
      sender_id: senderId,
    });
    return response.data;
  },
};

export default api;
