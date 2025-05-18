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

// Editar una venta existente
export const updateVenta = async (req, res) => {
  const { id } = req.params;
  const { detalles, descuento } = req.body;

  try {
    const ventaExistente = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: { detalles: true },
    });

    if (!ventaExistente) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Borrar detalles anteriores
    await prisma.detalleVenta.deleteMany({ where: { ventaId: ventaExistente.id } });

    // Calcular nuevo monto final
    const subtotalTotal = detalles.reduce((acc, item) => acc + item.subtotal, 0);
    const montoFinal = subtotalTotal - (subtotalTotal * (descuento / 100));

    // Actualizar venta
    const ventaActualizada = await prisma.venta.update({
      where: { id: parseInt(id) },
      data: {
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

    res.json(ventaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar la venta" });
  }
};

// Anular venta
export const anularVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await prisma.venta.findUnique({ where: { id: parseInt(id) } });

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    if (venta.estado === "anulada") {
      return res.status(400).json({ error: "La venta ya fue anulada" });
    }

    const ventaAnulada = await prisma.venta.update({
      where: { id: parseInt(id) },
      data: { estado: "anulada" }
    });

    res.json({ mensaje: "Venta anulada", venta: ventaAnulada });
  } catch (error) {
    res.status(500).json({ error: "Error al anular la venta" });
  }
};
