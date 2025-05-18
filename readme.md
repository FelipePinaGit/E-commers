📦 Microservicio: Catalogo-Service

📘 README  
📄 Descripción  
Este microservicio forma parte de un sistema distribuido para gestión de ventas. El servicio 'catalogo-service' es responsable de la administración de productos, proveedores y categorías. Está desarrollado en Node.js con Express y Prisma ORM.

🧱 Estructura del Proyecto

📁 catalogo-service/  
├── 📁 src/  
│   ├── 📁 controllers/         # Lógica de negocio  
│   ├── 📁 prisma/              # Configuración de Prisma y schema  
│   └── 📁 routes/              # Rutas del servicio  
├── 📄 .env                     # Variables de entorno  
├── 📄 package.json             # Configuraciones de npm y scripts  
└── 📄 README.md                # Documentación del servicio  

🛠 Tecnologías Usadas  
- Node.js  
- Express  
- Prisma  
- MySQL  
- dotenv  
- Axios  
- Nodemon  

🌐 Endpoints disponibles  
Ejemplos de rutas (según tus controladores):  
- GET /productos  
- POST /productos  
- GET /categorias  
- POST /proveedores  

▶️ Scripts disponibles  
- `npm run dev`: Ejecuta el servidor en modo desarrollo con Nodemon  

📦 REQUERIMIENTOS  

🔧 Comandos por Consola  

1. Inicializar proyecto (desde la carpeta del microservicio)  
   > npm init -y  

2. Instalar dependencias  
   > npm install express dotenv prisma @prisma/client nodemon axios  

3. Inicializar Prisma  
   > npx prisma init  

4. Configurar .env con tu cadena de conexión  
   > DATABASE_URL="mysql://usuario:password@localhost:3306/catalogo_service"  

5. Crear esquema en prisma/schema.prisma  

6. Generar cliente Prisma y aplicar migración  
   > npx prisma generate  
   > npx prisma migrate dev --name init  

7. Ejecutar el servidor (desde la raíz del microservicio)  
   > npm run dev  

📌 ¿Desde dónde ejecutar cada comando?

✅ Comandos de instalación (npm init, npm install, etc.)  
➡️ Ejecutalos dentro de **cada carpeta de microservicio**, por ejemplo:


cd cliente-service
npm init -y
npm install express dotenv prisma @prisma/client axios
npm install --save-dev nodemon


Y repetís lo mismo dentro de:
  catalogo-service
  venta-service
Cada uno es un proyecto independiente.

✅ Comandos de Prisma (npx prisma init, generate, migrate, etc.)
➡️ También se ejecutan dentro de cada microservicio, es decir:
  cd cliente-service
  npx prisma init

Esto creará una carpeta prisma/ dentro de cliente-service. Luego, también dentro de esa carpeta:
  npx prisma generate
  npx prisma migrate dev --name init

⚠️ Nunca los ejecutes desde la raíz del proyecto general (/e-commers), ya que cada microservicio tiene su propia base de datos, dependencias y configuración de Prisma.

✅ ¿Dónde ejecutar npm run dev?
➡️ También dentro de cada carpeta de microservicio, una vez que ya configuraste el script correspondiente:
  cd cliente-service
  npm run dev

Para que funcione, el package.json debe tener esto:

"scripts": {
  "dev": "nodemon src/index.js"
}

✅ Repetís lo mismo en:
  catalogo-service
  venta-service
Cada uno debe tener su propio package.json y ejecutarse individualmente dentro de su carpeta.

📬 Uso con Postman
## Uso de Headers en Postman
Para realizar las solicitudes HTTP a este microservicio usando Postman, es recomendable configurar los siguientes headers:
- **Content-Type:** `application/json`  
  Indica que el cuerpo de la petición está en formato JSON.
### Cómo agregar el header en Postman:
1. Abre Postman y selecciona o crea la solicitud que quieres probar.
2. Ve a la pestaña **Headers**.
3. Agrega una nueva clave con el nombre `Content-Type`.
4. Pon el valor `application/json`.

Esto asegura que el servidor interprete correctamente los datos enviados en el body de la solicitud.
---
**Ejemplo de header configurado en Postman:**

| KEY          | VALUE             |
|--------------|-------------------|
| Content-Type | application/json  |

---
Con esta configuración, podrás enviar correctamente tus peticiones POST, PUT, PATCH o DELETE con datos en formato JSON.

A continuación se incluyen ejemplos de solicitudes POST para probar el servicio con Postman.

🟢 POST /productos

{
  "nombre": "Auriculares Bluetooth",
  "precioActual": 2500,
  "stock": 100,
  "proveedorId": 1,
  "categoriaId": 1
}

🟢 POST /proveedores

{
  "rut": "12345678001",
  "nombre": "Proveedor Uno",
  "direccion": "Av. Corrientes 123",
  "telefono": "1133344455",
  "paginaWeb": "https://proveedor1.com"
}

🟢 POST /categorias

{
  "nombre": "Electrónica",
  "descripcion": "Dispositivos electrónicos de consumo"
}

