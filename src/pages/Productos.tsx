import React from "react";
import ProductTable from "../components/ProductTable";

const Productos: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
    <ProductTable />
  </div>
);

export default Productos;


