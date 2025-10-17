import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import CategoriaList from '../components/CategoriaList'; // Componente para mostrar la lista
import CategoriaForm from '../components/CategoriaForm'; // Componente para el formulario
import api from '../services/api'; // Tu servicio centralizado de API

const CategoriaVista = () => {
  // --- Estados del Componente ---
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState(null); // Para saber si estamos creando o editando
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga

  // --- Función para obtener las categorías de la API ---
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.getCategorias();
      setCategorias(response.data);
      setError(''); // Limpiar errores previos si la carga es exitosa
    } catch (err) {
      setError('Error al cargar las categorías. Verifique la conexión con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Cargar los datos iniciales cuando el componente se monta ---
  useEffect(() => {
    fetchCategorias();
  }, []);

  // --- Manejadores de Eventos ---
  const handleOpenModal = (categoria = null) => {
    setCategoriaActual(categoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaActual(null);
  };

  const handleSave = async (data) => {
    try {
      if (categoriaActual && categoriaActual.id) {
        // Actualizar categoría existente
        await api.updateCategoria(categoriaActual.id, data);
      } else {
        // Crear nueva categoría
        await api.createCategoria(data);
      }
      fetchCategorias(); // Recargar la lista para mostrar los cambios
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar la categoría. Revise los datos.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await api.deleteCategoria(id);
        fetchCategorias(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la categoría.');
        console.error(err);
      }
    }
  };

  // --- Renderizado del Componente ---
  return (
    <Container fluid className="p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h2" className="mb-0">Gestión de Categorías</Card.Title>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Nueva Categoría
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p>Cargando categorías...</p>
            </div>
          ) : (
            <CategoriaList
              categorias={categorias}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{categoriaActual ? 'Editar' : 'Nueva'} Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoriaForm
            onSubmit={handleSave}
            categoriaData={categoriaActual}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoriaVista;