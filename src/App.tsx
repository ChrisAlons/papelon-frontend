import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import  Usuarios  from "./pages/Usuarios";
import {Layout} from "./components/Layout";
import Productos from "./pages/Productos";
import Inventario from "./pages/Inventario";
import Compras from "./pages/Compras";
import NuevaCompra from "./pages/NuevaCompra";
import Proveedores from "./pages/Proveedores";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";
import NuevaVenta from "./pages/NuevaVenta";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      {/* Protected */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />} >
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/compras/nueva" element={<NuevaCompra />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/nueva" element={<NuevaVenta />} />
        </Route>
      </Route>
      {/* Fallback: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;
