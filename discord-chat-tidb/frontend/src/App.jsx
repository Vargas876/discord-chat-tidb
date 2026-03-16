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
      <div className="h-screen w-full cosmic-void flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-6 mx-auto shadow-[0_0_15px_rgba(88,101,242,0.5)]"></div>
            <p className="text-white font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Sincronizando Nodo...</p>
          </div>
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
