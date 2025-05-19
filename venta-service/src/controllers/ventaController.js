import prisma from "../prisma/client.js";
import { obtenerProducto } from "../services/catalogoService.js";
import { actualizarStock} from "../services/catalogoService.js";

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

// Crear una nueva venta con validación de catálogo
export const createVenta = async (req, res) => {
  console.log("Body recibido en venta:", req.body);
  const { fecha, clienteId, descuento, detalles } = req.body;

  if (!Array.isArray(detalles)) {
    return res.status(400).json({ error: "El campo 'detalles' debe ser un array" });
  }

  try {
    let subtotalTotal = 0;
    const detallesValidados = [];

    for (const item of detalles) {
      const producto = await obtenerProducto(item.productoId);

      if (!producto) {
        return res.status(400).json({ error: `Producto con ID ${item.productoId} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${producto.nombre} (disponible: ${producto.stock})`
        });
      }

      const subtotal = producto.precioActual * item.cantidad;
      subtotalTotal += subtotal;

      detallesValidados.push({
        productoId: item.productoId,
        precio: producto.precioActual,
        cantidad: item.cantidad,
        subtotal
      });
    }

    const montoFinal = subtotalTotal - (subtotalTotal * (descuento / 100));

    const nuevaVenta = await prisma.venta.create({
      data: {
        fecha: new Date(fecha),
        clienteId,
        descuento,
        montoFinal,
        detalles: {
          create: detallesValidados
        }
      },
      include: { detalles: true }
    });

    // 🔻 Descontar stock en catálogo
    for (const item of detallesValidados) {
  const nuevoStock = item.cantidad; // cantidad vendida
  try {
    const producto = await obtenerProducto(item.productoId);
    await actualizarStock(item.productoId, producto.stock - nuevoStock);
  } catch (error) {
    console.error(`Fallo al actualizar el stock del producto ${item.productoId}`);
  }
}

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error("Error al crear la venta:", error.message);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};

// Editar una venta existente con validación y recálculo
export const updateVenta = async (req, res) => {
  const { id } = req.params;
  const { detalles, descuento } = req.body;

  if (!Array.isArray(detalles)) {
    return res.status(400).json({ error: "El campo 'detalles' debe ser un array" });
  }

  try {
    const ventaExistente = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: { detalles: true },
    });

    if (!ventaExistente) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Validar detalles y recalcular precios/subtotales
    let subtotalTotal = 0;
    const detallesValidados = [];

    for (const item of detalles) {
      const producto = await obtenerProducto(item.productoId);

      if (!producto) {
        return res.status(400).json({ error: `Producto con ID ${item.productoId} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${producto.nombre} (disponible: ${producto.stock})`
        });
      }

      const subtotal = producto.precioActual * item.cantidad;
      subtotalTotal += subtotal;

      detallesValidados.push({
        productoId: item.productoId,
        precio: producto.precioActual,
        cantidad: item.cantidad,
        subtotal
      });
    }

    const montoFinal = subtotalTotal - (subtotalTotal * (descuento / 100));

    // Borrar detalles anteriores
    await prisma.detalleVenta.deleteMany({ where: { ventaId: ventaExistente.id } });

    // Actualizar venta
    const ventaActualizada = await prisma.venta.update({
      where: { id: parseInt(id) },
      data: {
        descuento,
        montoFinal,
        detalles: {
          create: detallesValidados
        }
      },
      include: { detalles: true }
    });

    // TODO: llamar a servicio catálogo para ajustar stock aquí (diferencia con detalle viejo)

    res.json(ventaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar la venta" });
  }
};


// Anular una venta y devolver stock
export const anularVenta = async (req, res) => {
  const ventaId = parseInt(req.params.id);

  try {
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: { detalles: true },
    });

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    if (venta.estado === "ANULADA") {
      return res.status(400).json({ error: "La venta ya fue anulada" });
    }

    // Marcar venta como anulada
    await prisma.venta.update({
      where: { id: ventaId },
      data: { estado: "ANULADA" },
    });

    // Devolver stock de cada producto
    for (const detalle of venta.detalles) {
      const producto = await obtenerProducto(detalle.productoId);
      if (!producto) {
        console.warn(`Producto con ID ${detalle.productoId} no encontrado, omitiendo`);
        continue;
      }

      const nuevoStock = producto.stock + detalle.cantidad;
      await actualizarStock(detalle.productoId, nuevoStock);
    }

    res.json({ mensaje: "Venta anulada y stock devuelto correctamente" });
  } catch (error) {
    console.error("Error al anular la venta:", error.message);
    res.status(500).json({ error: "Error al anular la venta" });
  }
};
