// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => (
  <aside className="w-64 h-screen bg-blue-800 text-white flex flex-col">
    <div className="h-16 flex items-center justify-center border-b border-blue-700">
      <span className="text-2xl font-bold">Papelon</span>
    </div>
    <nav className="flex-1 mt-4 px-2">
      {[
        { to: '/usuarios', label: 'Usuarios' },
        { to: '/clientes',  label: 'Clientes' },
        { to: '/productos', label: 'Productos' },
        { to: '/compras',   label: 'Compras' },
        { to: '/ventas',    label: 'Ventas' },
      ].map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `block mb-2 px-4 py-2 rounded-lg transition-colors 
             ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-700 text-blue-200'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
