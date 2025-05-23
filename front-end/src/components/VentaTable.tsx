import React, { useEffect, useState } from 'react';
import { getVentas, anularVenta, Venta } from '../services/ventaService';

export const VentasTable = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    setLoading(true);
    const data = await getVentas();
    setVentas(data);
    setLoading(false);
  };

  const handleAnular = async (id?: number) => {
    if (!id) return;
    await anularVenta(id);
    fetchVentas();
  };

  if (loading) return <p>Cargando ventas...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Descuento %</th>
          <th>Monto Final</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta.id}>
            <td>{venta.id}</td>
            <td>{new Date(venta.fecha).toLocaleDateString()}</td>
            <td>{venta.cliente?.nombre || venta.clienteId}</td>
            <td>{venta.descuento}</td>
            <td>{venta.montoFinal.toFixed(2)}</td>
            <td>{venta.estado}</td>
            <td>
              {venta.estado === 'activa' && (
                <button onClick={() => handleAnular(venta.id)}>Anular</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default VentasTable;