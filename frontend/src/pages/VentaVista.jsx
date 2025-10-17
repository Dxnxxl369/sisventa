import React from 'react';
import { Link } from 'react-router-dom';
import VentaList from '../components/VentaList';

const VentaVista = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
        <Link
          to="/ventas/nueva"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Nueva Venta
        </Link>
      </div>
      <p className="mb-6 text-gray-600">
        Aquí puedes ver y gestionar todas las ventas registradas en el sistema.
      </p>
      <VentaList />
    </div>
  );
};

export default VentaVista;