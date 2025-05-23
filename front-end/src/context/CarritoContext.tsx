import { createContext, useContext, useState, ReactNode } from 'react';
import { Producto } from '../services/productoService';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (id: number) => void;
  disminuirCantidad: (id: number) => void; // Nueva función para disminuir cantidad
  limpiarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const agregarProducto = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      if (existe) {
        // Aquí podrías agregar validación contra stock disponible si querés
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
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
        .filter((item) => item.cantidad > 0) // Remueve items con cantidad 0
    );
  };

  const quitarProducto = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
  };

  const limpiarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, quitarProducto, disminuirCantidad, limpiarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  return context;
};
