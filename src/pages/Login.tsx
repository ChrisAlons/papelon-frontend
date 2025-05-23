// src/pages/Login.tsx
import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const login = useUserStore(state => state.login);
  const currentUser = useUserStore(state => state.currentUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setError(null);
      if (currentUser?.rol === 'CAJERO') {
        navigate('/ventas');
      } else {
        navigate('/productos');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <img src="/src/assets/hatsune-miku.webp" alt="Background" className="absolute inset-0 w-full h-full object-contain" />
      {/* Overlay for form */}
      <div className="relative flex items-center justify-center h-full">
        <div className="w-full max-w-sm p-6 bg-white/30 backdrop-blur-xs rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Usuario</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Contraseña</label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-full">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

