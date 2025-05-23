import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

export const Layout: React.FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
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
          <span className="text-2xl font-bold tracking-wide">Papelón</span>
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
        <div className="mt-auto mb-4 text-xs text-blue-200 text-center opacity-60">
          © {new Date().getFullYear()} Papelón
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 bg-base-100 overflow-auto text-center">
        <Outlet />
      </main>
    </div>
  );
};
