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
          create: telefonos.map(numero => ({ numero }))
        }
      },
      include: {
        telefonos: true
      }
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};