import prisma from "../prisma/client.js";

// PROVEEDORES

export const getProveedores = async (req, res) => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

export const createProveedor = async (req, res) => {
  const { rut, nombre, direccion, telefono, paginaWeb } = req.body;
  console.log("Body recibido:", req.body);

  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: { rut, nombre, direccion, telefono, paginaWeb },
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un proveedor con ese RUT' });
    }
    console.error("Error en createProveedor:", error);
    res.status(500).json({ error: "Error al crear proveedor" });
  }
};

// CATEGORIAS

export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

export const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre, descripcion },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

// PRODUCTOS

export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        proveedor: true,
        categoria: true,
      },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const createProducto = async (req, res) => {
  const { nombre, precioActual, stock, proveedorId, categoriaId } = req.body;

  try {
    const nuevoProducto = await prisma.producto.create({
      data: { nombre, precioActual, stock, proveedorId, categoriaId },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};
