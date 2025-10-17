import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UsuarioList = ({ onEdit, refreshKey }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('No se pudieron cargar los usuarios.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]); // Se refresca cuando refreshKey cambia

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await api.deleteUser(id);
        fetchUsers(); // Recarga la lista después de eliminar
      } catch (err) {
        setError('Error al eliminar el usuario.');
        console.error(err);
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre Completo</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.id}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.username}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{`${user.first_name} ${user.last_name}`}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <button onClick={() => onEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuarioList;
