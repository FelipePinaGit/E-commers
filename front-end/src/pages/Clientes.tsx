import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ClienteTable from '../components/ClienteTable';
import ClienteForm from '../components/ClienteForm';
import { Cliente, getClientes } from '../services/clienteService';
import { Plus, RefreshCw } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext'; // Paso 4

const Clientes = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const { carrito, quitarProducto, limpiarCarrito } = useCarrito(); // Paso 4

  // Solo usuarios admin pueden acceder a esta página
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentCliente(null);
    setShowForm(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentCliente(null);
  };

  const handleClienteSaved = (saved: boolean) => {
    if (saved) {
      setShowForm(false);
      setCurrentCliente(null);
      fetchClientes();
    }
  };

  const handleClienteDeleted = () => {
    fetchClientes();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Nuevo Cliente
          </button>
          <button
            onClick={fetchClientes}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-1" />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ClienteTable
          clientes={clientes}
          onEdit={handleEdit}
          onDeleted={handleClienteDeleted}
        />
      )}

      {showForm && (
        <ClienteForm
          cliente={currentCliente}
          onClose={handleFormClose}
          onSaved={handleClienteSaved}
        />
      )}

      {/* Mostrar carrito si el usuario no es admin */}
      {user?.role !== 'admin' && carrito.length > 0 && (
        <div className="mt-8 p-4 border rounded-md bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">🛒 Carrito</h2>
          <ul className="space-y-1">
            {carrito.map(({ producto, cantidad }) => (
              <li key={producto.id} className="flex justify-between">
                <span>{producto.nombre} x {cantidad}</span>
                <button
                  onClick={() => quitarProducto(producto.id!)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={limpiarCarrito}
            className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default Clientes;
