// components/ModalEditarProducto.jsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

export const ModalEditarProducto = ({ producto, onClose, onGuardar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      nombreProducto: '',
      categoria: '',
      precio: '',
      estado: 'disponible',
      descripcion: ''
    }
  });

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (producto) {
      setValue('nombreProducto', producto.nombre || '');
      setValue('categoria', producto.categoria || '');
      setValue('precio', producto.precio.toFixed(2) || '');
      setValue('estado', producto.estado?.toLowerCase() || 'disponible');
      setValue('descripcion', producto.descripcion || '');
    }
  }, [producto, setValue]);

  const onSubmit = (data) => {
    const datosActualizados = {
      ...producto,
      ...data,
      precio: `S/${parseFloat(data.precio).toFixed(2)}`
    };
    onGuardar(datosActualizados);
  };

  const handleCancelar = () => {
    onClose();
  };

  // Opciones predefinidas para categorías de restaurante
  const categorias = [
    'Platos principales',
    'Entradas',
    'Bebidas',
    'Postres',
    'Ensaladas',
    'Sopas',
    'Especialidades',
    'Combos',
    'Acompañamientos'
  ];

  if (!producto) return null;

  return (
    <div className="space-y-6">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              {...register("nombreProducto", { 
                required: "El nombre del producto es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres"
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombreProducto 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ej: Pollo a la Brasa 1/4"
            />
            {errors.nombreProducto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nombreProducto.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              {...register("categoria", { 
                required: "La categoría es requerida"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoria 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoria.message}
              </p>
            )}
          </div>
        </div>

        {/* Precio y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio (S/) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register("precio", { 
                  required: "El precio es requerido",
                  min: {
                    value: 0.01,
                    message: "El precio debe ser mayor a 0"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.precio 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  S/
                </span>
              </div>
            </div>
            {errors.precio && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.precio.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado *
            </label>
            <select
              {...register("estado", { 
                required: "El estado es requerido"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.estado 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="disponible">Disponible</option>
              <option value="no disponible">No disponible</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.estado.message}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Descripción del producto (opcional)..."
          />
        </div>
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};