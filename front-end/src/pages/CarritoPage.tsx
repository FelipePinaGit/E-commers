import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createVenta, Venta } from '../services/ventaService';

const Carrito = () => {
  const {
    carrito,
    limpiarCarrito,
    obtenerTotal,
  } = useCarrito();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleFinalizarCompra = async () => {
    if (!user || user.role === 'admin') {
      setMensaje('❌ Debes estar logueado como cliente para realizar la compra.');
      return;
    }

    if (carrito.length === 0) {
      setMensaje('❌ El carrito está vacío.');
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      const detalles = carrito.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        cantidad,
        precio: producto.precioActual,
        subtotal: producto.precioActual * cantidad,
      }));

      const montoFinal = obtenerTotal();
      const descuento = 0;

      const ventaPayload: Omit<Venta, 'id' | 'cliente' | 'detalles'> & {
        detalles: Partial<Venta['detalles'][number]>[];
      } = {
        fecha: new Date().toISOString(),
        descuento,
        montoFinal,
        clienteId: user.username,
        estado: 'activa',
        detalles,
      };

      await createVenta(ventaPayload as Venta);

      setMensaje('✅ Compra registrada con éxito.');
      limpiarCarrito();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      console.error(error);
      setMensaje(error?.response?.data?.message || '❌ Error al registrar la venta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {carrito.map(({ producto, cantidad }) => (
              <li key={producto.id} className="py-2 flex justify-between">
                <span>{producto.nombre} x {cantidad}</span>
                <span className="font-medium">${(producto.precioActual * cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 font-bold text-lg">
            Monto final: ${obtenerTotal().toFixed(2)}
          </div>

          {mensaje && <div className="mb-4 text-sm text-center">{mensaje}</div>}

          <button
            disabled={loading}
            onClick={handleFinalizarCompra}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </>
      )}
    </div>
  );
};

export default Carrito;
