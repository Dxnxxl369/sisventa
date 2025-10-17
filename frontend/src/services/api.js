import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // URL base del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  // --- Autenticación ---
  login: (credentials) => apiClient.post('api-token-auth/', credentials),

  // --- Users ---
  getUsers: () => apiClient.get('/api/users/'),
  getUser: (id) => apiClient.get(`/api/users/${id}/`),
  createUser: (data) => apiClient.post('/api/users/', data),
  updateUser: (id, data) => apiClient.put(`/api/users/${id}/`, data),
  deleteUser: (id) => apiClient.delete(`/api/users/${id}/`),

  // --- Clientes ---
  getClientes: () => apiClient.get('/api/clientes/'),
  getCliente: (id) => apiClient.get(`/api/clientes/${id}/`),
  createCliente: (data) => apiClient.post('/api/clientes/', data),
  updateCliente: (id, data) => apiClient.put(`/api/clientes/${id}/`, data),
  deleteCliente: (id) => apiClient.delete(`/api/clientes/${id}/`),

  // --- Categorias ---
  getCategorias: () => apiClient.get('/api/categorias/'),
  getCategoria: (id) => apiClient.get(`/api/categorias/${id}/`),
  createCategoria: (data) => apiClient.post('/api/categorias/', data),
  updateCategoria: (id, data) => apiClient.put(`/api/categorias/${id}/`, data),
  deleteCategoria: (id) => apiClient.delete(`/api/categorias/${id}/`),

  // --- Productos ---
  getProductos: () => apiClient.get('/api/productos/'),
  getProducto: (id) => apiClient.get(`/api/productos/${id}/`),
  createProducto: (data) => apiClient.post('/api/productos/', data),
  updateProducto: (id, data) => apiClient.put(`/api/productos/${id}/`, data),
  deleteProducto: (id) => apiClient.delete(`/api/productos/${id}/`),

  // --- Ventas ---
  getVentas: () => apiClient.get('/api/ventas/'),
  getVenta: (id) => apiClient.get(`/api/ventas/${id}/`),
  createVenta: (data) => apiClient.post('/api/ventas/', data),

  // --- Reportes ---
  getMasVendidos: () => apiClient.get('/api/reportes/productos_mas_vendidos/'),
  getMenosVendidos: () => apiClient.get('/api/reportes/productos_menos_vendidos/'),
  getVentasPorVendedor: () => apiClient.get('/api/reportes/ventas_por_vendedor/'),
};

export default api;