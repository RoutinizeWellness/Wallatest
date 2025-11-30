import React, { useState } from 'react';
import { api } from '../services/mockBackend';
import { Neighborhood } from '../types';
import { Logo } from '../components/Logo';

interface AuthProps {
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>(Neighborhood.CENTRE);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock login - any password works for now if email exists in mock
      // If email doesn't exist, we'll just log them in as a new mock user for MVP simplicity
      // or check strictly against mockBackend
      const user = await api.login(email);
      
      if (user) {
        onSuccess();
      } else {
        setError('Usuario no encontrado. ¿Quieres registrarte?');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        throw new Error('Rellena todos los campos');
      }
      await api.register(name, email, neighborhood);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6 animate-fade-in">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a TerrassaMarket</h1>
          <p className="text-gray-500">Compra y vende en tu barrio con seguridad.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              mode === 'login' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              mode === 'register' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            
            {mode === 'register' && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Marc Torres"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tu Barrio</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                  >
                    {Object.values(Neighborhood).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">Esencial para encontrar tratos cerca de ti.</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all mt-6"
            >
              {loading ? 'Cargando...' : (mode === 'login' ? 'Entrar' : 'Registrarse')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400">O continúa con</span>
              </div>
            </div>

            <button className="mt-4 w-full border border-gray-200 bg-white text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
        
        {mode === 'login' ? (
           <p className="text-center mt-6 text-sm text-gray-500">
             ¿Aún no tienes cuenta? <button onClick={() => setMode('register')} className="text-emerald-600 font-bold hover:underline">Regístrate</button>
           </p>
        ) : (
           <p className="text-center mt-6 text-sm text-gray-500">
             ¿Ya eres miembro? <button onClick={() => setMode('login')} className="text-emerald-600 font-bold hover:underline">Inicia Sesión</button>
           </p>
        )}
      </div>
    </div>
  );
};