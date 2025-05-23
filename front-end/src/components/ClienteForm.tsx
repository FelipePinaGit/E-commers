import { useState, useEffect } from 'react';
import { Cliente, createCliente, updateCliente } from '../services/clienteService';

interface ClienteFormProps {
  cliente: Cliente | null;
  onClose: () => void;
  onSaved: (saved: boolean) => void;
}

const ClienteForm = ({ cliente, onClose, onSaved }: ClienteFormProps) => {
  // Estado local para el formulario, inicializado con cliente o vacío para nuevo
  const [formData, setFormData] = useState<Cliente>({
    rut: '',
    nombre: '',
    calle: '',
    numero: 0,
    ciudad: '',
    telefonos: [''],
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cuando cambia el cliente (editar), cargo los datos en el formulario
  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      // Si es nuevo cliente, limpio el formulario
      setFormData({
        rut: '',
        nombre: '',
        calle: '',
        numero: 0,
        ciudad: '',
        telefonos: [''],
      });
    }
    setError(null);
  }, [cliente]);

  // Maneja cambios en inputs normales
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero' ? Number(value) : value,
    }));
  };

  // Maneja cambio en teléfonos (array)
  const handleTelefonoChange = (index: number, value: string) => {
    const nuevosTelefonos = [...formData.telefonos];
    nuevosTelefonos[index] = value;
    setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
  };

  // Agrega un campo nuevo para teléfono
  const handleAddTelefono = () => {
    setFormData(prev => ({ ...prev, telefonos: [...prev.telefonos, ''] }));
  };

  // Quita un teléfono por índice
  const handleRemoveTelefono = (index: number) => {
    const nuevosTelefonos = formData.telefonos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
  };

  // Guardar cliente (nuevo o editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (cliente) {
        // Actualizar
        await updateCliente(cliente.rut, formData);
      } else {
        // Crear nuevo
        await createCliente(formData);
      }
      onSaved(true);
    } catch (err) {
      console.error(err);
      setError('Error al guardar el cliente. Revisa los datos e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-md shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-3">
          <label className="block font-semibold mb-1">RUT:</label>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            disabled={!!cliente} // no se puede cambiar el rut al editar
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Calle:</label>
          <input
            type="text"
            name="calle"
            value={formData.calle}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Número:</label>
          <input
            type="number"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            min={0}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Teléfonos:</label>
          {formData.telefonos.map((tel, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={tel}
                onChange={e => handleTelefonoChange(idx, e.target.value)}
                className="flex-grow border rounded px-2 py-1"
                required
              />
              {formData.telefonos.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTelefono(idx)}
                  className="ml-2 text-red-600 font-bold"
                  aria-label="Eliminar teléfono"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTelefono}
            className="text-blue-600 underline mt-1"
          >
            + Agregar teléfono
          </button>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
