import React from 'react';

const CategoriaList = ({ categorias, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Listado de Categorías</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {categorias.map(categoria => (
          <li key={categoria.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{categoria.nombre}</h3>
              <p className="text-sm text-gray-600">{categoria.descripcion || 'Sin descripción'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onEdit(categoria)} 
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => onDelete(categoria.id)} 
                className="text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {categorias.length === 0 && (
        <p className="p-4 text-center text-gray-500">No hay categorías para mostrar.</p>
      )}
    </div>
  );
};

export default CategoriaList;