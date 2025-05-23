import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

export const Layout: React.FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
  const logout = useUserStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { to: '/usuarios', label: 'Usuarios', roles: ['ADMIN'] },
    { to: '/clientes', label: 'Clientes', roles: ['ADMIN', 'CAJERO'] },
    { to: '/productos', label: 'Productos', roles: ['ADMIN'] },
    { to: '/inventario', label: 'Inventario', roles: ['ADMIN', 'CAJERO'] },
    { to: '/proveedores', label: 'Proveedores', roles: ['ADMIN'] },
    { to: '/compras', label: 'Compras', roles: ['ADMIN'] },
    { to: '/ventas', label: 'Ventas', roles: ['ADMIN', 'CAJERO'] }
  ];
  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-lg">
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
          <span
            className="text-2xl font-bold tracking-wide cursor-pointer hover:text-blue-300 transition"
            onClick={() => navigate('/dashboard')}
          >
            Papelón
          </span>
        </div>

        <nav className="flex-1 mt-4 px-3">
          {navItems.filter(item => currentUser && item.roles.includes(currentUser.rol)).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block mb-2 px-4 py-2 rounded-lg transition-all font-medium 
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'hover:bg-blue-700 text-blue-100 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn btn-soft btn-secondary text-xl btn-sm mx-4 mb-2"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>
        <div className="mt-auto mb-4 text-xs text-blue-200 text-center opacity-60">
          © {new Date().getFullYear()} Papelón
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 bg-base-100 overflow-auto text-center">
        {/* Mostrar accesos directos solo si NO está en /dashboard */}
        {currentUser?.rol === 'CAJERO' && location.pathname !== '/dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <NavLink to="/ventas" className={({isActive}) => `flex flex-col items-center justify-center p-6 bg-blue-300 rounded-lg shadow hover:bg-gray-100 transition ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <span className="text-4xl mb-2">💰</span>
              <span className="text-xl font-medium">Ventas</span>
            </NavLink>
            <NavLink to="/clientes" className={({isActive}) => `flex flex-col items-center justify-center p-6 bg-blue-300 rounded-lg shadow hover:bg-gray-100 transition ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <span className="text-4xl mb-2">👥</span>
              <span className="text-xl font-medium">Clientes</span>
            </NavLink>
            <NavLink to="/inventario" className={({isActive}) => `flex flex-col items-center justify-center p-6 bg-blue-300 rounded-lg shadow hover:bg-gray-100 transition ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <span className="text-4xl mb-2">📦</span>
              <span className="text-xl font-medium">Inventario</span>
            </NavLink>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};
