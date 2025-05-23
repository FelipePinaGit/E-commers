import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "./routes/catalogoRoutes.js"; // rutas solo de catálogo
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

app.use("/api", catalogoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`catalogo-service corriendo en puerto ${PORT}`);
});
