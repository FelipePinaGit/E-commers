import express from "express";
import dotenv from "dotenv";
import ventaRoutes from "./routes/ventaRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/ventas", ventaRoutes);

app.listen(PORT, () => {
  console.log(`Venta-service corriendo en http://localhost:${PORT}`);
});
