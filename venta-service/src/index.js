import express from "express";
import dotenv from "dotenv";
import ventaRoutes from "./routes/ventaRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();

// Configuración CORS para permitir sólo desde http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
}));

app.use(express.json());

app.use("/ventas", ventaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Venta-service corriendo en http://localhost:${PORT}`);
});
