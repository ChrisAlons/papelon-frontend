// src/App.tsx
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { UsuariosList } from './pages/UsuariosList';
import {Sidebar} from "./components/Sidebar";
import "./App.css";
// luego importaremos ClienteList, ProductoList, etc.

export const App: React.FC = () => (
  <BrowserRouter>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-blue-50 min-h-screen">
        {/* opcional Header */}
        <header className="bg-white shadow-md px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard Papelon</h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/usuarios" replace />} />
            <Route path="/usuarios" element={<UsuariosList />} />
            {/* <Route path="/clientes"  element={<ClientesList  />} /> */}
            {/* <Route path="/productos" element={<ProductosList />} /> */}
            {/* <Route path="/compras"   element={<ComprasList   />} /> */}
            {/* <Route path="/ventas"    element={<VentasList    />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  </BrowserRouter>
);
