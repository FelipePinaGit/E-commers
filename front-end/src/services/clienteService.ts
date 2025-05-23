import axios from 'axios';
import { handleAxiosError } from './errorHandler';

// Definición del tipo Cliente
export interface Cliente {
  rut: string;
  nombre: string;
  calle: string;
  numero: number;
  ciudad: string;
  telefonos: string[];
}
// Cliente Axios configurado
const clienteAPI = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obtener todos los clientes
export const getClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await clienteAPI.get('/clientes');
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener clientes');
  }
};

// Obtener un cliente por su RUT
export const getClienteByRut = async (rut: string): Promise<Cliente> => {
  try {
    const response = await clienteAPI.get(`/clientes/${rut}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener el cliente');
  }
};

// Crear un nuevo cliente
export const createCliente = async (cliente: Cliente): Promise<Cliente> => {
  try {
    const response = await clienteAPI.post('/clientes', cliente);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al crear el cliente');
  }
};

// Actualizar un cliente existente
export const updateCliente = async (rut: string, cliente: Cliente): Promise<Cliente> => {
  try {
    const response = await clienteAPI.put(`/clientes/${rut}`, cliente);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al actualizar el cliente');
  }
};

// Eliminar un cliente
export const deleteCliente = async (rut: string): Promise<void> => {
  try {
    await clienteAPI.delete(`/clientes/${rut}`);
  } catch (error) {
    return handleAxiosError(error, 'Error al eliminar el cliente');
  }
};