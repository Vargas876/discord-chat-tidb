import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Sparkles, Rocket } from 'lucide-react';

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
        const loginResult = await login(email, password);
        if (!loginResult.success) setError(loginResult.error);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full cosmic-void flex items-center justify-center p-4 relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-discord-secondary/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="glass-panel p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative z-10 animate-fadeIn overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-primary/30 rounded-full blur-2xl"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-primary/20 rounded-xl mb-4 border border-brand-primary/30">
            <Shield className="text-brand-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            {isLogin ? 'Acceso Seguro' : 'Crear Identidad'}
          </h1>
          <p className="text-discord-300 text-sm">
            {isLogin ? 'Bienvenido a la red descentralizada' : 'Únete a la nueva era de comunicación'}
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/50 text-danger p-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-bounce">
            <span className="w-1.5 h-1.5 bg-danger rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-discord-300 text-[10px] uppercase tracking-widest font-bold ml-1">
                <User size={12} /> Nombre de Usuario
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white p-3 pl-4 rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/50 outline-none transition-all duration-300 group-hover:bg-white/10"
                  required
                  placeholder="Neo"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-discord-300 text-[10px] uppercase tracking-widest font-bold ml-1">
              <Mail size={12} /> Email de Seguridad
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-3 pl-4 rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/50 outline-none transition-all duration-300 hover:bg-white/10"
              required
              placeholder="user@matrix.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-discord-300 text-[10px] uppercase tracking-widest font-bold ml-1">
              <Lock size={12} /> Código de Acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-3 pl-4 rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/50 outline-none transition-all duration-300 hover:bg-white/10"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? <Rocket size={18} /> : <Sparkles size={18} />}
                <span>{isLogin ? 'Autenticar' : 'Fijar Destino'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-discord-400 text-xs tracking-wide">
            {isLogin ? '¿Aún no eres parte de la red?' : '¿Ya tienes credenciales?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-primary hover:text-white font-bold ml-2 transition-colors uppercase text-[10px] tracking-widest"
            >
              {isLogin ? 'Registrar Nodo' : 'Iniciar Protocolo'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
