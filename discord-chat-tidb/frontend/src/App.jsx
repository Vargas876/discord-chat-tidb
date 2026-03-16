import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { ChatProvider } from './context/ChatContext';
import { initSocket, disconnectSocket } from './services/socket';

/**
 * Componente principal de la aplicación
 * 
 * Estructura:
 * - Sidebar: Lista de conversaciones
 * - ChatWindow: Área de mensajes activa
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicializar conexión WebSocket (No bloqueante)
    const setupSocket = async () => {
      try {
        // No bloqueamos el renderizado de la app por el socket
        initSocket().then(() => {
          console.log('✅ Conexión WebSocket establecida');
        }).catch(err => {
          console.warn('⚠️ WebSocket no disponible inicialmente:', err.message);
          // No seteamos error global para permitir que la app funcione vía HTTP
        });
      } catch (err) {
        console.error('❌ Error fatal en setupSocket:', err);
      } finally {
        // La app se considera cargada independientemente del socket
        setIsLoading(false);
      }
    };

    setupSocket();

    // Cleanup al desmontar
    return () => {
      disconnectSocket();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-discord-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-brand-primary mb-4">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-discord-300">Conectando al servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-discord-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-danger text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Error de conexión</h2>
          <p className="text-discord-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="h-screen w-full bg-discord-900 flex overflow-hidden">
        {/* Sidebar con lista de conversaciones */}
        <Sidebar />
        
        {/* Área principal de chat */}
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}

export default App;
