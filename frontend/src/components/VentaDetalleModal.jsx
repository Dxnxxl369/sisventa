import React from 'react';

const VentaDetalleModal = ({ venta, onClose }) => {
  if (!venta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 m-4 max-w-2xl w-full transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Detalle de Venta #{venta.id}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold text-gray-700">Cliente:</p>
            <p className="text-gray-600">{venta.cliente}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Vendido por:</p>
            <p className="text-gray-600">{venta.usuario}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Fecha:</p>
            <p className="text-gray-600">{new Date(venta.fecha).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Total:</p>
            <p className="text-green-600 font-bold text-lg">${venta.total}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-800">Productos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((detalle, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{detalle.producto}</td>
                  <td className="px-4 py-2 text-gray-700">{detalle.cantidad}</td>
                  <td className="px-4 py-2 text-gray-700">${detalle.precio_unitario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;