import prisma from "../prisma/client.js";

// --- PROVEEDORES ---

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
  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: { rut, nombre, direccion, telefono, paginaWeb },
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un proveedor con ese RUT' });
    }
    res.status(500).json({ error: "Error al crear proveedor" });
  }
};

// Actualizar proveedor por RUT
export const updateProveedor = async (req, res) => {
  const { rut } = req.params;
  const { nombre, direccion, telefono, paginaWeb } = req.body;

  try {
    const proveedorExistente = await prisma.proveedor.findUnique({ where: { rut } });
    if (!proveedorExistente) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    const proveedorActualizado = await prisma.proveedor.update({
      where: { rut },
      data: { nombre, direccion, telefono, paginaWeb },
    });

    res.json(proveedorActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

export const deleteProveedor = async (req, res) => {
  const { rut } = req.params;

  try {
    // Buscar proveedor para obtener su id
    const proveedorExistente = await prisma.proveedor.findUnique({ where: { rut } });
    if (!proveedorExistente) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    // Buscar productos asociados usando proveedorId (id)
    const productosAsociados = await prisma.producto.findMany({ where: { proveedorId: proveedorExistente.id } });
    if (productosAsociados.length > 0) {
      return res.status(400).json({ error: "No se puede eliminar proveedor con productos asociados" });
    }

    // Eliminar proveedor usando id o rut
    await prisma.proveedor.delete({ where: { rut } });

    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
};

// --- CATEGORÍAS ---

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

// Actualizar categoría por ID
export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const categoriaExistente = await prisma.categoria.findUnique({ where: { id: Number(id) } });
    if (!categoriaExistente) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: Number(id) },
      data: { nombre, descripcion },
    });

    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

// Eliminar categoría por ID
export const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    // Podés chequear productos asociados antes de eliminar
    const productosAsociados = await prisma.producto.findMany({ where: { categoriaId: Number(id) } });
    if (productosAsociados.length > 0) {
      return res.status(400).json({ error: "No se puede eliminar categoría con productos asociados" });
    }

    await prisma.categoria.delete({ where: { id: Number(id) } });
    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};

// --- PRODUCTOS ---

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

// Actualizar producto por ID
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precioActual, stock, proveedorId, categoriaId } = req.body;

  try {
    const productoExistente = await prisma.producto.findUnique({ where: { id: Number(id) } });
    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(id) },
      data: { nombre, precioActual, stock, proveedorId, categoriaId },
    });

    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto por ID
export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.producto.delete({ where: { id: Number(id) } });
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
