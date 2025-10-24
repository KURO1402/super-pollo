// librerías externas
import { useForm } from 'react-hook-form';
import { alertasCRUD } from '../../../../../utilidades/toastUtilidades';
import { crearInsumoServicio } from '../servicios/insumosServicios';

export const ModalNuevoInsumo = ({ onClose, onGuardar }) => { // recibe las funciones para cerrar y guardar
  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm({
    defaultValues: {
      nombreInsumo: '',
      unidadMedida: '',
      stockInsumo: '',
      categoriaProducto: '',
    }
  });
  // funcion que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    const stockInsumoDecimal = parseFloat(data.stockInsumo);

    // Verificar si la conversión fue exitosa
    if (isNaN(stockInsumoDecimal)) {
      alertasCRUD.error('El valor de stock no es válido');
      return;
    }
    // Actualizar el valor de stockInsumo a número
    data.stockInsumo = stockInsumoDecimal;

    try {
      await crearInsumoServicio(data);
      alertasCRUD.creado();
      onGuardar();
      reset();
    } catch (error) {
      console.error("Error al crear un nuevo producto", error);
      alertasCRUD.error("Error al crear el insumo");
    }
  };
  // funcion para cancelar y cerrar el modal
  const handleCancelar = () => {
    reset();
    onClose();
  };

  const unidadesMedida = [
    { value: '', label: 'Seleccionar unidad' },
    { value: 'Kilogramos', label: 'Kilogramos (kg)' },
    { value: 'Gramos', label: 'Gramos (g)' },
    { value: 'Litros', label: 'Litros (l)' },
    { value: 'Mililitros', label: 'Mililitros (ml)' },
    { value: 'Unidades', label: 'Unidades' },
    { value: 'Paquetes', label: 'Paquetes' },
    { value: 'Cajas', label: 'Cajas' }
  ];

  const categorias = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'insumo', label: 'Insumo' },
    { value: 'bebida', label: 'Bebida' }
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre del Insumo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Insumo *
          </label>
          <input
            type="text"
            {...register("nombreInsumo", { 
              required: "El nombre es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreInsumo 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Pollo entero, Papas, Coca Cola"
          />
          {errors.nombreInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.nombreInsumo.message}
            </p>
          )}
        </div>

        {/* Categoría y Unidad de Medida */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              {...register("categoriaProducto", { 
                required: "La categoría es requerida",
                validate: value => value !== "" || "Seleccione una categoría"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoriaProducto 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.categoriaProducto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoriaProducto.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad de Medida *
            </label>
            <select
              {...register("unidadMedida", { 
                required: "La unidad de medida es requerida",
                validate: value => value !== "" || "Seleccione una unidad"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unidadMedida 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {unidadesMedida.map(unidad => (
                <option key={unidad.value} value={unidad.value}>
                  {unidad.label}
                </option>
              ))}
            </select>
            {errors.unidadMedida && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.unidadMedida.message}
              </p>
            )}
          </div>
        </div>

        {/* Stock Actual */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Actual *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("stockInsumo", { 
                required: "El stock actual es requerido",
                min: {
                  value: 0,
                  message: "El stock no puede ser negativo"
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.stockInsumo 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.stockInsumo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.stockInsumo.message}
              </p>
            )}
        </div>

        {/* Descripcion*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            {...register("descripcion")}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Descripción adicional del insumo..."
          />
        </div>

        {/* Botones de accion */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            Guardar Insumo
          </button>
        </div>
      </form>
    </div>
  );
};