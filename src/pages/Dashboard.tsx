import React from 'react';
import { NavLink } from 'react-router-dom';

// Este archivo queda vacío porque los accesos directos se moverán al sidebar
const Dashboard: React.FC = () => {
  const items = [
    { to: '/ventas', label: 'Ventas', icon: '💰' },
    { to: '/clientes', label: 'Clientes', icon: '👥' },
    { to: '/inventario', label: 'Inventario', icon: '📦' }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center p-6 bg-blue-300 rounded-lg shadow hover:bg-gray-100 transition"
          >
            <span className="text-4xl mb-2">{icon}</span>
            <span className="text-xl font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
