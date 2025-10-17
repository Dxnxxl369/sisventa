import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo (luego se reemplazarán con llamadas a la API)
const sampleClients = [
  { id: 1, nombre: 'Juan Perez' },
  { id: 2, nombre: 'Ana Gomez' },
];

const sampleProducts = [
  { id: 1, nombre: 'Laptop HP', precio: '120.00', stock: 15 },
  { id: 2, nombre: 'Mouse Logitech', precio: '30.50', stock: 30 },
  { id: 3, nombre: 'Teclado Mecánico', precio: '85.00', stock: 20 },
  { id: 4, nombre: 'Monitor 24 pulgadas', precio: '250.00', stock: 10 },
];

const VentaForm = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [productoBusqueda, setProductoBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    const newTotal = detalles.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);
    setTotal(newTotal);
  }, [detalles]);

  useEffect(() => {
    if (productoBusqueda) {
      setProductosFiltrados(
        sampleProducts.filter(p =>
          p.nombre.toLowerCase().includes(productoBusqueda.toLowerCase())
        )
      );
    } else {
      setProductosFiltrados([]);
    }
  }, [productoBusqueda]);

  const handleAddProducto = (producto) => {
    setProductoBusqueda('');
    const existingIndex = detalles.findIndex(item => item.producto_id === producto.id);

    if (existingIndex > -1) {
      const updatedDetalles = [...detalles];
      updatedDetalles[existingIndex].cantidad += 1;
      setDetalles(updatedDetalles);
    } else {
      setDetalles([
        ...detalles,
        { producto_id: producto.id, nombre: producto.nombre, cantidad: 1, precio_unitario: parseFloat(producto.precio) },
      ]);
    }
  };

  const handleRemoveProducto = (producto_id) => {
    setDetalles(detalles.filter(item => item.producto_id !== producto_id));
  };

  const handleCantidadChange = (producto_id, cantidad) => {
    const updatedDetalles = detalles.map(item =>
      item.producto_id === producto_id ? { ...item, cantidad: Math.max(1, cantidad) } : item
    );
    setDetalles(updatedDetalles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se enviaría la información a la API
    console.log({_id: Date.now(),
      cliente,
      detalles,
      total,
    });
    alert('Venta registrada con éxito!');
    navigate('/ventas');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Nueva Venta</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
        
        {/* Selección de Cliente */}
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <select
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Seleccione un cliente</option>
            {sampleClients.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Búsqueda y adición de Productos */}
        <div className="relative">
          <label htmlFor="search-producto" className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
          <input
            type="text"
            id="search-producto"
            value={productoBusqueda}
            onChange={(e) => setProductoBusqueda(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            placeholder='Escriba para buscar...'
          />
          {productosFiltrados.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
              {productosFiltrados.map(p => (
                <li
                  key={p.id}
                  onClick={() => handleAddProducto(p)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {p.nombre} (${p.precio})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detalles de la Venta */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos en la Venta</h2>
          <div className="space-y-4">
            {detalles.map(item => (
              <div key={item.producto_id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{item.nombre}</span>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => handleCantidadChange(item.producto_id, parseInt(e.target.value))}
                    className="w-20 text-center border-gray-300 rounded-md shadow-sm"
                    min="1"
                  />
                  <span>${(item.cantidad * item.precio_unitario).toFixed(2)}</span>
                  <button type="button" onClick={() => handleRemoveProducto(item.producto_id)} className="text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total y Botón de Envío */}
        <div className="flex justify-end items-center pt-6 border-t">
            <span className="text-2xl font-bold text-gray-800 mr-4">Total: ${total.toFixed(2)}</span>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400"
              disabled={!cliente || detalles.length === 0}
            >
              Registrar Venta
            </button>
        </div>
      </form>
    </div>
  );
};

export default VentaForm;