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
  onReactionAdded,
  onReactionRemoved,
  onMessageUpdated,
  onMessageDeleted,
  addReactionSocket,
  editMessageSocket,
  deleteMessageSocket,
  offMessageSocketEvents
} from '../services/socket';
import { Pencil, Trash2, X, Check } from 'lucide-react';

const MessageBubble = ({ conversationId, currentUser, onMessageAdded }) => {
  const { updateConversationMessageCount } = useChat();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Helper para manejar reacciones
  const handleReaction = (messageId, emoji) => {
    addReactionSocket({
      message_id: messageId,
      user_id: currentUser.id,
      emoji: emoji,
      conversation_id: conversationId
    });
  };

  const handleEdit = (msg) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = () => {
    if (!editContent.trim()) return;
    editMessageSocket({
      message_id: editingId,
      content: editContent,
      conversation_id: conversationId
    });
    setEditingId(null);
  };

  const handleDelete = (messageId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      deleteMessageSocket({
        message_id: messageId,
        conversation_id: conversationId
      });
    }
  };

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

  useEffect(() => {
    if (conversationId) {
      joinConversation(conversationId);
      loadMessages();
      return () => leaveConversation(conversationId);
    }
  }, [conversationId, loadMessages]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversation_id === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        updateConversationMessageCount(conversationId);
        onMessageAdded?.();
      }
    };

    const handleReactionAdd = ({ message_id, reaction }) => {
      setMessages(prev => prev.map(m => {
        if (m.id === message_id) {
          const reactions = m.reactions || [];
          if (reactions.some(r => r.id === reaction.id)) return m;
          return { ...m, reactions: [...reactions, reaction] };
        }
        return m;
      }));
    };

    const handleReactionRemove = ({ message_id, user_id, emoji }) => {
      setMessages(prev => prev.map(m => {
        if (m.id === message_id) {
          return {
            ...m,
            reactions: (m.reactions || []).filter(r => !(r.user_id === user_id && r.emoji === emoji))
          };
        }
        return m;
      }));
    };

    const handleUpdate = (updatedMsg) => {
      setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    };

    const handleDelete = ({ message_id }) => {
      setMessages(prev => prev.filter(m => m.id !== message_id));
    };

    onNewMessage(handleNewMessage);
    onReactionAdded(handleReactionAdd);
    onReactionRemoved(handleReactionRemove);
    onMessageUpdated(handleUpdate);
    onMessageDeleted(handleDelete);

    return () => {
      offNewMessage(handleNewMessage);
      offMessageSocketEvents();
    };
  }, [conversationId, updateConversationMessageCount, onMessageAdded]);

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((msg) => {
      const date = new Date(msg.created_at).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const formatMessageTime = (dateString) => format(new Date(dateString), 'HH:mm', { locale: es });

  const formatSeparatorDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  };

  if (isLoading) return <div className="px-4 py-8 text-center"><div className="loading-dots justify-center text-discord-400"><span></span><span></span><span></span></div></div>;
  if (error) return <div className="px-4 py-8 text-center text-danger">{error}</div>;
  if (messages.length === 0) return <div className="px-4 py-8 text-center text-discord-400">No hay mensajes aún.</div>;

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="px-0">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex items-center gap-4 my-4 px-4">
            <div className="flex-1 h-px bg-discord-600"></div>
            <span className="text-xs font-semibold text-discord-400 uppercase">{formatSeparatorDate(date)}</span>
            <div className="flex-1 h-px bg-discord-600"></div>
          </div>

          {dateMessages.map((message, index) => {
            const isOwnMessage = message.sender?.id === currentUser?.id;
            const showAvatar = index === 0 || dateMessages[index - 1].sender?.id !== message.sender?.id;

            return (
              <div key={message.id} className={`px-4 py-1 hover:bg-discord-800/50 transition-colors group relative ${isOwnMessage ? 'bg-discord-800/10' : ''}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10">
                    {showAvatar ? (
                      <img src={message.sender?.avatar} alt="" className="w-10 h-10 rounded-full bg-discord-800" />
                    ) : (
                      <div className="w-10 text-[10px] text-discord-500 text-center opacity-0 group-hover:opacity-100 mt-1">
                        {formatMessageTime(message.created_at)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-white">{message.sender?.name}</span>
                        <span className="text-xs text-discord-500">{formatMessageTime(message.created_at)}</span>
                      </div>
                    )}
                    
                    {message.type === 'TEXT' ? (
                      editingId === message.id ? (
                        <div className="mt-1">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit();
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            className="w-full bg-discord-900 text-discord-100 p-2 rounded border border-brand-primary focus:outline-none resize-none"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-1 text-[10px]">
                            <span className="text-discord-400">escape para <button onClick={() => setEditingId(null)} className="text-brand-primary hover:underline">cancelar</button></span>
                            <span className="text-discord-400">•</span>
                            <span className="text-discord-400">enter para <button onClick={saveEdit} className="text-brand-primary hover:underline">guardar</button></span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-discord-100 text-sm break-words leading-relaxed">
                          {message.content}
                          {message.updated_at !== message.created_at && (
                            <span className="text-[10px] text-discord-500 ml-1">(editado)</span>
                          )}
                        </p>
                      )
                    ) : (
                      <div className="mt-1">
                        <img src={message.attachment_url} alt="attachment" className="max-w-xs rounded-lg border border-discord-700" />
                      </div>
                    )}

                    {/* Reacciones */}
                    {message.reactions?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(
                          message.reactions.reduce((acc, curr) => {
                            acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs transition-colors ${
                              message.reactions.some(r => r.emoji === emoji && r.user_id === currentUser.id)
                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                                : 'bg-discord-900 border-discord-700 text-discord-300'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones flotantes */}
                <div className="absolute top-0 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-discord-900 border border-discord-700 rounded flex gap-1 p-1 z-10 shadow-xl">
                  <div className="flex border-r border-discord-700 px-1 gap-1">
                    <button onClick={() => handleReaction(message.id, '👍')} className="p-1 hover:bg-discord-700 rounded text-sm">👍</button>
                    <button onClick={() => handleReaction(message.id, '❤️')} className="p-1 hover:bg-discord-700 rounded text-sm">❤️</button>
                    <button onClick={() => handleReaction(message.id, '🔥')} className="p-1 hover:bg-discord-700 rounded text-sm">🔥</button>
                  </div>
                  
                  {isOwnMessage && (
                    <div className="flex px-1 gap-1">
                      <button 
                        onClick={() => handleEdit(message)}
                        className="p-1 text-discord-400 hover:text-white hover:bg-discord-700 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(message.id)}
                        className="p-1 text-discord-400 hover:text-red-400 hover:bg-discord-700 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
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
