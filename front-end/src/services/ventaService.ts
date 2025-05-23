import axios from 'axios';
import { handleAxiosError } from './errorHandler';
import { Cliente } from './clienteService';
import { Producto } from './productoService';

// DetalleVenta basado en el modelo de Prisma
export interface DetalleVenta {
  id?: number;
  ventaId: number;
  productoId: number;
  precio: number;
  cantidad: number;
  subtotal: number;
  producto?: Producto;
}

// Venta basada en el modelo de Prisma
export interface Venta {
  id: number;  // obligatorio
  fecha: string;
  descuento: number;
  montoFinal: number;
  clienteId: string;
  estado: 'activa' | 'anulada';
  detalles: DetalleVenta[];
  cliente?: Cliente;
}

// Cliente Axios configurado
const ventaAPI = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obtener todas las ventas
export const getVentas = async (): Promise<Venta[]> => {
  try {
    const response = await ventaAPI.get('/ventas');
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener ventas');
  }
};

// Obtener una venta por su ID
export const getVentaById = async (id: number): Promise<Venta> => {
  try {
    const response = await ventaAPI.get(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener la venta');
  }
};

// Obtener ventas por clienteId
export const getVentasByClienteId = async (clienteId: string): Promise<Venta[]> => {
  try {
    const response = await ventaAPI.get(`/ventas?clienteId=${clienteId}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener las ventas del cliente');
  }
};

// Crear una nueva venta
export const createVenta = async (venta: Venta): Promise<Venta> => {
  try {
    const response = await ventaAPI.post('/ventas', venta);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al crear la venta');
  }
};

// Actualizar una venta existente
export const updateVenta = async (id: number, venta: Venta): Promise<Venta> => {
  try {
    const response = await ventaAPI.put(`/ventas/${id}`, venta);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al actualizar la venta');
  }
};

// Anular una venta
export const anularVenta = async (id: number): Promise<Venta> => {
  try {
    const response = await ventaAPI.patch(`/ventas/anular/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al anular la venta');
  }
};