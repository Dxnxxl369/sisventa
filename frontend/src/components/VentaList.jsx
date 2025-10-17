import React, { useState } from 'react';
import VentaDetalleModal from './VentaDetalleModal';

// Datos de ejemplo
const sampleVentas = [
  {
    id: 1,
    cliente: 'Juan Perez',
    usuario: 'admin',
    fecha: '2025-10-15T10:30:00Z',
    total: '150.50',
    detalles: [
      { producto: 'Laptop HP', cantidad: 1, precio_unitario: '120.00' },
      { producto: 'Mouse Logitech', cantidad: 1, precio_unitario: '30.50' },
    ],
  },
  {
    id: 2,
    cliente: 'Ana Gomez',
    usuario: 'vendedor1',
    fecha: '2025-10-15T11:45:00Z',
    total: '85.00',
    detalles: [{ producto: 'Teclado Mecánico', cantidad: 1, precio_unitario: '85.00' }],
  },
];

const VentaList = () => {
  const [selectedVenta, setSelectedVenta] = useState(null);

  const handleViewDetails = (venta) => {
    setSelectedVenta(venta);
  };

  const handleCloseModal = () => {
    setSelectedVenta(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              ID Venta
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Total
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleVentas.map((venta) => (
            <tr key={venta.id} className="hover:bg-gray-100">
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {venta.id}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {venta.cliente}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {venta.usuario}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {new Date(venta.fecha).toLocaleString()}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                ${venta.total}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <button
                  onClick={() => handleViewDetails(venta)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVenta && (
        <VentaDetalleModal venta={selectedVenta} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default VentaList;