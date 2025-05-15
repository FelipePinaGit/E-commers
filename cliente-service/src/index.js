import express from "express";
import dotenv from "dotenv";
import clienteRoutes from "./src/routes/clienteRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/clientes", clienteRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Cliente-service corriendo en el puerto ${PORT}`);
});
