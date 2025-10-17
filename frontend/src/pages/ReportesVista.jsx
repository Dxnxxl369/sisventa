import React, { useState } from 'react';

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

      {/* Sección para Comandos de Voz (Diseño Preliminar) */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
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

      {/* Contenedor de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
