// librerias externas
import { useForm } from 'react-hook-form';
// hook propios de react
import { useEffect } from 'react';

export const ModalEditarStock = ({ insumo, onClose, onGuardar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      nombreInsumo: '',
      categoria: '',
      stockActual: '',
      stockMinimo: '',
      unidadMedida: '',
      fechaActualizacion: '',
    }
  });

  console.log('Insumo recibido en modal:', insumo);

  // Cargar datos del insumo cuando se abre el modal
  useEffect(() => {
    if (insumo) {
      const now = new Date();
      const fechaActual = now.toISOString().split('T')[0];
      
      // Precargar todos los datos del insumo
      setValue('nombreInsumo', insumo.nombreInsumo || '');
      setValue('categoria', insumo.categoriaProducto || '');
      setValue('stockActual', insumo.stockActual || '');
      setValue('stockMinimo', insumo.stockMinimo || '');
      setValue('unidadMedida', insumo.unidadMedida || '');
      setValue('fechaActualizacion', fechaActual);
    }
  }, [insumo, setValue]);

  const onSubmit = (data) => {
    const datosCompletos = {
      ...data,
      idInsumo: insumo.idInsumo
    };
    
    console.log('Insumo actualizado:', datosCompletos);
    // Aquí iría la lógica para actualizar el insumo en el backend
    onGuardar(datosCompletos);
    reset();
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const stockActual = watch('stockActual');
  const stockMinimo = watch('stockMinimo');
  const unidadMedida = watch('unidadMedida');
  const nombreInsumo = watch('nombreInsumo');

  // Calcular estado del stock basado en los valores
  const calcularEstadoStock = () => {
    const actual = parseFloat(stockActual) || 0;
    const minimo = parseFloat(stockMinimo) || 0;
    
    if (minimo === 0) return 'Sin stock mínimo';
    if (actual === 0) return 'Stock Agotado';
    if (actual <= minimo * 0.3) return 'Stock Crítico';
    if (actual <= minimo) return 'Stock Bajo';
    if (actual <= minimo * 1.5) return 'Stock Normal';
    return 'Stock Óptimo';
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Stock Óptimo': return 'text-green-600 dark:text-green-400';
      case 'Stock Normal': return 'text-blue-600 dark:text-blue-400';
      case 'Stock Bajo': return 'text-yellow-600 dark:text-yellow-400';
      case 'Stock Crítico': return 'text-orange-600 dark:text-orange-400';
      case 'Stock Agotado': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getBgColorEstado = (estado) => {
    switch (estado) {
      case 'Stock Óptimo': return 'bg-green-100 dark:bg-green-900/30';
      case 'Stock Normal': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'Stock Bajo': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'Stock Crítico': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'Stock Agotado': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  // Opciones para los select
  const categorias = [
    { value: 'insumo', label: 'Insumo' },
    { value: 'bebida', label: 'Bebida' }
  ];

  const unidadesMedida = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'unidades', label: 'Unidades' },
    { value: 'paquetes', label: 'Paquetes' },
    { value: 'cajas', label: 'Cajas' }
  ];

  if (!insumo) return null;

  return (
    <div className="space-y-6">
      {/* Información del Insumo - Parte Superior */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          Editando Insumo: <span className="text-blue-900 dark:text-blue-100">{insumo.nombreInsumo}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Stock Actual:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200 font-medium">
              {insumo.stockActual} {insumo.unidadMedida}
            </span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">ID:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200">{insumo.idInsumo}</span>
          </div>
        </div>
      </div>

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
            placeholder="Ingrese el nombre del insumo"
            value={nombreInsumo}
            onChange={(e) => setValue('nombreInsumo', e.target.value)}
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
              {...register("categoria", { 
                required: "La categoría es requerida"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoria 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoria.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad de Medida *
            </label>
            <select
              {...register("unidadMedida", { 
                required: "La unidad de medida es requerida"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unidadMedida 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleccionar unidad...</option>
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

        {/* Stock Actual y Stock Mínimo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Actual *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                {...register("stockActual", { 
                  required: "El stock actual es requerido",
                  min: {
                    value: 0,
                    message: "El stock no puede ser negativo"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stockActual 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.0"
                value={stockActual}
                onChange={(e) => setValue('stockActual', e.target.value)}
              />
              {unidadMedida && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {unidadMedida}
                  </span>
                </div>
              )}
            </div>
            {errors.stockActual && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.stockActual.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Mínimo
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                {...register("stockMinimo", { 
                  min: {
                    value: 0,
                    message: "El stock mínimo no puede ser negativo"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stockMinimo 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.0 (opcional)"
                value={stockMinimo}
                onChange={(e) => setValue('stockMinimo', e.target.value)}
              />
              {unidadMedida && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {unidadMedida}
                  </span>
                </div>
              )}
            </div>
            {errors.stockMinimo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.stockMinimo.message}
              </p>
            )}
          </div>
        </div>

        {/* Fecha de Actualización */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fecha de Actualización *
          </label>
          <input
            type="date"
            {...register("fechaActualizacion", { required: "La fecha es requerida" })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fechaActualizacion 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.fechaActualizacion && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.fechaActualizacion.message}
            </p>
          )}
        </div>

        {/* Estado del Stock (Calculado) */}
        <div className={`p-4 rounded-lg border ${getBgColorEstado(calcularEstadoStock())}`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Estado del Stock:
          </h4>
          <p className={`text-lg font-bold ${getColorEstado(calcularEstadoStock())}`}>
            {calcularEstadoStock()}
          </p>
          {stockMinimo && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Stock actual: {stockActual} {unidadMedida} | 
              Mínimo: {stockMinimo} {unidadMedida}
            </p>
          )}
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
            Actualizar Insumo
          </button>
        </div>
      </form>
    </div>
  );
};