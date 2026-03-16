/**
 * Servicio de WebSocket para chat en tiempo real
 * 
 * Conecta con el servidor Socket.IO en ws://localhost:3002
 */

import { io } from 'socket.io-client';

// Usar variable de entorno para producción, fallback a localhost para desarrollo
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3002';

let socket = null;
let isConnecting = false;
let connectionPromise = null;

/**
 * Inicializar conexión WebSocket
 */
export const initSocket = () => {
  // Si ya está conectado, resolver inmediatamente
  if (socket?.connected) {
    return Promise.resolve(socket);
  }

  // Si ya hay una conexión en curso, retornar la misma promesa
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  isConnecting = true;
  connectionPromise = new Promise((resolve, reject) => {
    try {
      // Usar localhost para consistencia si el server espera localhost en CORS
      socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000, // Aumentar timeout a 10s
      });

      socket.on('connect', () => {
        console.log('✅ WebSocket conectado:', socket.id);
        isConnecting = false;
        resolve(socket);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión WebSocket:', error);
        isConnecting = false;
        connectionPromise = null;
        reject(error);
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket desconectado:', reason);
        isConnecting = false;
        connectionPromise = null;
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 WebSocket reconectado (intento', attemptNumber + ')');
      });
    } catch (err) {
      isConnecting = false;
      connectionPromise = null;
      reject(err);
    }
  });

  return connectionPromise;
};

/**
 * Obtener instancia del socket
 */
export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket no inicializado. Llama a initSocket() primero.');
  }
  return socket;
};

/**
 * Desconectar socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Unirse a una conversación
 */
export const joinConversation = (conversationId) => {
  if (socket) {
    socket.emit('join-conversation', conversationId);
  }
};

/**
 * Salir de una conversación
 */
export const leaveConversation = (conversationId) => {
  if (socket) {
    socket.emit('leave-conversation', conversationId);
  }
};

/**
 * Enviar mensaje vía WebSocket
 */
export const sendMessageSocket = (messageData) => {
  if (socket) {
    socket.emit('send-message', messageData);
    return true;
  }
  return false;
};

/**
 * Escuchar nuevos mensajes
 */
export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('new-message', callback);
  }
};

/**
 * Dejar de escuchar nuevos mensajes
 */
export const offNewMessage = (callback) => {
  if (socket) {
    socket.off('new-message', callback);
  }
};

/**
 * Indicadores de escritura
 */
export const emitTyping = (conversationId, userName) => {
  if (socket) socket.emit('typing', { conversation_id: conversationId, user_name: userName });
};

export const emitStopTyping = (conversationId, userName) => {
  if (socket) socket.emit('stop-typing', { conversation_id: conversationId, user_name: userName });
};

export const onTyping = (callback) => {
  if (socket) socket.on('user-typing', callback);
};

export const onStopTyping = (callback) => {
  if (socket) socket.on('user-stop-typing', callback);
};

/**
 * Reacciones
 */
export const addReactionSocket = (data) => {
  if (socket) socket.emit('add-reaction', data);
};

export const onReactionAdded = (callback) => {
  if (socket) socket.on('reaction-added', callback);
};

export const onReactionRemoved = (callback) => {
  if (socket) socket.on('reaction-removed', callback);
};

/**
 * Edición y Eliminación
 */
export const editMessageSocket = (data) => {
  if (socket) socket.emit('edit-message', data);
};

export const deleteMessageSocket = (data) => {
  if (socket) socket.emit('delete-message', data);
};

export const onMessageUpdated = (callback) => {
  if (socket) socket.on('message-updated', callback);
};

export const onMessageDeleted = (callback) => {
  if (socket) socket.on('message-deleted', callback);
};

export const offMessageSocketEvents = () => {
  if (socket) {
    socket.off('reaction-added');
    socket.off('reaction-removed');
    socket.off('message-updated');
    socket.off('message-deleted');
  }
};
