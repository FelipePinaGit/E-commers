import { createContext, useContext, useState, ReactNode } from 'react';
import { Producto } from '../services/productoService';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  carrito: ReadonlyArray<ItemCarrito>;
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (id: number) => void;
  disminuirCantidad: (id: number) => void;
  limpiarCarrito: () => void;
  aplicarCodigoDescuento: (codigo: string) => boolean;
  obtenerTotal: () => number;
  obtenerTotalConDescuento: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const agregarProducto = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);

      if (existe) {
        if (existe.cantidad < producto.stock) {
          return prev.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        } else {
          console.warn(`Stock insuficiente para el producto "${producto.nombre}".`);
          return prev;
        }
      }

      if (producto.stock > 0) {
        return [...prev, { producto, cantidad: 1 }];
      } else {
        console.warn(`No se puede agregar "${producto.nombre}" porque no hay stock.`);
        return prev;
      }
    });
  };

  const disminuirCantidad = (id: number) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const quitarProducto = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  // 🔁 Código de descuento deshabilitado
  const aplicarCodigoDescuento = () => false;

  // 🔁 Total sin descuento
  const obtenerTotal = () =>
    carrito.reduce((total, item) => total + item.producto.precioActual * item.cantidad, 0);

  const obtenerTotalConDescuento = () => obtenerTotal(); // sin descuento

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        quitarProducto,
        disminuirCantidad,
        limpiarCarrito,
        aplicarCodigoDescuento,
        obtenerTotal,
        obtenerTotalConDescuento,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};
