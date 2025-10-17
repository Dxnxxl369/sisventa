import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UsuarioForm = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const isEditing = user && user.id;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: '', // No precargar la contraseña
      });
    } else {
      // Reset form for new user
      setFormData({ username: '', first_name: '', last_name: '', email: '', password: '' });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let payload = { ...formData };
      // No enviar la contraseña si está vacía durante una edición
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await api.updateUser(user.id, payload);
      } else {
        await api.createUser(payload);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar el usuario. Verifique los datos.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Apellido</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Contraseña</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''} required={!isEditing} />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          {isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;
