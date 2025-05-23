import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Productos }from "./pages/Productos";
import  Usuarios  from "./pages/Usuarios";
import {Layout} from "./components/Layout";
import Productos from "./pages/Productos";
import Inventario from "./pages/Inventario";
import Compras from "./pages/Compras";
import NuevaCompra from "./pages/NuevaCompra";


const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/inventario" element={<Inventario />}></Route>
        <Route path="/compras" element={<Compras />} />
        <Route path="/compras/nueva" element={<NuevaCompra />} />

        {/* Más rutas aquí */}
      </Routes>
    </Layout>
  </Router>
);

export default App;
