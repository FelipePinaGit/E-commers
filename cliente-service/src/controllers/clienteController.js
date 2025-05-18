import prisma from "../prisma/client.js";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { telefonos: true },
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

// Crear nuevo cliente
export const createCliente = async (req, res) => {
  const { rut, nombre, calle, numero, ciudad, telefonos } = req.body;

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        rut,
        nombre,
        calle,
        numero,
        ciudad,
        telefonos: {
          create: telefonos.map(numero => ({ numero })),
        },
      },
      include: { telefonos: true },
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

// 🔄 Actualizar cliente por RUT (parcialmente)
export const updateCliente = async (req, res) => {
  const { rut } = req.params;
  const { nombre, calle, numero, ciudad, telefonos } = req.body;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { rut },
      include: { telefonos: true },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Construimos el objeto data dinámicamente
    const dataActualizar = {};

    if (nombre !== undefined) dataActualizar.nombre = nombre;
    if (calle !== undefined) dataActualizar.calle = calle;
    if (numero !== undefined) dataActualizar.numero = numero;
    if (ciudad !== undefined) dataActualizar.ciudad = ciudad;

    if (telefonos !== undefined) {
      // Si vienen teléfonos, borramos los antiguos y creamos los nuevos
      dataActualizar.telefonos = {
        deleteMany: { clienteId: cliente.id },
        create: telefonos.map((nro) => ({ numero: nro })),
      };
    }

    const clienteActualizado = await prisma.cliente.update({
      where: { rut },
      data: dataActualizar,
      include: { telefonos: true },
    });

    res.json(clienteActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};


// 🗑️ Eliminar cliente por RUT
export const deleteCliente = async (req, res) => {
  const { rut } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { rut },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Primero eliminamos los teléfonos asociados
    await prisma.telefono.deleteMany({ where: { clienteId: cliente.id } });

    // Luego eliminamos al cliente
    await prisma.cliente.delete({ where: { rut } });

    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};
