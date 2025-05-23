import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Producto, createProducto, updateProducto } from '../services/productoService';

interface ProductoFormProps {
  producto?: Producto | null;
  proveedores: { id: number; nombre: string }[];
  categorias: { id: number; nombre: string }[];
  onClose: () => void;
  onSaved: (saved: boolean) => void;
}

const ProductoForm = ({ producto, proveedores, categorias, onClose, onSaved }: ProductoFormProps) => {
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: '',
    precioActual: 0,
    stock: 0,
    proveedorId: 0,
    categoriaId: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        precioActual: producto.precioActual,
        stock: producto.stock,
        proveedorId: producto.proveedorId,
        categoriaId: producto.categoriaId,
      });
    } else {
      setFormData({
        nombre: '',
        precioActual: 0,
        stock: 0,
        proveedorId: 0,
        categoriaId: 0,
      });
    }
    setErrors({});
    setApiError(null);
  }, [producto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = ['precioActual', 'stock', 'proveedorId', 'categoriaId'].includes(name)
      ? Number(value)
      : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if ((formData.precioActual ?? 0) <= 0) newErrors.precioActual = 'El precio debe ser mayor a 0';
    if ((formData.stock ?? 0) < 0) newErrors.stock = 'El stock no puede ser negativo';
    if ((formData.proveedorId ?? 0) <= 0) newErrors.proveedorId = 'Debe seleccionar un proveedor';
    if ((formData.categoriaId ?? 0) <= 0) newErrors.categoriaId = 'Debe seleccionar una categoría';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (producto && producto.id) {
        // Editar producto
        await updateProducto(producto.id, formData as Producto);
      } else {
        // Crear nuevo producto
        await createProducto(formData as Producto);
      }
      onSaved(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Cerrar formulario">
            <X className="h-6 w-6" />
          </button>
        </div>

        {apiError && (
          <div className="m-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center" role="alert">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Precio</label>
            <input
              type="number"
              name="precioActual"
              value={formData.precioActual}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.precioActual && <p className="text-red-500 text-sm">{errors.precioActual}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Proveedor</label>
            <select
              name="proveedorId"
              value={formData.proveedorId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value={0}>Seleccionar...</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errors.proveedorId && <p className="text-red-500 text-sm">{errors.proveedorId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value={0}>Seleccionar...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && <p className="text-red-500 text-sm">{errors.categoriaId}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {producto ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;
