import axios from 'axios';
import { handleAxiosError } from './errorHandler';

// MODELOS

export interface Proveedor {
  id: number;
  rut: string;
  nombre: string;
  direccion: string;
  telefono: string;
  paginaWeb?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precioActual: number;
  stock: number;
  proveedorId: number;
  categoriaId: number;
  proveedor?: Proveedor;
  categoria?: Categoria;
}

// ===================
// CLIENTES AXIOS
// ===================

const productoAPI = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

const proveedorAPI = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

const categoriaAPI = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// ===================
// PRODUCTO CRUD
// ===================

// Retorna lista completa de productos
export const getProductos = async (): Promise<Producto[]> => {
  try {
    const res = await productoAPI.get('/productos');
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener productos');
  }
};

// Obtener producto por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  try {
    const res = await productoAPI.get(`/productos/${id}`);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener el producto');
  }
};

// Crear producto nuevo (puede ser parcial sin id)
export const createProducto = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
  try {
    const res = await productoAPI.post('/productos', producto);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al crear el producto');
  }
};

// Actualizar producto por id
export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
  try {
    const res = await productoAPI.put(`/productos/${id}`, producto);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al actualizar el producto');
  }
};

// Eliminar producto por id
export const deleteProducto = async (id: number): Promise<void> => {
  try {
    await productoAPI.delete(`/productos/${id}`);
  } catch (error) {
    return handleAxiosError(error, 'Error al eliminar el producto');
  }
};

// ===================
// PROVEEDOR CRUD
// ===================

export const getProveedores = async (): Promise<Proveedor[]> => {
  try {
    const res = await proveedorAPI.get('/proveedores');
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener proveedores');
  }
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
  try {
    const res = await proveedorAPI.get(`/proveedores/${id}`);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener el proveedor');
  }
};

export const createProveedor = async (proveedor: Proveedor): Promise<Proveedor> => {
  try {
    const res = await proveedorAPI.post('/proveedores', proveedor);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al crear el proveedor');
  }
};

export const updateProveedor = async (id: number, proveedor: Proveedor): Promise<Proveedor> => {
  try {
    const res = await proveedorAPI.put(`/proveedores/${id}`, proveedor);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al actualizar el proveedor');
  }
};

export const deleteProveedor = async (id: number): Promise<void> => {
  try {
    await proveedorAPI.delete(`/proveedores/${id}`);
  } catch (error) {
    return handleAxiosError(error, 'Error al eliminar el proveedor');
  }
};

// ===================
// CATEGORIA CRUD
// ===================

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const res = await categoriaAPI.get('/categorias');
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener categorías');
  }
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  try {
    const res = await categoriaAPI.get(`/categorias/${id}`);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al obtener la categoría');
  }
};

export const createCategoria = async (categoria: Categoria): Promise<Categoria> => {
  try {
    const res = await categoriaAPI.post('/categorias', categoria);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al crear la categoría');
  }
};

export const updateCategoria = async (id: number, categoria: Categoria): Promise<Categoria> => {
  try {
    const res = await categoriaAPI.put(`/categorias/${id}`, categoria);
    return res.data;
  } catch (error) {
    return handleAxiosError(error, 'Error al actualizar la categoría');
  }
};

export const deleteCategoria = async (id: number): Promise<void> => {
  try {
    await categoriaAPI.delete(`/categorias/${id}`);
  } catch (error) {
    return handleAxiosError(error, 'Error al eliminar la categoría');
  }
};
