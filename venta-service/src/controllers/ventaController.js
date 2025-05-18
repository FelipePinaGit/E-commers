import prisma from "../prisma/client.js";

// Obtener todas las ventas
export const getVentas = async (req, res) => {
  try {
    const ventas = await prisma.venta.findMany({
      include: { detalles: true }
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
};

// Crear una nueva venta con detalles
export const createVenta = async (req, res) => {
  console.log("Body recibido en venta:", req.body); // 🔍 Ver qué estás enviando
  const { fecha, clienteId, descuento, detalles } = req.body;
  
  if (!Array.isArray(detalles)) {
    return res.status(400).json({ error: "El campo 'detalles' debe ser un array" });
  }


  try {
    // Calcular monto final sumando subtotales y aplicando descuento
    const subtotalTotal = detalles.reduce((acc, item) => acc + item.subtotal, 0);
    const montoFinal = subtotalTotal - (subtotalTotal * (descuento / 100));

    const nuevaVenta = await prisma.venta.create({
      data: {
        fecha: new Date(fecha),
        clienteId,
        descuento,
        montoFinal,
        detalles: {
          create: detalles.map(item => ({
            productoId: item.productoId,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.subtotal
          }))
        }
      },
      include: { detalles: true }
    });

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};
