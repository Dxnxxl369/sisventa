import React from 'react';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">DNI</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Dirección</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-100">
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{cliente.nombre}</td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{cliente.dni}</td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{cliente.telefono}</td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{cliente.direccion}</td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm space-x-2">
                <button
                  onClick={() => onEdit(cliente)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(cliente.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
