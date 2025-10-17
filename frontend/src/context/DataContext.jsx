// frontend/src/context/DataContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api'; // Usamos tu api.js

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  // Puedes agregar más datos aquí (usuarios, categorías, etc.)

  const fetchClientes = useCallback(async () => {
    try {
      const response = await api.getClientes();
      setClientes(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }, []);

  const fetchProductos = useCallback(async () => {
    try {
      const response = await api.getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }, []);
  
  const value = {
    clientes,
    fetchClientes,
    productos,
    fetchProductos,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};