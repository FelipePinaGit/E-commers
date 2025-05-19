🛒E-COMMERS

📦 Microservicios
📄 Descripción  
Los microservicios forman parte de un sistema distribuido para gestión de ventas. Cada microoservicio esta desarrollado para cumplir distintas funciones. Están desarrollados en Node.js con Express y Prisma ORM.

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

🛍️ GET /productos
➕ POST /productos
✏️ PUT /productos/:id 
🗑️ DELETE /productos/:id 


▶️ Scripts disponibles  
- npm run dev: Ejecuta el servidor en modo desarrollo con Nodemon  

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

📝 Evolución del Proyecto

✅ Versión 1 – Estructura Inicial del Proyecto
⚙️ Cambios realizados

Creación de 5 microservicios independientes para cada área funcional del sistema.

Instalación de dependencias base y configuración mínima para cada servicio.

✅ Versión 2 – Reorganización en 3 Microservicios
⚙️ Cambios realizados

Simplificación de arquitectura: Se reorganizó el proyecto en 3 microservicios principales:

catalogo-service (productos, categorías, proveedores),

cliente-service,

venta-service.

Instalación de dependencias necesarias.

Implementación de endpoints GET y POST básicos para cada microservicio.

✅ Versión 3 – Validación de Endpoints
⚙️ Cambios realizados

Uso de Postman para realizar pruebas de los endpoints creados.

Correcciones en archivos fuente para mejorar la funcionalidad y resolver errores.

Validación de estructuras JSON y rutas.

✅ Versión 4 – Actualización y Anulación de Registros
⚙️ Cambios realizados

Creación de endpoints PUT y DELETE.

Se implementa la lógica para:

Actualizar ventas (por cambios en producto o cantidad),

Anular ventas sin eliminación física.

Pruebas intensivas con Postman para verificar correcto funcionamiento.

✅ Versión 5 – Integración entre Ventas y Catálogo
⚙️ Cambios realizados

Conexión directa entre venta-service y catalogo-service mediante llamadas HTTP con axios.

Validación previa al registrar una venta:

Obtención del producto desde catálogo.

Validación de stock disponible.

Obtención del precio actual del producto.

Cambio del tipo clienteId a String (RUT) para compatibilidad con cliente-service.

Cálculo de subtotales, descuento y monto final correctamente.

Implementación de manejo de errores para evitar ventas inválidas o inconsistentes.

Respuesta JSON final con toda la información relacionada a la venta.

✅ Versión 6 – Gestión de Stock integrada con Ventas

🔧 Cambios en catalogo-service
Nuevo endpoint PUT /api/productos/:id/stock para actualizar solo el stock de un producto.

🔧 Cambios en venta-service
Validación de stock antes de registrar venta.

Descuento automático de stock al registrar una venta exitosa.

Anulación de ventas con:

Cambio de estado a "ANULADA".

Devolución de stock a los productos involucrados.

🧪 Pruebas realizadas
Postman utilizado para testear todas las funcionalidades mencionadas.

🚀 Versión 7 – Implementación del Frontend
🎨 Objetivo

Inicio del desarrollo de la interfaz de usuario del sistema de ventas.

El frontend consumirá los endpoints expuestos por los microservicios existentes (ventas, clientes, catálogo).
