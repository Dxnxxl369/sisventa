/*import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ejemplo de tarjetas de estadísticas */
        /*<div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Ventas Hoy</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">$1,250</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Clientes Nuevos</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Productos Bajos de Stock</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total de Ingresos</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">$48,600</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;*/

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Necesitarás: npm install recharts
import { API_URL } from '../services/api';
import axios from 'axios';
import { CashCoin, PeopleFill, BoxSeam, ArchiveFill } from 'react-bootstrap-icons';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/dashboard-stats/`);
                setStats(response.data);
            } catch (err) {
                setError('No se pudieron cargar las estadísticas del dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    }

    if (error) {
        return <Container><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">Dashboard General</h2>
            <Row>
                {/* Tarjetas de Métricas Principales */}
                <Col md={6} xl={3} className="mb-4">
                    <Card border="primary" className="h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">${stats.total_ventas_mes.toFixed(2)}</h4>
                                    <p className="text-muted mb-0">Ventas (Este Mes)</p>
                                </div>
                                <CashCoin size={40} className="text-primary" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                 <Col md={6} xl={3} className="mb-4">
                    <Card border="success" className="h-100">
                        <Card.Body>
                             <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">{stats.nuevos_clientes_mes}</h4>
                                    <p className="text-muted mb-0">Nuevos Clientes (Mes)</p>
                                </div>
                                <PeopleFill size={40} className="text-success" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                 <Col md={6} xl={3} className="mb-4">
                    <Card border="danger" className="h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">{stats.productos_bajo_stock}</h4>
                                    <p className="text-muted mb-0">Productos con Stock Bajo</p>
                                </div>
                                <ArchiveFill size={40} className="text-danger" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                 <Col md={6} xl={3} className="mb-4">
                     <Card border="info" className="h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">{stats.total_productos}</h4>
                                    <p className="text-muted mb-0">Productos Totales</p>
                                </div>
                                <BoxSeam size={40} className="text-info" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>Ventas por Categoría</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={stats.ventas_por_categoria}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nombre" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                    <Legend />
                                    <Bar dataKey="total_vendido" fill="#8884d8" name="Total Vendido" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default Dashboard;