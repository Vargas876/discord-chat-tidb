import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { ChatProvider } from './context/ChatContext';
import { initSocket, disconnectSocket } from './services/socket';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Componente principal de la aplicación
 * 
 * Estructura:
 */
function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicializar conexión WebSocket
    const setupSocket = async () => {
      try {
        initSocket().then(() => {
          console.log('✅ Conexión WebSocket establecida');
        }).catch(err => {
          console.warn('⚠️ WebSocket no disponible inicialmente:', err.message);
        });
      } catch (err) {
        console.error('❌ Error fatal en setupSocket:', err);
      } finally {
        setIsLoading(false);
      }
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  if (isLoading || authLoading) {
    return (
      <div className="h-screen w-full bg-discord-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-brand-primary mb-4">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-discord-300">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar página de Auth
  if (!user) {
    return <AuthPage />;
  }

  return (
    <ChatProvider>
      <div className="h-screen w-full bg-discord-900 flex overflow-hidden">
        <Sidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
