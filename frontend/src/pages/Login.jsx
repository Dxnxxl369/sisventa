import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    console.log('Simulando login...');
    navigate('/'); // Redirige al dashboard después del login
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" class="text-sm font-bold text-gray-600 block">Usuario</label>
            <input type="text" id="username" class="w-full p-2 border border-gray-300 rounded mt-1" placeholder="admin"/>
          </div>
          <div>
            <label htmlFor="password" class="text-sm font-bold text-gray-600 block">Contraseña</label>
            <input type="password" id="password" class="w-full p-2 border border-gray-300 rounded mt-1" placeholder="********"/>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;