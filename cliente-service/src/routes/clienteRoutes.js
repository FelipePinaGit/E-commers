import express from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", getClientes);           // Obtener todos los clientes
router.post("/", createCliente);        // Crear cliente
router.put("/:rut", updateCliente);     // Editar cliente por RUT
router.delete("/:rut", deleteCliente);  // Eliminar cliente por RUT

export default router;
