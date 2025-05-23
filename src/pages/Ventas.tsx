// src/pages/Ventas.tsx
import React from 'react';
import VentaTable from '../components/VentaTable.tsx';

const Ventas: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Ventas</h1>
    <VentaTable />
  </div>
);

export default Ventas;

