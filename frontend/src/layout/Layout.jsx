import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/', text: 'Dashboard' },
  { to: '/categorias', text: 'Categorías' },
  { to: '/productos', text: 'Productos' },
  { to: '/clientes', text: 'Clientes' },
  { to: '/ventas', text: 'Ventas' },
  { to: '/usuarios', text: 'Usuarios' },
  { to: '/reportes', text: 'Reportes' },
];

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center bg-gray-900">
          <h1 className="text-2xl font-bold">SisVenta</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ` +
                (isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white')
              }
            >
              {link.text}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4">
            <NavLink
              to="/login"
              className="flex items-center px-4 py-2 rounded-md text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200"
            >
              Cerrar Sesión
            </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md h-16 flex justify-end items-center px-6">
            {/* User menu can go here */}
            <div className="text-gray-600">Usuario: Admin</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
