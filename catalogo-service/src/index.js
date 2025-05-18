import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "./routes/catalogoRoutes.js";

dotenv.config();

const app = express();

// Middleware para parsear JSON en el body (¡Debe ir antes de las rutas!)
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});


// Rutas
app.use("/api", catalogoRoutes);

app.post('/testjson', (req, res) => {
  console.log("Test JSON:", req.body);
  res.json({ recibido: req.body });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`catalogo-service corriendo en puerto ${PORT}`);
});
