/*import React, { useState } from 'react';

// --- Mock Data --- //
// This data would normally come from an API call based on sales records.
const sampleReportData = {
  masVendidos: [
    { id: 1, nombre: 'Mouse Logitech', cantidad: 150 },
    { id: 2, nombre: 'Laptop HP', cantidad: 95 },
    { id: 3, nombre: 'Teclado Mecánico', cantidad: 80 },
    { id: 4, nombre: 'Monitor 24 pulgadas', cantidad: 60 },
    { id: 5, nombre: 'Webcam HD', cantidad: 45 },
  ],
  menosVendidos: [
    { id: 10, nombre: 'Funda para Laptop', cantidad: 5 },
    { id: 11, nombre: 'Hub USB-C', cantidad: 8 },
    { id: 12, nombre: 'Silla Ergonómica', cantidad: 12 },
    { id: 13, nombre: 'Micrófono Condensador', cantidad: 15 },
    { id: 14, nombre: 'Aro de Luz LED', cantidad: 20 },
  ],
  masCaros: [
    { id: 20, nombre: 'PC Gamer Alienware', precio: '2500.00' },
    { id: 2, nombre: 'Laptop HP', precio: '1200.00' },
    { id: 12, nombre: 'Silla Ergonómica', precio: '450.00' },
    { id: 4, nombre: 'Monitor 24 pulgadas', precio: '250.00' },
    { id: 13, nombre: 'Micrófono Condensador', precio: '180.00' },
  ],
};
// --- End Mock Data ---

const ReportCard = ({ title, data, dataKey, dataLabel }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={item.id} className="flex justify-between items-center text-gray-700">
          <span>{item.nombre}</span>
          <span className="font-semibold text-blue-600">{dataLabel}{item[dataKey]}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ReportesVista = () => {
  const [reporteActivo, setReporteActivo] = useState('masVendidos');
  const [comandoVoz, setComandoVoz] = useState('');

  // Futura función para procesar comandos de voz
  const handleVoiceCommand = () => {
    // 1. (Futuro) Integrar API de Speech-to-Text para obtener el `comandoVoz`.
    //    ej: navigator.mediaDevices.getUserMedia({ audio: true }) ...
    console.log(`Procesando comando de voz: "${comandoVoz}"`);

    // 2. (Futuro) Enviar el texto a un endpoint del backend que lo convierta en una consulta.
    //    El backend analizaría el texto (ej: "muéstrame los más vendidos") y generaría
    //    la consulta SQL/ORM apropiada para devolver los datos del reporte.
    //    ej: fetch('/api/reports/voice', { method: 'POST', body: { command: comandoVoz } })

    // 3. Por ahora, simulamos la selección del reporte.
    if (comandoVoz.toLowerCase().includes('más vendidos')) {
      setReporteActivo('masVendidos');
    } else if (comandoVoz.toLowerCase().includes('menos vendidos')) {
      setReporteActivo('menosVendidos');
    } else if (comandoVoz.toLowerCase().includes('más caros')) {
      setReporteActivo('masCaros');
    }
    setComandoVoz('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes de Ventas</h1>
      </div>

      {/* Sección para Comandos de Voz (Diseño Preliminar) */
  /*    <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Comando de Voz (Experimental)</h2>
        <p className="text-sm text-gray-600 mb-3">Escriba un comando como "muéstrame los más vendidos" y presione Enter.</p>
        <div className="flex gap-2">
          <input 
            type="text"
            value={comandoVoz}
            onChange={(e) => setComandoVoz(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVoiceCommand()}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='Ej: muéstrame los menos vendidos'
          />
          <button onClick={handleVoiceCommand} className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-lg">
            Procesar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">*En el futuro, esto funcionará con un micrófono.*</p>
      </div>

      {/* Contenedor de Reportes */
    /*  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Top 5 Más Vendidos" 
          data={sampleReportData.masVendidos} 
          dataKey="cantidad"
          dataLabel="Uds: "
        />
        <ReportCard 
          title="Top 5 Menos Vendidos" 
          data={sampleReportData.menosVendidos} 
          dataKey="cantidad"
          dataLabel="Uds: "
        />
        <ReportCard 
          title="Top 5 Más Caros" 
          data={sampleReportData.masCaros} 
          dataKey="precio"
          dataLabel="$"
        />
      </div>
    </div>
  );
};

export default ReportesVista;
*/

import React, { useState } from 'react';
import { Container, Card, Alert, Table, Badge } from 'react-bootstrap';
import VoiceCommandButton from '../components/VoiceCommandButton'; // Importamos el nuevo componente

const ReportesVista = () => {
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const renderReportData = () => {
    if (!reportResult || !reportResult.data) return null;

    const { data_type, data } = reportResult;

    // Renderizar tabla de productos
    if (data_type === 'product_list') {
      return (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>SKU</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              {data[0]?.total_vendido !== undefined && <th>Total Vendido</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nombre}</td>
                <td>{item.sku || 'N/A'}</td>
                <td>${parseFloat(item.precio).toFixed(2)}</td>
                <td>
                  <Badge bg={item.stock <= 10 ? 'danger' : 'success'}>{item.stock}</Badge>
                </td>
                <td>{item.categoria_nombre || 'Sin categoría'}</td>
                {item.total_vendido !== undefined && <td>{item.total_vendido}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    
    // Renderizar tabla de mejores clientes
    if (data_type === 'client_list_summary') {
        return (
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre Cliente</th>
                        <th>Email</th>
                        <th>N° Compras</th>
                        <th>Total Gastado</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.nombre} {item.apellido}</td>
                            <td>{item.email}</td>
                            <td><Badge bg="info">{item.numero_compras}</Badge></td>
                            <td><Badge bg="success">${parseFloat(item.total_comprado).toFixed(2)}</Badge></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
    
    // Si es otro tipo de dato, mostramos un JSON (ej. Ventas)
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <Container fluid className="p-4">
      <Card>
        <Card.Header>
          <Card.Title>Centro de Reportes</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Usa el comando de voz para generar reportes. Ejemplos:</p>
          <ul>
            <li>"Muéstrame los productos más vendidos"</li>
            <li>"¿Qué productos tienen poco stock?"</li>
            <li>"Quiero ver los mejores clientes"</li>
            <li>"Reporte de ventas del último mes"</li>
          </ul>
          <div className="mb-4">
            <VoiceCommandButton
              onResult={setReportResult}
              onError={setError}
              onListeningChange={setIsListening}
            />
             {isListening && <span className="ms-3 fst-italic text-primary">Habla ahora...</span>}
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          
          {reportResult && (
            <Card className="mt-4">
              <Card.Header>
                <Card.Title as="h5">{reportResult.title}</Card.Title>
              </Card.Header>
              <Card.Body>
                {renderReportData()}
              </Card.Body>
            </Card>
          )}

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportesVista;