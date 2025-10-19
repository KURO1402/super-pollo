// components/ModalSalidaStock.jsx
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export const ModalSalidaStock = ({ salida, onClose, onGuardar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      cantidadMovimiento: '',
      fechaMovimiento: '',
      horaMovimiento: '',
      detallesMovimiento: ''
    }
  });

  console.log('Insumo recibido en modal de salida:', salida);

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (salida) {
      const now = new Date();
      const fechaActual = now.toISOString().split('T')[0];
      const horaActual = now.toTimeString().slice(0, 5);
      
      // Precargar datos automáticos
      setValue('fechaMovimiento', fechaActual);
      setValue('horaMovimiento', horaActual);
    }
  }, [salida, setValue]);

  const onSubmit = (data) => {
    // Combinar fecha y hora en un solo campo datetime
    const fechaHoraMovimiento = `${data.fechaMovimiento}T${data.horaMovimiento}:00`;
    
    const datosCompletos = {
      idInsumo: salida.idInsumo,
      cantidadMovimiento: parseFloat(data.cantidadMovimiento),
      tipoMovimiento: 'salida',
      fechaMovimiento: fechaHoraMovimiento,
      detallesMovimiento: data.detallesMovimiento || null
    };
    
    console.log('Salida de stock registrada:', datosCompletos);
    onGuardar(datosCompletos);
    reset();
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const cantidadMovimiento = watch('cantidadMovimiento');

  // Validar que no se retire más stock del disponible
  const validarCantidad = (value) => {
    const cantidad = parseFloat(value);
    const stockActual = parseFloat(salida.stockActual);
    
    if (isNaN(cantidad)) return "La cantidad es requerida";
    if (cantidad <= 0) return "La cantidad debe ser mayor a 0";
    if (cantidad > stockActual) return `No hay suficiente stock. Máximo disponible: ${stockActual}`;
    
    return true;
  };

  if (!salida) return null;

  return (
    <div className="space-y-6">
      {/* Información del Insumo - Parte Superior */}
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
          Registrando Salida: <span className="text-red-900 dark:text-red-100">{salida.nombreInsumo}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-red-600 dark:text-red-400">Stock Actual:</span>
            <span className="ml-2 text-red-800 dark:text-red-200 font-medium">
              {salida.stockActual} {salida.unidadMedida}
            </span>
          </div>
          <div>
            <span className="text-red-600 dark:text-red-400">Unidad:</span>
            <span className="ml-2 text-red-800 dark:text-red-200">{salida.unidadMedida}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cantidad y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad a Retirar *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={salida.stockActual}
                {...register("cantidadMovimiento", { 
                  validate: validarCantidad
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.cantidadMovimiento 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {salida.unidadMedida}
                </span>
              </div>
            </div>
            {errors.cantidadMovimiento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cantidadMovimiento.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Salida *
            </label>
            <input
              type="date"
              {...register("fechaMovimiento", { required: "La fecha es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.fechaMovimiento 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.fechaMovimiento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.fechaMovimiento.message}
              </p>
            )}
          </div>
        </div>

        {/* Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hora de Salida *
            </label>
            <input
              type="time"
              {...register("horaMovimiento", { required: "La hora es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.horaMovimiento 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.horaMovimiento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.horaMovimiento.message}
              </p>
            )}
          </div>
          
          {/* Espacio vacío para mantener el layout */}
          <div></div>
        </div>

        {/* Detalles/Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detalles / Observaciones
          </label>
          <textarea
            {...register("detallesMovimiento")}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Detalles adicionales sobre esta salida (ej: destino, motivo, etc.)..."
          />
        </div>

        {/* Resumen de la Salida */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
            Resumen de la Salida:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-red-600 dark:text-red-400">Stock actual:</span>
              <span className="ml-2 text-red-800 dark:text-red-200">{salida.stockActual} {salida.unidadMedida}</span>
            </div>
            <div>
              <span className="text-red-600 dark:text-red-400">Retiro:</span>
              <span className="ml-2 text-red-800 dark:text-red-200">-{cantidadMovimiento || 0} {salida.unidadMedida}</span>
            </div>
            <div className="col-span-2">
              <span className="text-red-600 dark:text-red-400">Stock resultante:</span>
              <span className={`ml-2 font-bold ${
                (parseFloat(salida.stockActual) - parseFloat(cantidadMovimiento || 0)) < 0 
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {(parseFloat(salida.stockActual) - parseFloat(cantidadMovimiento || 0)).toFixed(2)} {salida.unidadMedida}
              </span>
            </div>
            {(parseFloat(salida.stockActual) - parseFloat(cantidadMovimiento || 0)) < 0 && (
              <div className="col-span-2 mt-2 p-2 bg-red-100 dark:bg-red-800/50 rounded border border-red-200 dark:border-red-700">
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                    Advertencia: El stock resultante será negativo
                </span>
              </div>
            )}
          </div>
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Registrar Salida
          </button>
        </div>
      </form>
    </div>
  );
};