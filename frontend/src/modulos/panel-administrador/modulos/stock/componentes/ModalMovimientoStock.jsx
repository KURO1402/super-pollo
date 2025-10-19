// librerías externas
import { useForm } from 'react-hook-form';
// hook de react
import { useEffect } from 'react';

export const ModalMovimientoStock = ({ onClose, onGuardar }) => { // recibe las funciones para cerrar y guardar
  const {
    register, handleSubmit, formState: { errors }, reset, setValue, watch // funciones de react-hook-form
  } = useForm({
    defaultValues: {
      insumo: '',
      tipoMovimiento: 'entrada',
      cantidad: '',
      fecha: '',
      hora: '',
      detalle: ''
    }
  });

  // Establecer fecha y hora actual por defecto
  useEffect(() => {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    const horaActual = now.toTimeString().slice(0, 5);
    
    setValue('fecha', fechaActual);
    setValue('hora', horaActual);
  }, [setValue]);
  // función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    console.log('Movimiento registrado:', data);
    // Aquí iría la lógica para guardar el movimiento en el backend
    onGuardar();
    reset();
  };
  // función para cancelar y cerrar el modal
  const handleCancelar = () => {
    reset();
    onClose();
  };

  // Data temporal de insumos (debería venir del backend)
  const insumosDisponibles = [
    { id: 1, nombre: 'Pollo entero', unidad: 'kg' },
    { id: 2, nombre: 'Papas', unidad: 'kg' },
    { id: 3, nombre: 'Lechuga', unidad: 'kg' },
    { id: 4, nombre: 'Tomate', unidad: 'kg' },
    { id: 5, nombre: 'Coca Cola 500ml', unidad: 'unidades' },
    { id: 6, nombre: 'Inca Kola 500ml', unidad: 'unidades' },
    { id: 7, nombre: 'Arroz', unidad: 'kg' },
    { id: 8, nombre: 'Aceite vegetal', unidad: 'l' }
  ];

  const tipoMovimiento = watch('tipoMovimiento'); // observar el tipo de movimiento

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selección de Insumo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Insumo *
          </label>
          <select
            {...register("insumo", { 
              required: "Seleccione un insumo",
              validate: value => value !== "" || "Seleccione un insumo"
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.insumo 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Seleccionar insumo...</option>
            {insumosDisponibles.map(insumo => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nombre} ({insumo.unidad})
              </option>
            ))}
          </select>
          {errors.insumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.insumo.message}
            </p>
          )}
        </div>

        {/* Tipo de Movimiento y Cantidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Movimiento *
            </label>
            <select
              {...register("tipoMovimiento", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="entrada" className="text-green-600">Entrada</option>
              <option value="salida" className="text-red-600">Salida</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("cantidad", { 
                required: "La cantidad es requerida",
                min: {
                  value: 0.01,
                  message: "La cantidad debe ser mayor a 0"
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cantidad 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.cantidad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cantidad.message}
              </p>
            )}
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha del Movimiento *
            </label>
            <input
              type="date"
              {...register("fecha", { required: "La fecha es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fecha 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.fecha.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hora del Movimiento *
            </label>
            <input
              type="time"
              {...register("hora", { required: "La hora es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.hora 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.hora && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.hora.message}
              </p>
            )}
          </div>
        </div>

        {/* Detalle del Movimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detalle del Movimiento *
          </label>
          <textarea
            {...register("detalle", { 
              required: "El detalle es requerido",
              minLength: {
                value: 5,
                message: "El detalle debe tener al menos 5 caracteres"
              }
            })}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.detalle 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Describe el motivo del movimiento (compra, venta, ajuste, etc.)"
          />
          {errors.detalle && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.detalle.message}
            </p>
          )}
        </div>

        {/* Resumen del Movimiento */}
        <div className={`p-4 rounded-lg border ${
          tipoMovimiento === 'entrada' 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
        }`}>
          <h4 className={`font-semibold ${
            tipoMovimiento === 'entrada' 
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            Resumen del Movimiento:
          </h4>
          <p className={`text-sm mt-1 ${
            tipoMovimiento === 'entrada' 
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {tipoMovimiento === 'entrada' ? '+ Entrada' : '- Salida'} de stock
          </p>
        </div>

        {/* Botones de acción */}
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
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            Registrar Movimiento
          </button>
        </div>
      </form>
    </div>
  );
};