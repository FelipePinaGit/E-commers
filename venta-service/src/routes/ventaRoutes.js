import express from "express";
import { getVentas, createVenta, updateVenta, anularVenta } from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", getVentas);
router.post("/", createVenta);
router.put("/:id", updateVenta);        // editar venta
router.patch("/anular/:id", anularVenta); // anular venta

export default router;
