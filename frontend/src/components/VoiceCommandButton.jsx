import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap'; // Usando React-Bootstrap como en tu proyecto
import { MicFill, StopCircleFill } from 'react-bootstrap-icons';

// Asumo que tienes un servicio para la URL de la API
import api from '../services/api';  

const VoiceCommandButton = ({ onResult, onError, onListeningChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'es-ES';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    } else {
      console.error("Web Speech API no soportada por este navegador.");
    }
  }, []);

  const processCommand = useCallback(async (text) => {
    setIsLoading(true);
    onError(''); // Limpiar errores previos
    try {
      // 2. Usa la función de tu servicio de API
      const response = await api.processVoiceCommand(text);
      onResult(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al procesar el comando.";
      if (error.response?.status === 401) {
          onError("No autorizado. Por favor, inicie sesión de nuevo.");
      } else {
          onError(errorMessage);
      }
      onResult(null); // Limpiar resultados previos
    } finally {
      setIsLoading(false);
    }
  }, [onResult, onError]);

  const handleListen = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      return;
    }
    
    setIsListening(true);
    onListeningChange(true);
    recognition.start();

    recognition.onresult = (event) => {
      const commandText = event.results[0][0].transcript;
      processCommand(commandText);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      onListeningChange(false);
    };

    recognition.onerror = (event) => {
      onError(`Error de reconocimiento: ${event.error}`);
    };
  }, [recognition, isListening, onListeningChange, processCommand, onError]);


  if (!recognition) {
    return <Button variant="secondary" disabled>Voz no disponible</Button>;
  }

  return (
    <Button 
      variant={isListening ? 'danger' : 'primary'} 
      onClick={handleListen} 
      disabled={isLoading}
      className="d-flex align-items-center"
    >
      {isLoading ? (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
      ) : isListening ? (
        <StopCircleFill />
      ) : (
        <MicFill />
      )}
      <span className="ms-2">
        {isLoading ? 'Procesando...' : isListening ? 'Escuchando...' : 'Comando de Voz'}
      </span>
    </Button>
  );
};

export default VoiceCommandButton;