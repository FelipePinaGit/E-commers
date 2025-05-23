import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createVenta, Venta } from '../services/ventaService';

const Carrito = () => {
  const { carrito, limpiarCarrito } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [descuento, setDescuento] = useState(0);

  const calcularMontoFinal = () => {
    const suma = carrito.reduce(
      (acc, { producto, cantidad }) => acc + producto.precioActual * cantidad,
      0
    );
    return Math.max(suma - descuento, 0);
  };

  const handleFinalizarCompra = async () => {
    if (!user || user.role === 'admin') return;

    if (carrito.length === 0) {
      setMensaje('❌ El carrito está vacío.');
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      const detalles = carrito.map(({ producto, cantidad }) => {
        const precio = producto.precioActual;
        const subtotal = precio * cantidad;
        return {
          productoId: producto.id,
          cantidad,
          precio,
          subtotal,
        };
      });

      const montoFinal = calcularMontoFinal();

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
                <span className="font-medium">${producto.precioActual * cantidad}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Descuento</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={descuento}
              min={0}
              onChange={(e) => setDescuento(Number(e.target.value))}
            />
          </div>

          <div className="mb-4 font-bold text-lg">
            Monto final: ${calcularMontoFinal()}
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
