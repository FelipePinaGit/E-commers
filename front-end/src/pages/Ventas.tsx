import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import VentaForm from '../components/VentaForm';
import { Venta, getVentas, anularVenta } from '../services/ventaService'; // Importamos anularVenta
import { Plus, RefreshCw } from 'lucide-react';

const Ventas = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getVentas();
      setVentas(data);
    } catch (err) {
      setError('Error al cargar las ventas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleVentaSaved = (saved: boolean) => {
    if (saved) {
      setShowForm(false);
      fetchVentas();
    }
  };

  // Nueva función para anular venta
  const handleAnularVenta = async (id: number) => {
    if (!confirm('¿Estás seguro que querés anular esta venta?')) return;
    try {
      await anularVenta(id);
      fetchVentas();
    } catch (error) {
      alert('Error al anular la venta');
      console.error(error);
    }
  };

  // Función para devolver color según estado de venta
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'anulada':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Gestión de Ventas</h1>
        <div className="flex space-x-3 mt-4 md:mt-0">
          {isAdmin && (
            <button
              onClick={handleAddNew}
              className="flex items-center px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              title="Nueva Venta"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Venta
            </button>
          )}
          <button
            onClick={fetchVentas}
            className="flex items-center px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Actualizar"
          >
            <RefreshCw className="w-5 h-5 mr-2 animate-spin-on-refresh" />
            Recargar
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-4 border-green-600"></div>
        </div>
      ) : ventas.length === 0 ? (
        <p className="text-center text-gray-600">No hay ventas para mostrar.</p>
      ) : (
        <div className="space-y-4">
          {ventas.map((venta) => (
            <div
              key={venta.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200"
            >
              <div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-6 md:items-center flex-1">
                <span className="font-semibold text-gray-800">ID: {venta.id}</span>
                <span className="text-gray-600">Cliente: {venta.clienteId || '—'}</span>
                <span className="text-gray-600">Fecha: {new Date(venta.fecha).toLocaleDateString()}</span>
                <span className="text-gray-600">Total: ${venta.montoFinal.toFixed(2)}</span>
                <span
                  className={`px-3 py-1 rounded-full font-medium text-sm ${getEstadoColor(venta.estado)}`}
                >
                  {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                </span>
              </div>
              <div className="mt-3 md:mt-0 flex space-x-3">
                {venta.estado.toLowerCase() !== 'anulada' && isAdmin && (
                  <button
                    onClick={() => handleAnularVenta(venta.id)} // Aquí no hay error porque venta.id es number
                    className="px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                    title="Anular venta"
                  >
                    Anular
                  </button>
                )}
                {venta.estado.toLowerCase() === 'anulada' && (
                  <button
                    disabled
                    className="px-4 py-1 rounded-md bg-blue-400 text-white cursor-not-allowed"
                    title="Venta anulada"
                  >
                    Anulada
                  </button>
                )}
                {isAdmin && (
                  <button
                    // Botón editar deshabilitado sin funcionalidad
                    className="px-4 py-1 rounded-md bg-yellow-500 text-white cursor-not-allowed opacity-50"
                    title="Editar venta (deshabilitado)"
                    disabled
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-3xl overflow-auto max-h-[90vh]">
            <button
              onClick={handleFormClose}
              className="mb-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Cerrar formulario"
            >
              ✕
            </button>
            <VentaForm onClose={handleFormClose} onSaved={handleVentaSaved} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
