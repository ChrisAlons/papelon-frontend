// src/pages/Proveedores.tsx
import React from 'react';
import ProveedorTable from '../components/ProveedorTable.tsx';

const Proveedores: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Proveedores</h1>
    <ProveedorTable />
  </div>
);

export default Proveedores;
