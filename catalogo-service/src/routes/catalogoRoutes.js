import { Router } from "express";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/catalogoController.js";

const router = Router();

// Proveedores
router.get("/proveedores", getProveedores);
router.post("/proveedores", createProveedor);
router.put("/proveedores/:rut", updateProveedor);   // PATCH para actualizar
router.delete("/proveedores/:rut", deleteProveedor);  // DELETE para eliminar

// Categorías
router.get("/categorias", getCategorias);
router.post("/categorias", createCategoria);
router.put("/categorias/:id", updateCategoria);     // si agregás updateCategoria
router.delete("/categorias/:id", deleteCategoria);    // si agregás deleteCategoria

// Productos
router.get("/productos", getProductos);
router.get("/productos/:id", getProductoById);
router.post("/productos", createProducto);
router.put("/productos/:id", updateProducto);       // si agregás updateProducto
router.delete("/productos/:id", deleteProducto);      // si agregás deleteProducto

export default router;
