import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, conversationService } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  
  // Estados
  const [currentUser, setCurrentUser] = useState(authUser);
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

  // Sincronizar currentUser con authUser
  useEffect(() => {
    setCurrentUser(authUser);
  }, [authUser]);

  // Cargar usuarios al iniciar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, users: true }));
        const response = await userService.getAll();
        if (response.success) {
          setUsers(response.data);
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
          // Seleccionar primera conversación si no hay una seleccionada
          if (response.data.length > 0 && !selectedConversation) {
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

  // Cambiar usuario actual (solo para simulación/demo, aunque ahora es real)
  const switchUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const addConversation = (conversation) => {
    setConversations((prev) => [conversation, ...prev]);
    setSelectedConversation(conversation);
  };

  const updateConversationMessageCount = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, message_count: (conv.message_count || 0) + 1 }
          : conv
      )
    );
  };

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
