import { Router } from "express";
import {
  getProveedores,
  createProveedor,
  getCategorias,
  createCategoria,
  getProductos,
  createProducto,
} from "../controllers/catalogoController.js";

const router = Router();

// Proveedores
router.get("/proveedores", getProveedores);
router.post("/proveedores", createProveedor);

// Categorías
router.get("/categorias", getCategorias);
router.post("/categorias", createCategoria);

// Productos
router.get("/productos", getProductos);
router.post("/productos", createProducto);

export default router;
