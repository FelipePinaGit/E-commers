import { useState } from 'react';
import { Cliente, deleteCliente } from '../services/clienteService';
import { Edit, Trash2, AlertCircle } from 'lucide-react';

interface ClienteTableProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDeleted: () => void;
}

const ClienteTable = ({ clientes, onEdit, onDeleted }: ClienteTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (rut: string) => {
    setDeleteConfirm(rut);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = async (rut: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteCliente(rut);
      onDeleted();
    } catch (err) {
      setError('Error al eliminar el cliente');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Buscamos en rut, nombre, calle, número y ciudad
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.calle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.numero.toString().includes(searchTerm) ||
      cliente.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (clientes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No hay clientes registrados</p>
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
          placeholder="Buscar cliente..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ciudad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClientes.map((cliente) => (
              <tr key={cliente.rut} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cliente.rut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cliente.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cliente.calle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cliente.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cliente.ciudad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {deleteConfirm === cliente.rut ? (
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm text-gray-500">¿Confirmar?</span>
                      <button
                        onClick={() => handleDeleteConfirm(cliente.rut)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sí
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        disabled={isDeleting}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(cliente)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cliente.rut)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{filteredClientes.length}</span> de{' '}
          <span className="font-medium">{clientes.length}</span> clientes
        </p>
      </div>
    </div>
  );
};

export default ClienteTable;
