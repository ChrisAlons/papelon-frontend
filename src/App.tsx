import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Productos }from "./pages/Productos";
import  Usuarios  from "./pages/Usuarios";
import {Layout} from "./components/Layout";
import Productos from "./pages/Productos";


const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />
        {/* <Route path="/productos" element={<Productos />} /> */}
        <Route path="/usuarios" element={<Usuarios />} />
				<Route path="/productos" element={<Productos />} />
				
        {/* Más rutas aquí */}
      </Routes>
    </Layout>
  </Router>
);

export default App;
