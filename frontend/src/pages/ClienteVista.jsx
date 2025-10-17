import React, { useState } from 'react';
import ClienteList from '../components/ClienteList';
import Modal from '../components/Modal';
import ClienteForm from '../components/ClienteForm';

// Sample data, to be replaced by API calls
const sampleClientes = [
  { id: 1, nombre: 'Juan Perez', dni: '12345678', telefono: '987654321', direccion: 'Calle Falsa 123' },
  { id: 2, nombre: 'Ana Gomez', dni: '87654321', telefono: '912345678', direccion: 'Av. Siempreviva 742' },
];

const ClienteVista = () => {
  const [clientes, setClientes] = useState(sampleClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleOpenModal = (cliente = null) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSave = (clienteData) => {
    if (selectedCliente) {
      // Update
      setClientes(clientes.map(c => c.id === selectedCliente.id ? { ...c, ...clienteData } : c));
    } else {
      // Create
      setClientes([...clientes, { id: Date.now(), ...clienteData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (clienteId) => {
    setClientes(clientes.filter(c => c.id !== clienteId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Añadir Cliente
        </button>
      </div>
      <ClienteList
        clientes={clientes}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ClienteForm
            cliente={selectedCliente}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClienteVista;
