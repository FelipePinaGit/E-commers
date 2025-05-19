// venta-service/services/catalogoService.js
import axios from "axios";

const CATALOGO_BASE_URL = "http://localhost:3000/api";

// Obtener los datos de un producto desde el microservicio catálogo
export const obtenerProducto = async (id) => {
  const url = `${CATALOGO_BASE_URL}/productos/${id}`;
  console.log("Consultando catálogo con URL:", url); // 👈 log de prueba

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error.message);
    return null;
  }
};

// Actualizar el stock de un producto (usando PUT general)
export const actualizarStock= async (productoId, nuevoStock) => {
  const url = `${CATALOGO_BASE_URL}/productos/${productoId}`;
  try {
    await axios.put(url, { stock: nuevoStock });
  } catch (error) {
    console.error(`Error al actualizar stock del producto ${productoId}:`, error.message);
    throw new Error("Fallo al actualizar stock en el microservicio catálogo");
  }
};
