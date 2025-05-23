import React from "react";
import CompraTable from "../components/CompraTable";

const Compras: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Compras</h1>
    <CompraTable />
  </div>
);

export default Compras;
