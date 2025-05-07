// src/pages/UsuariosList.tsx
import React, { useEffect, useState } from 'react';
import { fetchUsuarios } from '../api/usuarioService';
import type {Usuario} from '../types/Usuario';

export const UsuariosList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    fetchUsuarios().then(setUsuarios);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      {/*<header className="bg-blue-600 text-white shadow-md">*/}
      {/*  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">*/}
      {/*    <h1 className="text-2xl font-semibold">Papelon Dashboard</h1>*/}
      {/*  </div>*/}
      {/*</header>*/}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Card container */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-500 px-6 py-4">
            <h2 className="text-lg font-medium text-white">Usuarios Registrados</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-blue-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-blue-700">Usuario</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-blue-700">Rol</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-blue-700">Creado</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{u.rol}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
