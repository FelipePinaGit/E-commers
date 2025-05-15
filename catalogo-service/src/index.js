import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "./routes/catalogoRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", catalogoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`catalogo-service corriendo en puerto ${PORT}`);
});
