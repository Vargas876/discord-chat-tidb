import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useChat } from '../context/ChatContext';
import { messageService } from '../services/api';
import {
  onNewMessage,
  offNewMessage,
  joinConversation,
  leaveConversation,
} from '../services/socket';

/**
 * MessageBubble - Componente de mensajes
 * 
 * Maneja:
 * - Carga de mensajes históricos
 * - Recepción de mensajes en tiempo real vía WebSocket
 * - Renderizado de burbujas de mensajes
 */
const MessageBubble = ({ conversationId, currentUser, onMessageAdded }) => {
  const { updateConversationMessageCount } = useChat();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar mensajes históricos
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await messageService.getByConversation(conversationId);

      if (response.success) {
        setMessages(response.data);
      } else {
        setError('Error al cargar mensajes');
      }
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      setError('Error al cargar mensajes');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Unirse a la conversación vía WebSocket
  useEffect(() => {
    if (conversationId) {
      joinConversation(conversationId);
      loadMessages();

      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [conversationId, loadMessages]);

  // Escuchar mensajes nuevos en tiempo real
  useEffect(() => {
    const handleNewMessage = (message) => {
      // Solo agregar si pertenece a la conversación actual
      if (message.conversation_id === conversationId) {
        setMessages((prev) => {
          // Evitar duplicados
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Actualizar contador y hacer scroll
        updateConversationMessageCount(conversationId);
        onMessageAdded?.();
      }
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
    };
  }, [conversationId, updateConversationMessageCount, onMessageAdded]);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (msgs) => {
    const groups = {};

    msgs.forEach((msg) => {
      const date = new Date(msg.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  // Formatear hora del mensaje
  const formatMessageTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  // Formatear fecha del separador
  const formatSeparatorDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="loading-dots justify-center text-discord-400">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="text-discord-400 text-sm mt-2">Cargando mensajes...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-danger mb-2">{error}</p>
        <button
          onClick={loadMessages}
          className="text-brand-primary hover:underline text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Sin mensajes
  if (messages.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-discord-400">
          No hay mensajes aún. ¡Sé el primero en escribir!
        </p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="px-0">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Separador de fecha */}
          <div className="flex items-center gap-4 my-4 px-4">
            <div className="flex-1 h-px bg-discord-600"></div>
            <span className="text-xs font-semibold text-discord-400 uppercase">
              {formatSeparatorDate(date)}
            </span>
            <div className="flex-1 h-px bg-discord-600"></div>
          </div>

          {/* Mensajes del día */}
          {dateMessages.map((message, index) => {
            const isOwnMessage = message.sender?.id === currentUser?.id;
            const showAvatar =
              index === 0 ||
              dateMessages[index - 1].sender?.id !== message.sender?.id;

            return (
              <div
                key={message.id}
                className={`px-4 py-1 hover:bg-discord-800/50 transition-colors group ${
                  isOwnMessage ? 'bg-discord-800/20' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10">
                    {showAvatar ? (
                      <img
                        src={
                          message.sender?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            message.sender?.name || 'User'
                          }`
                        }
                        alt={message.sender?.name || 'Usuario'}
                        className="w-10 h-10 rounded-full bg-discord-800"
                      />
                    ) : (
                      <div className="w-10"></div>
                    )}
                  </div>

                  {/* Contenido del mensaje */}
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className={`font-medium ${
                            isOwnMessage
                              ? 'text-brand-light'
                              : 'text-white hover:underline cursor-pointer'
                          }`}
                        >
                          {message.sender?.name || 'Usuario desconocido'}
                        </span>
                        <span className="text-xs text-discord-500">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    )}
                    <p className="text-discord-100 text-sm break-words leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageBubble;
