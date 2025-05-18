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
Versión 1
- Creación de 5 microservicios independientes.
- Instalación de dependencias iniciales y configuración básica.

Versión 2
- Reducción a 3 microservicios para mejorar organización y mantenimiento.
- Instalación de nuevas dependencias necesarias.
- Creación de endpoints básicos de tipo GET y POST para cada microservicio.

Versión 3
- Pruebas funcionales con Postman para verificar endpoints.
- Modificaciones y correcciones en archivos fuente para mejorar el funcionamiento.

Versión 4
- Implementación de nuevos endpoints PUT (actualizar) y DELETE (eliminar).
- Verificación y validación exhaustiva mediante Postman.
- Implementación de lógica para actualización y anulación de ventas sin eliminación física.

Versión 5 (Próxima etapa)
- Conexión entre microservicios mediante llamadas HTTP para sincronización de datos.
- Ejemplo: microservicio de ventas consultará catálogo para validar productos y actualizar stock.
- Planificación para integración más robusta y escalable.
