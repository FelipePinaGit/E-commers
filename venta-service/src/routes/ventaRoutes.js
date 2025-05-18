import express from "express";
import { getVentas, createVenta, updateVenta, anularVenta } from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", getVentas);
router.post("/", createVenta);
router.put("/:id", updateVenta);        
router.patch("/anular/:id", anularVenta); 

export default router;
