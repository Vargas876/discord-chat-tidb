import React, { useState, useRef, useEffect } from 'react';
import { Plus, Gift, Sticker, Smile, Send } from 'lucide-react';
import {
  sendMessageSocket,
  emitTyping,
  emitStopTyping,
} from '../services/socket';

/**
 * MessageInput - Componente de entrada de mensajes
 * 
 * Características:
 * - Campo de texto multilinea
 * - Envío con Enter (Shift+Enter para nueva línea)
 * - Botón de enviar
 * - Indicador de "escribiendo..."
 * - Botones decorativos (emoji, gift, etc.)
 */
const MessageInput = ({ conversationId, currentUser }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize del textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Emitir evento de "escribiendo"
    if (currentUser && !isTyping) {
      setIsTyping(true);
      emitTyping(conversationId, currentUser.name);
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Detener "escribiendo" después de 2 segundos de inactividad
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTyping(conversationId, currentUser.name);
    }, 2000);
  };

  // Enviar mensaje
  const handleSend = async () => {
    if (!message.trim() || !currentUser || isSending) return;

    try {
      setIsSending(true);

      // Enviar vía WebSocket
      const success = sendMessageSocket({
        content: message.trim(),
        conversation_id: conversationId,
        sender_id: currentUser.id,
      });

      if (success) {
        setMessage('');
        setIsTyping(false);
        emitStopTyping(conversationId, currentUser.name);

        // Resetear altura del textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } else {
        alert('Error al enviar mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  // Manejar teclas
  const handleKeyDown = (e) => {
    // Enviar con Enter (sin Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Placeholder dinámico según el canal
  const getPlaceholder = () => {
    if (!conversationId) return 'Selecciona un canal para comenzar';
    return `Mensaje #general`;
  };

  if (!conversationId) {
    return (
      <div className="px-4 pb-6">
        <div className="bg-discord-800 rounded-lg p-4 text-center text-discord-400">
          Selecciona un canal para comenzar a chatear
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      <div className="bg-discord-800 rounded-lg">
        {/* Botones superiores */}
        <div className="flex items-center px-4 py-2 gap-2 border-b border-discord-700/50">
          <button
            className="p-2 text-discord-400 hover:text-discord-200 hover:bg-discord-700 rounded-md transition-colors"
            title="Añadir archivo"
          >
            <Plus size={20} />
          </button>
          <div className="w-px h-6 bg-discord-700"></div>
          <button
            className="p-2 text-discord-400 hover:text-discord-200 hover:bg-discord-700 rounded-md transition-colors"
            title="Regalo"
          >
            <Gift size={20} />
          </button>
          <button
            className="p-2 text-discord-400 hover:text-discord-200 hover:bg-discord-700 rounded-md transition-colors"
            title="Sticker"
          >
            <Sticker size={20} />
          </button>
          <button
            className="p-2 text-discord-400 hover:text-discord-200 hover:bg-discord-700 rounded-md transition-colors"
            title="Emoji"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Área de texto */}
        <div className="flex items-end gap-2 px-4 py-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={isSending}
            rows={1}
            className="flex-1 bg-transparent text-discord-100 placeholder-discord-500 resize-none focus:outline-none max-h-48 disabled:opacity-50"
            style={{ minHeight: '24px' }}
          />
          
          {/* Botón enviar */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className={`p-2 rounded-md transition-all ${
              message.trim() && !isSending
                ? 'bg-brand-primary text-white hover:bg-brand-hover'
                : 'text-discord-500 cursor-not-allowed'
            }`}
            title="Enviar mensaje"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Hint de atajos */}
      <div className="mt-2 text-xs text-discord-500 px-1">
        <span className="hidden sm:inline">
          Presiona <kbd className="bg-discord-800 px-1.5 py-0.5 rounded text-discord-400">Enter</kbd> para enviar,{' '}
          <kbd className="bg-discord-800 px-1.5 py-0.5 rounded text-discord-400">Shift + Enter</kbd> para nueva línea
        </span>
      </div>
    </div>
  );
};

export default MessageInput;
