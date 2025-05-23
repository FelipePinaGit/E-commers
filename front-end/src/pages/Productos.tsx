import { useState, useEffect } from 'react';
import ProductoTable from '../components/ProductoTable';
import ProductoForm from '../components/ProductoForm';
import { Producto, getProductos } from '../services/productoService';
import { getProveedores, getCategorias } from '../services/productoService';
import { useAuth } from '../context/AuthContext';
import { Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Productos = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<{ id: number; nombre: string }[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<Producto[]>([]);  // Estado carrito
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchInicial();
  }, []);

  const fetchInicial = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [productosData, proveedoresData, categoriasData] = await Promise.all([
        getProductos(),
        getProveedores(),
        getCategorias()
      ]);
      setProductos(productosData);
      setProveedores(proveedoresData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentProducto(null);
    setShowForm(true);
  };

  const handleEdit = (producto: Producto) => {
    setCurrentProducto(producto);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentProducto(null);
  };

  const handleProductoSaved = (saved: boolean) => {
    if (saved) {
      setShowForm(false);
      setCurrentProducto(null);
      fetchProductos();
    }
  };

  const handleProductoDeleted = () => {
    fetchProductos();
  };

  // --- NUEVO: Función para agregar producto al carrito ---
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => [...prev, producto]);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
        
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          {/* Mostrar carrito con cantidad */}
          <Link to="/carrito" className="relative inline-flex items-center gap-2 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
            <ShoppingCart className="h-5 w-5" />
            Carrito
            {carrito.length > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white w-5 h-5">
                {carrito.length}
              </span>
            )}
          </Link>

          {isAdmin && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Nuevo producto
            </button>
          )}
          <button
            onClick={fetchProductos}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Recargar
          </button>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductoTable
          productos={productos}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDeleted={handleProductoDeleted}
          agregarAlCarrito={agregarAlCarrito} // Pasamos la función al componente tabla
        />
      )}

      {showForm && (
        <ProductoForm
          producto={currentProducto}
          proveedores={proveedores}
          categorias={categorias}
          onClose={handleFormClose}
          onSaved={handleProductoSaved}
        />
      )}
    </div>
  );
};

export default Productos;
