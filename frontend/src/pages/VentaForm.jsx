import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext'; // 1. Usar el contexto de datos
import { useAuth } from '../context/AuthContext';   // 2. Usar el contexto de autenticación para obtener el vendedor
import api from '../services/api';                   // 3. Usar el servicio de API para crear la venta

const VentaForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario logueado (vendedor)
  const { clientes, fetchClientes, productos, fetchProductos } = useData(); // Obtener datos y funciones del contexto

  // --- Tus estados existentes ---
  const [clienteId, setClienteId] = useState(''); // Cambiado a clienteId para claridad
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [productoBusqueda, setProductoBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  
  // --- Nuevos estados para manejo de carga y errores ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Cargar clientes y productos desde la API cuando el componente se monta
  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, [fetchClientes, fetchProductos]);

  // --- Tus useEffects existentes (modificados para usar datos reales) ---
  useEffect(() => {
    const newTotal = detalles.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);
    setTotal(newTotal);
  }, [detalles]);

  useEffect(() => {
    if (productoBusqueda) {
      setProductosFiltrados(
        productos.filter(p =>
          p.nombre.toLowerCase().includes(productoBusqueda.toLowerCase()) && p.stock > 0
        )
      );
    } else {
      setProductosFiltrados([]);
    }
  }, [productoBusqueda, productos]); // Ahora depende de 'productos' del contexto


  // --- Tus funciones de manejo (con pequeños ajustes) ---
  const handleAddProducto = (producto) => {
    setProductoBusqueda('');
    const existingIndex = detalles.findIndex(item => item.producto === producto.id);

    if (existingIndex > -1) {
      const updatedDetalles = [...detalles];
      const item = updatedDetalles[existingIndex];
      // No permitir agregar más del stock disponible
      if (item.cantidad < producto.stock) {
        item.cantidad += 1;
        setDetalles(updatedDetalles);
      } else {
        alert(`No puedes agregar más de ${producto.stock} unidades de ${producto.nombre}.`);
      }
    } else {
      setDetalles([
        ...detalles,
        // Adaptado a la estructura que espera el VentaWriteSerializer
        { producto: producto.id, nombre: producto.nombre, cantidad: 1, precio_unitario: parseFloat(producto.precio), stock_disponible: producto.stock },
      ]);
    }
  };

  const handleRemoveProducto = (producto_id) => {
    setDetalles(detalles.filter(item => item.producto !== producto_id));
  };

  const handleCantidadChange = (producto_id, cantidad) => {
    const updatedDetalles = detalles.map(item => {
      if (item.producto === producto_id) {
        // Validar que la cantidad no exceda el stock
        const newCantidad = Math.min(item.stock_disponible, Math.max(1, cantidad));
        return { ...item, cantidad: newCantidad };
      }
      return item;
    });
    setDetalles(updatedDetalles);
  };

  // --- Función de envío a la API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construir el payload para el VentaWriteSerializer del backend
    const payload = {
      cliente: clienteId,
      vendedor: user.id, // ID del usuario logueado
      total: total,
      detalles: detalles.map(({ producto, cantidad, precio_unitario }) => ({
        producto: producto,
        cantidad: cantidad,
        precio_unitario: precio_unitario,
      })),
    };

    try {
      await api.createVenta(payload);
      alert('Venta registrada con éxito!');
      fetchProductos(); // Actualizar el stock global de productos
      navigate('/ventas'); // Redirigir a la lista de ventas
    } catch (err) {
      setError('Error al registrar la venta. Verifique los datos e intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================================
  // === TU JSX (RETURN) COMPLETO Y ACTUALIZADO ===
  // ===================================================================
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Nueva Venta</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
        
        {/* Sección de errores */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

        {/* Selección de Cliente (Ahora usa datos del contexto) */}
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <select
            id="cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Seleccione un cliente</option>
            {/* Mapea sobre los clientes cargados desde la API */}
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
        </div>

        {/* Búsqueda y adición de Productos */}
        <div className="relative">
          <label htmlFor="search-producto" className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto (Stock &gt 0)</label>
          <input
            type="text"
            id="search-producto"
            value={productoBusqueda}
            onChange={(e) => setProductoBusqueda(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            placeholder='Escriba para buscar...'
          />
          {productosFiltrados.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
              {productosFiltrados.map(p => (
                <li
                  key={p.id}
                  onClick={() => handleAddProducto(p)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                >
                  <span>{p.nombre} (${p.precio})</span>
                  <span className="text-sm text-gray-500">Stock: {p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detalles de la Venta */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos en la Venta</h2>
          <div className="space-y-4">
            {detalles.length === 0 ? (
                <p className="text-gray-500">Aún no se han agregado productos.</p>
            ) : (
                detalles.map(item => (
                <div key={item.producto} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{item.nombre}</span>
                    <div className="flex items-center gap-4">
                    <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleCantidadChange(item.producto, parseInt(e.target.value))}
                        className="w-20 text-center border-gray-300 rounded-md shadow-sm"
                        min="1"
                        max={item.stock_disponible} // El máximo es el stock disponible
                    />
                    <span>${(item.cantidad * item.precio_unitario).toFixed(2)}</span>
                    <button type="button" onClick={() => handleRemoveProducto(item.producto)} className="text-red-500 hover:text-red-700 font-bold">X</button>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Total y Botón de Envío */}
        <div className="flex justify-end items-center pt-6 border-t">
            <span className="text-2xl font-bold text-gray-800 mr-4">Total: ${total.toFixed(2)}</span>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!clienteId || detalles.length === 0 || loading}
            >
              {loading ? 'Registrando...' : 'Registrar Venta'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default VentaForm;