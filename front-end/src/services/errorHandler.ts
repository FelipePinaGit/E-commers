import axios, { AxiosError } from 'axios';

export const handleAxiosError = (error: unknown, defaultMessage = 'Error en la operación'): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Log error details for debugging
    console.error('API Error:', axiosError);
    
    // Handling different status codes
    if (axiosError.response) {
      const status = axiosError.response.status;
      
      switch (status) {
        case 400:
          throw new Error(`Error de solicitud: ${axiosError.response.data.message || 'Datos inválidos'}`);
        case 401:
          throw new Error('No autorizado. Por favor inicie sesión nuevamente.');
        case 403:
          throw new Error('Acceso prohibido. No tiene permisos para esta acción.');
        case 404:
          throw new Error('Recurso no encontrado.');
        case 409:
          throw new Error('Conflicto con el estado actual del recurso.');
        case 422:
          throw new Error(`Error de validación: ${axiosError.response.data.message || 'Datos inválidos'}`);
        case 500:
          throw new Error('Error interno del servidor. Intente más tarde.');
        default:
          throw new Error(`${defaultMessage}: ${axiosError.message}`);
      }
    } else if (axiosError.request) {
      // Request was made but no response was received
      throw new Error('No se recibió respuesta del servidor. Verifique su conexión.');
    } else {
      // Something happened in setting up the request
      throw new Error(`Error de configuración: ${axiosError.message}`);
    }
  } 
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    throw new Error(`${defaultMessage}: ${error.message}`);
  }
  
  // Handle unknown errors
  throw new Error(defaultMessage);
};