import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoriaVista from './pages/CategoriaVista';
import ProductoVista from './pages/ProductoVista';
import ClienteVista from './pages/ClienteVista';
import UsuarioVista from './pages/UsuarioVista';
import VentaVista from './pages/VentaVista';
import VentaForm from './pages/VentaForm';
import ReportesVista from './pages/ReportesVista';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

/*const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="categorias" element={<CategoriaVista />} />
          <Route path="productos" element={<ProductoVista />} />
          <Route path="clientes" element={<ClienteVista />} />
          <Route path="usuarios" element={<UsuarioVista />} />
          <Route path="ventas" element={<VentaVista />} />
          <Route path="ventas/nueva" element={<VentaForm />} />
          <Route path="reportes" element={<ReportesVista />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
*/

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider> {/* <-- 2. ENVOLVER */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="categorias" element={<CategoriaVista />} />
              <Route path="productos" element={<ProductoVista />} />
              <Route path="clientes" element={<ClienteVista />} />
              <Route path="usuarios" element={<UsuarioVista />} />
              <Route path="ventas" element={<VentaVista />} />
              <Route path="ventas/nueva" element={<VentaForm />} />
              <Route path="reportes" element={<ReportesVista />} />
            </Route>
          </Routes>        
        </DataProvider> {/* <-- 2. CERRAR ENVOLTURA */}
      </AuthProvider>
    </Router>  
  );
}

export default App;