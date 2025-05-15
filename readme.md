🛠️ Proyecto de Microservicios – Sistema de Ventas
Este proyecto implementa un sistema de ventas dividido en 3 microservicios desarrollados con Node.js, Express y Prisma, conectados a bases de datos MySQL independientes.

📦 Estructura de Microservicios

proyectos/
└── e-commers/
    ├── catalogo-service/
    │   ├── node_modules/
    │   ├── prisma/
    │   │   └── schema.prisma
    │   ├── src/
    │   │   ├── controllers/
    │   │   │   └── productoController.js
    │   │   ├── routes/
    │   │   │   └── productoRoutes.js
    │   │   ├── prisma/
    │   │   │   └── client.js
    │   │   └── index.js
    │   └── .env
    ├── cliente-service/
    └── venta-service/


⚙️ Requisitos Previos
Node.js ≥ 18
npm ≥ 9
MySQL corriendo localmente
Visual Studio Code (opcional pero recomendado)

🚀 Pasos para Levantar el Servicio catalogo-service
1️⃣ Crear estructura del proyecto

mkdir -p proyectos/e-commers
cd proyectos/e-commers
mkdir catalogo-service, cliente-service, venta-service

2️⃣ Inicializar Node y modificar package.json

cd catalogo-service
npm init -y
Editar package.json y asegurarte de tener:

"type": "module",
"scripts": {
  "dev": "nodemon src/index.js"
}

3️⃣ Crear archivos iniciales

mkdir prisma, src, src/controllers, src/routes, src/prisma

4️⃣ Instalar dependencias

npm install express dotenv prisma @prisma/client

5️⃣ Crear archivo .env

DATABASE_URL="mysql://usuario:contraseña@localhost:3306/catalogo_service"
    Reemplazá usuario, contraseña y catalogo_service con tus datos reales.

✍️ Prisma – Definición del Modelo
Archivo: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Venta {
  id          Int             @id @default(autoincrement())
  fecha       DateTime
  clienteRut  String
  descuento   Float
  montoFinal  Float
  detalles    DetalleVenta[]
}

model DetalleVenta {
  id          Int      @id @default(autoincrement())
  ventaId     Int
  productoId  Int
  precio      Float
  cantidad    Int
  subtotal    Float
  venta       Venta    @relation(fields: [ventaId], references: [id])
}


🛠️ Inicializar Prisma

npx prisma generate
npx prisma migrate dev --name init

🧠 Código Base en src/
📁 src/index.js

import express from "express";
import dotenv from "dotenv";
import productoRoutes from "./routes/productoRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/productos", productoRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`📦 Catalogo-service corriendo en http://localhost:${PORT}`);
});

📁 src/prisma/client.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;

📁 src/controllers/productoController.js

import prisma from "../prisma/client.js";

export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

📁 src/routes/productoRoutes.js

import express from "express";
import { getProductos } from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getProductos);

export default router;
