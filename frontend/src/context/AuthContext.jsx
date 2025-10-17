import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const navigate = useNavigate();

  useEffect(() => {
    // Si hay un token, podríamos querer verificarlo con el backend
    // y obtener los datos del usuario. Por ahora, lo mantenemos simple.
    if (token) {
      // Simulamos que obtenemos el usuario si hay token.
      // En una app real, aquí harías una llamada a /api/user/me/ o similar.
      setUser({ token }); 
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      navigate('/'); // Redirige al dashboard después del login
    } catch (error) {
      console.error('Error de autenticación:', error);
      // Aquí podrías manejar el estado de error en el login
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
