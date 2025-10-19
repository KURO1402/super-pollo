// components/ModalEntradaStock.jsx
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export const ModalEntradaStock = ({ entrada, onClose, onGuardar }) => {
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

  console.log('Insumo recibido en modal de entrada:', entrada);

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (entrada) {
      const now = new Date();
      const fechaActual = now.toISOString().split('T')[0];
      const horaActual = now.toTimeString().slice(0, 5);
      
      // Precargar datos automáticos
      setValue('fechaMovimiento', fechaActual);
      setValue('horaMovimiento', horaActual);
    }
  }, [entrada, setValue]);

  const onSubmit = (data) => {
    // Combinar fecha y hora en un solo campo datetime
    const fechaHoraMovimiento = `${data.fechaMovimiento}T${data.horaMovimiento}:00`;
    
    const datosCompletos = {
      idInsumo: entrada.idInsumo,
      cantidadMovimiento: parseFloat(data.cantidadMovimiento),
      tipoMovimiento: 'entrada',
      fechaMovimiento: fechaHoraMovimiento,
      detallesMovimiento: data.detallesMovimiento || null
    };
    
    console.log('Entrada de stock registrada:', datosCompletos);
    onGuardar(datosCompletos);
    reset();
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const cantidadMovimiento = watch('cantidadMovimiento');

  if (!entrada) return null;

  return (
    <div className="space-y-6">
      {/* Información del Insumo - Parte Superior */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
          Registrando Entrada: <span className="text-green-900 dark:text-green-100">{entrada.nombreInsumo}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-600 dark:text-green-400">Stock Actual:</span>
            <span className="ml-2 text-green-800 dark:text-green-200 font-medium">
              {entrada.stockActual} {entrada.unidadMedida}
            </span>
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Unidad:</span>
            <span className="ml-2 text-green-800 dark:text-green-200">{entrada.unidadMedida}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cantidad y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad a Ingresar *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register("cantidadMovimiento", { 
                  required: "La cantidad es requerida",
                  min: {
                    value: 0.01,
                    message: "La cantidad debe ser mayor a 0"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.cantidadMovimiento 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {entrada.unidadMedida}
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
              Fecha de Entrada *
            </label>
            <input
              type="date"
              {...register("fechaMovimiento", { required: "La fecha es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
              Hora de Entrada *
            </label>
            <input
              type="time"
              {...register("horaMovimiento", { required: "La hora es requerida" })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Detalles adicionales sobre esta entrada..."
          />
        </div>

        {/* Resumen de la Entrada */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            Resumen de la Entrada:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-green-600 dark:text-green-400">Stock actual:</span>
              <span className="ml-2 text-green-800 dark:text-green-200">{entrada.stockActual} {entrada.unidadMedida}</span>
            </div>
            <div>
              <span className="text-green-600 dark:text-green-400">Nuevo ingreso:</span>
              <span className="ml-2 text-green-800 dark:text-green-200">+{cantidadMovimiento || 0} {entrada.unidadMedida}</span>
            </div>
            <div className="col-span-2">
              <span className="text-green-600 dark:text-green-400">Stock resultante:</span>
              <span className="ml-2 text-green-800 dark:text-green-200 font-bold">
                {(parseFloat(entrada.stockActual) + parseFloat(cantidadMovimiento || 0)).toFixed(2)} {entrada.unidadMedida}
              </span>
            </div>
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
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            Registrar Entrada
          </button>
        </div>
      </form>
    </div>
  );
};