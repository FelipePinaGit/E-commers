import prisma from "../prisma/client.js";

export const getClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({ include: { telefonos: true } });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

export const createCliente = async (req, res) => {
  const { rut, nombre, direccion, telefonos } = req.body;

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        rut,
        nombre,
        direccion: {
          create: direccion
        },
        telefonos: {
          create: telefonos.map(numero => ({ numero }))
        }
      },
      include: {
        direccion: true,
        telefonos: true
      }
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};
