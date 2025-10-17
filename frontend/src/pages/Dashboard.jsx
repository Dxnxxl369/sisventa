import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ejemplo de tarjetas de estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Ventas Hoy</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">$1,250</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Clientes Nuevos</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Productos Bajos de Stock</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total de Ingresos</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">$48,600</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;