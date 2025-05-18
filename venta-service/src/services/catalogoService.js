// venta-service/services/catalogoService.js
import axios from "axios";

const CATALOGO_BASE_URL = "http://localhost:3000/api";

export const obtenerProducto = async (id) => {
  const url = `${CATALOGO_BASE_URL}/productos/${id}`;
  console.log("Consultando catálogo con URL:", url); // 👈 log de prueba

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}`, error.message);
    return null;
  }
};
