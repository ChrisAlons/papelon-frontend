import React from "react";
import UserTable from "../components/UserTable";

const Usuarios: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
    <UserTable />
  </div>
);

export default Usuarios;
