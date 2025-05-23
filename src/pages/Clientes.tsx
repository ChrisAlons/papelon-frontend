// src/pages/Clientes.tsx
import React from 'react';
import ClienteTable from '../components/ClienteTable.tsx';

const Clientes: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
    <ClienteTable />
  </div>
);

export default Clientes;
