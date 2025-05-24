import { useState } from 'react';
import { Producto, deleteProducto } from '../services/productoService';
import { Edit, Trash2, AlertCircle, ShoppingCart } from 'lucide-react';

interface ProductoTableProps {
  productos: (Producto & { imagenUrl?: string })[];
  onEdit: (producto: Producto) => void;
  onDeleted: () => void;
  isAdmin: boolean;
  agregarAlCarrito?: (producto: Producto) => void;
}

const ProductoTable = ({ productos, onEdit, onDeleted, isAdmin, agregarAlCarrito }: ProductoTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (id: number) => setDeleteConfirm(id);
  const handleDeleteCancel = () => setDeleteConfirm(null);

  const handleDeleteConfirm = async (id: number) => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteProducto(id);
      onDeleted();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (productos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No hay productos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {error && (
        <div className="m-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredProductos.map((producto) => (
          <div
            key={producto.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={`/producto/${producto.id}.jpeg`}
                alt={producto.nombre}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).onerror = null;
                  (e.currentTarget as HTMLImageElement).src = '/producto/default.jpeg';
                }}
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                <p className="font-bold text-lg">${producto.precioActual.toLocaleString()}</p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className={`text-sm ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                </span>

                <div className="flex space-x-2">
                  {deleteConfirm === producto.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteConfirm(producto.id!)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Sí
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        disabled={isDeleting}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => onEdit(producto)}
                            className="p-1 text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(producto.id!)}
                            className="p-1 text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          className={`p-1 rounded ${
                            producto.stock === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'
                          }`}
                          onClick={() => agregarAlCarrito && agregarAlCarrito(producto)}
                          disabled={producto.stock === 0}
                          title={producto.stock === 0 ? 'Producto sin stock' : 'Agregar al carrito'}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{filteredProductos.length}</span> de{' '}
          <span className="font-medium">{productos.length}</span> productos
        </p>
      </div>
    </div>
  );
};

export default ProductoTable;
