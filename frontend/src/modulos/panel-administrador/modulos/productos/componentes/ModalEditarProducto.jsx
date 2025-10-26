import { useForm } from 'react-hook-form';
import mostrarAlerta from '../../../../../utilidades/toastUtilidades';
import { actualizarProductoServicio } from '../servicios/productoServicios';

export const ModalEditarProducto = ({ producto, onClose, onGuardar }) => {
  const {
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      nombreProducto: producto.nombreProducto,
      descripcionProducto: producto.descripcionProducto,
      precio: parseFloat(producto.precio),
    }
  });

  const onSubmit = async (data) => {
    try {
      // Preparar datos para el backend
      const datosActualizados = {
        nombreProducto: data.nombreProducto,
        descripcionProducto: data.descripcionProducto,
        precio: parseFloat(data.precio)
      };
      
      // Llamar al servicio de actualización
      await actualizarProductoServicio(producto.idProducto, datosActualizados);
      
      // Mostrar éxito
      mostrarAlerta.exito('Producto actualizado exitosamente');
      onGuardar(); // Recargar la lista
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre del Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            {...register("nombreProducto", { 
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Precio de Venta (S/) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("precio", { 
              required: "El precio es requerido",
              min: {
                value: 0.01,
                message: "El precio debe ser mayor a 0"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.precio 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.precio.message}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción del Producto
          </label>
          <textarea
            {...register("descripcionProducto")}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe brevemente el producto..."
          />
        </div>

        {/* Información de solo lectura */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Información del Producto
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-700 dark:text-blue-400">ID:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">{producto.idProducto}</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-400">Usa Insumos:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">
                {producto.usaInsumos === 1 ? 'Sí' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-400">Estado:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">
                {producto.estadoProducto === 1 ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};