import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Hash, Users } from 'lucide-react';

/**
 * ChatWindow - Ventana principal de chat
 * 
 * Muestra:
 * - Header con información de la conversación
 * - Lista de mensajes
 * - Input para enviar mensajes
 */
const ChatWindow = () => {
  const { selectedConversation, currentUser } = useChat();
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje - Memoizado para estabilidad
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.id]);

  // Si no hay conversación seleccionada
  if (!selectedConversation) {
    return (
      <main className="flex-1 bg-discord-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-discord-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash size={48} className="text-discord-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenido a Chat TiDB
          </h2>
          <p className="text-discord-400 max-w-md">
            Selecciona un canal del menú lateral para comenzar a chatear
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-discord-700 flex flex-col min-w-0">
      {/* Header */}
      <header className="h-14 px-4 border-b border-discord-900 flex items-center gap-4 flex-shrink-0">
        <Hash size={24} className="text-discord-400" />
        <h2 className="font-bold text-white truncate">
          {selectedConversation.title}
        </h2>
        <div className="h-6 w-px bg-discord-600 mx-2"></div>
        <p className="text-discord-400 text-sm truncate">
          Este es el inicio del canal{' '}
          <span className="text-discord-300">
            {selectedConversation.title}
          </span>
        </p>
        
        <div className="flex-1"></div>
        
        {/* Indicador de usuarios */}
        <div className="flex items-center gap-2 text-discord-400">
          <Users size={20} />
          <span className="text-sm">3</span>
        </div>
      </header>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto">
        {/* Mensaje de bienvenida del canal */}
        <div className="px-4 py-6">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-16 h-16 bg-discord-800 rounded-full flex items-center justify-center flex-shrink-0">
              <Hash size={32} className="text-discord-500" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">
                ¡Bienvenido a {selectedConversation.title}!
              </h3>
            </div>
          </div>
          <p className="text-discord-400 text-sm ml-20">
            Este es el inicio del canal{' '}
            <span className="text-discord-300">
              {selectedConversation.title}
            </span>
            {'. '}
            {selectedConversation.created_at && (
              <>
                Creado el{' '}
                {new Date(selectedConversation.created_at).toLocaleDateString(
                  'es-ES',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </>
            )}
          </p>
          <div className="mt-4 ml-20 h-px bg-discord-600"></div>
        </div>

        {/* Componente de mensajes */}
        <MessageBubble
          conversationId={selectedConversation.id}
          currentUser={currentUser}
          onMessageAdded={scrollToBottom}
        />
        
        {/* Referencia para scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensajes */}
      <MessageInput
        conversationId={selectedConversation.id}
        currentUser={currentUser}
      />
    </main>
  );
};

export default ChatWindow;
