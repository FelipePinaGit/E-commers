import express from "express";
import dotenv from "dotenv";
import clienteRoutes from "./routes/clienteRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/clientes", clienteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Cliente-service corriendo en el puerto ${PORT}`);
});
