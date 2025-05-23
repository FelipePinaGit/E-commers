import { X } from 'lucide-react';
import { Venta } from '../services/ventaService';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
interface VentaDetalleProps {
  venta: Venta;
  onClose: () => void;
}

const VentaDetalle = ({ venta, onClose }: VentaDetalleProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completada':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completada
          </span>
        );
      case 'anulada':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Anulada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
    }
  };

  // Función para formatear moneda en pesos argentinos (podés cambiar localización si querés)
  const formatCurrency = (value: number) =>
    value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalle de Venta #{venta.id}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Información de la Venta
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Fecha:</span>{' '}
                  {new Date(venta.fecha).toLocaleDateString('es-AR')}
                </p>
                <p>
                  <span className="font-medium">Estado:</span> {getStatusBadge(venta.estado)}
                </p>
                <p>
                  <span className="font-medium">Total:</span> {formatCurrency(venta. montoFinal)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Información del Cliente
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">RUT:</span> {venta.clienteId}
                </p>
                {venta.cliente && (
                  <>
                    <p>
                      <span className="font-medium">Nombre:</span> {venta.cliente.nombre}{' '}
                    </p>

                  </>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Detalle de Productos
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venta.detalles.map((detalle, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {detalle.producto ? detalle.producto.nombre : `Producto #${detalle.productoId}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(detalle.precio)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {detalle.cantidad}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(detalle.subtotal)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td
                    colSpan={3}
                    className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(venta.montoFinal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalle;
