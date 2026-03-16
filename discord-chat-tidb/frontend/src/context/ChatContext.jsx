/**
 * Contexto global de Chat
 * 
 * Maneja el estado compartido entre componentes:
 * - Usuario actual
 * - Conversación seleccionada
 * - Lista de conversaciones
 * - Lista de usuarios
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, conversationService } from '../services/api';

// Crear contexto
const ChatContext = createContext();

// Hook personalizado para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};

// Provider del contexto
export const ChatProvider = ({ children }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState({
    users: true,
    conversations: true,
  });
  const [errors, setErrors] = useState({
    users: null,
    conversations: null,
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, users: true }));
        const response = await userService.getAll();
        
        if (response.success) {
          setUsers(response.data);
          // Seleccionar primer usuario como currentUser
          if (response.data.length > 0) {
            setCurrentUser(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        setErrors((prev) => ({ ...prev, users: 'Error al cargar usuarios' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, users: false }));
      }
    };

    loadUsers();
  }, []);

  // Cargar conversaciones al iniciar
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, conversations: true }));
        const response = await conversationService.getAll();
        
        if (response.success) {
          setConversations(response.data);
          // Seleccionar primera conversación
          if (response.data.length > 0) {
            setSelectedConversation(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error cargando conversaciones:', error);
        setErrors((prev) => ({ ...prev, conversations: 'Error al cargar conversaciones' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, conversations: false }));
      }
    };

    loadConversations();
  }, []);

  // Cambiar usuario actual
  const switchUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Agregar una nueva conversación a la lista
  const addConversation = (conversation) => {
    setConversations((prev) => [conversation, ...prev]);
    setSelectedConversation(conversation);
  };

  // Actualizar contador de mensajes de una conversación
  const updateConversationMessageCount = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, message_count: (conv.message_count || 0) + 1 }
          : conv
      )
    );
  };

  // Valor del contexto
  const value = {
    currentUser,
    users,
    conversations,
    selectedConversation,
    isLoading,
    errors,
    setSelectedConversation,
    switchUser,
    addConversation,
    updateConversationMessageCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
