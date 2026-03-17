import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, Hash, Users, ChevronDown, LogOut } from 'lucide-react';
import { conversationService } from '../services/api';

/**
 * Sidebar - Barra lateral izquierda
 * 
 * Muestra:
 * - Lista de conversaciones/canales
 * - Botón para crear nueva conversación
 * - Perfil de usuario y Logout
 */
const Sidebar = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    addConversation,
    isLoading,
  } = useChat();

  const { user: currentUser, logout } = useAuth();
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Crear nueva conversación
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      setIsCreating(true);
      const response = await conversationService.create(newChannelName.trim());
      
      if (response.success) {
        addConversation(response.data);
        setNewChannelName('');
        setShowNewChannelModal(false);
      }
    } catch (error) {
      console.error('Error creando canal:', error);
      alert('Error al crear el canal');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-64 bg-discord-900 flex flex-col flex-shrink-0">
      {/* Header del servidor */}
      <div className="h-14 px-4 bg-discord-900 border-b border-discord-950 flex items-center justify-between hover:bg-discord-800 cursor-pointer transition-colors">
        <h1 className="font-bold text-white truncate">💬 Chat TiDB</h1>
        <ChevronDown size={20} className="text-discord-400" />
      </div>

      {/* Separador */}
      <div className="px-4 mb-2">
        <div className="h-px bg-discord-700"></div>
      </div>

      {/* Header de canales */}
      <div className="px-4 mb-2 flex items-center justify-between group">
        <span className="text-xs font-semibold text-discord-400 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-discord-300">
          Canales de texto
          <ChevronDown size={12} />
        </span>
        <button
          onClick={() => setShowNewChannelModal(true)}
          className="text-discord-400 hover:text-discord-300 opacity-0 group-hover:opacity-100 transition-all"
          title="Crear canal"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {isLoading.conversations ? (
          <div className="p-4 text-discord-400 text-sm text-center">
            <div className="loading-dots justify-center mb-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
            Cargando canales...
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-all group ${
                selectedConversation?.id === conversation.id
                  ? 'bg-discord-700 text-white'
                  : 'text-discord-400 hover:bg-discord-800 hover:text-discord-200'
              }`}
            >
              <Hash
                size={20}
                className={`flex-shrink-0 ${
                  selectedConversation?.id === conversation.id
                    ? 'text-discord-200'
                    : 'text-discord-500 group-hover:text-discord-400'
                }`}
              />
              <span className="truncate flex-1 text-sm font-medium">
                {conversation.title}
              </span>
              {conversation.message_count > 0 && (
                <span className="text-xs text-discord-500">
                  {conversation.message_count}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer con info del usuario actual */}
      {currentUser && (
        <div className="p-3 bg-discord-950 flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-discord-950 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-success rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {currentUser.name}
              </p>
              <p className="text-discord-400 text-xs truncate">En línea</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="p-2 text-discord-400 hover:text-red-400 hover:bg-discord-800 rounded-md transition-all flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}

      {/* Modal para nuevo canal */}
      {showNewChannelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-discord-800 rounded-lg w-full max-w-md p-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-1">Crear canal</h2>
            <p className="text-discord-400 text-sm mb-4">
              ¿En qué se enfocará este canal?
            </p>
            
            <form onSubmit={handleCreateChannel}>
              <label className="block text-xs font-semibold text-discord-300 uppercase mb-2">
                Nombre del canal
              </label>
              <div className="relative mb-4">
                <Hash
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-discord-400"
                />
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="nuevo-canal"
                  className="w-full bg-discord-900 text-white pl-10 pr-4 py-2.5 rounded-md border border-discord-700 focus:border-brand-primary focus:outline-none placeholder-discord-500"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewChannelModal(false);
                    setNewChannelName('');
                  }}
                  className="px-4 py-2 text-white hover:underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newChannelName.trim() || isCreating}
                  className="px-6 py-2 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  {isCreating ? 'Creando...' : 'Crear canal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
