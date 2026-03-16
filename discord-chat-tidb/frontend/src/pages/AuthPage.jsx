import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) setError(result.error);
    } else {
      const result = await register({ name, email, password });
      if (result.success) {
        // Auto login after register
        const loginResult = await login(email, password);
        if (!loginResult.success) setError(loginResult.error);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-discord-800 flex items-center justify-center p-4">
      <div className="bg-discord-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-discord-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? '¡Hola de nuevo!' : 'Crear una cuenta'}
          </h1>
          <p className="text-discord-300">
            {isLogin ? '¡Te extrañamos!' : 'Únete a la mejor comunidad'}
          </p>
        </div>

        {error && (
          <div className="bg-danger/20 border border-danger text-danger p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-discord-300 text-xs font-bold uppercase mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-discord-1000 border-none text-white p-3 rounded focus:ring-2 focus:ring-brand-primary outline-none"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-discord-300 text-xs font-bold uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-discord-1000 border-none text-white p-3 rounded focus:ring-2 focus:ring-brand-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-discord-300 text-xs font-bold uppercase mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-discord-1000 border-none text-white p-3 rounded focus:ring-2 focus:ring-brand-primary outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-hover text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-discord-400 text-sm">
          {isLogin ? '¿Necesitas una cuenta?' : '¿Ya tienes una cuenta?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-primary hover:underline ml-1"
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
