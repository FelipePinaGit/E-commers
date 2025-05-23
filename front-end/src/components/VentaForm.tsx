import { useState, useEffect } from 'react';
import { Venta, createVenta } from '../services/ventaService';
import { Producto, getProductos } from '../services/productoService';
import { Cliente, getClientes } from '../services/clienteService';

interface VentaFormProps {
  onClose: () => void;
  onSaved: (saved: boolean) => void;
}

const VentaForm = ({ onClose, onSaved }: VentaFormProps) => {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [descuento, setDescuento] = useState(0);
  const [clienteId, setClienteId] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [detalles, setDetalles] = useState<
    { productoId: number; cantidad: number; precio: number; subtotal: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Función para formatear moneda ARS
  const formatCurrency = (value: number) =>
    value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await getProductos();
        const clis = await getClientes();
        setProductos(prods);
        setClientes(clis);
      } catch {
        setError('Error cargando productos o clientes');
      }
    };
    fetchData();
  }, []);

  const agregarDetalle = () => {
    setDetalles([...detalles, { productoId: 0, cantidad: 1, precio: 0, subtotal: 0 }]);
  };

  const actualizarDetalle = (index: number, campo: string, valor: any) => {
    const newDetalles = [...detalles];
    const detalle = newDetalles[index];

    if (campo === 'productoId') {
      detalle.productoId = Number(valor);
      const prod = productos.find((p) => p.id === detalle.productoId);
      detalle.precio = prod ? prod.precioActual : 0;
    } else if (campo === 'cantidad') {
      detalle.cantidad = Number(valor);
    }

    detalle.subtotal = detalle.precio * detalle.cantidad;

    setDetalles(newDetalles);
  };

  const calcularMontoFinal = () => {
    const suma = detalles.reduce((acc, d) => acc + d.subtotal, 0);
    return Math.max(suma - descuento, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) {
      setError('Debe seleccionar un cliente');
      return;
    }
    if (detalles.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }
    for (const d of detalles) {
      if (d.productoId === 0) {
        setError('Todos los productos deben estar seleccionados');
        return;
      }
      if (d.cantidad <= 0) {
        setError('Las cantidades deben ser mayores a cero');
        return;
      }
    }

    setError(null);
    setIsSaving(true);

    // Construir objeto Venta para enviar
    const venta: Omit<Venta, 'id' | 'cliente' | 'detalles'> & { detalles: Partial<Venta['detalles'][number]>[] } = {
      fecha: new Date(fecha).toISOString(),
      descuento,
      montoFinal: calcularMontoFinal(),
      clienteId,
      estado: 'activa',
      detalles: detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precio: d.precio,
        subtotal: d.subtotal,
        // No enviamos ventaId ni id de detalle
      })),
    };

    try {
      await createVenta(venta as Venta);
      onSaved(true);
    } catch (err) {
      console.error(err);
      setError('Error al guardar la venta. Verifique los datos e intente nuevamente.');
      onSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Resto del JSX queda igual (inputs, selects, botones...)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl max-h-[80vh] overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4">Nueva Venta</h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* Fecha */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Cliente */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Seleccionar cliente --</option>
            {clientes.map((c) => (
              <option key={c.rut} value={c.rut}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Detalles */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Detalles</label>
          {detalles.map((detalle, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select
                className="border p-2 rounded flex-1"
                value={detalle.productoId}
                onChange={(e) => actualizarDetalle(i, 'productoId', e.target.value)}
                required
              >
                <option value={0}>-- Producto --</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="border p-2 rounded w-20"
                value={detalle.cantidad}
                min={1}
                onChange={(e) => actualizarDetalle(i, 'cantidad', e.target.value)}
                required
              />

              <div className="w-24 text-right font-mono">{formatCurrency(detalle.subtotal)}</div>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarDetalle}
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + Agregar producto
          </button>
        </div>

        {/* Descuento */}
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

        {/* Monto final */}
        <div className="mb-6 font-bold text-lg">
          Monto final: {formatCurrency(calcularMontoFinal())}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VentaForm;
