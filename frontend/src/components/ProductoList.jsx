import React from 'react';

const ProductoList = ({ productos, onEdit, onDelete }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map(producto => (
        <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
          <div className="relative">
            <img src={producto.imagen_url || 'https://via.placeholder.com/400x300'} alt={producto.nombre} className="w-full h-56 object-cover"/>
            <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => onEdit(producto)} className="p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 text-blue-600 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
              </button>
              <button onClick={() => onDelete(producto.id)} className="p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 text-red-600 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 truncate">{producto.nombre}</h3>
            <p className="text-gray-600 text-sm mt-1 flex-grow">{producto.descripcion || 'Sin descripción'}</p>
            <div class="mt-4 flex items-center justify-between">
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {producto.categoria?.nombre || 'Sin Categoría'}
                </span>
                <span class="text-xs font-mono text-gray-500">
                    SKU: {producto.sku || 'N/A'}
                </span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-2xl font-black text-gray-900">${parseFloat(producto.precio).toFixed(2)}</p>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${producto.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Stock: {producto.stock}
              </span>
            </div>
          </div>
        </div>
      ))}
      {productos.length === 0 && (
        <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos para mostrar.</p>
        </div>
      )}
    </div>
  );
}

export default ProductoList;