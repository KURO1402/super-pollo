// librerías externas
import { useForm } from 'react-hook-form';
import { FiUpload, FiX } from 'react-icons/fi';

export const ModalNuevoProducto = ({ onClose, onGuardar }) => { // recibe las funciones para cerrar y guardar
  const {
    register, handleSubmit, formState: { errors }, watch, setValue, reset
  } = useForm({
    defaultValues: {
      nombre: '',
      categoria: '',
      precio: '',
      estado: 'Disponible',
      descripcion: '',
      imagen: null
    }
  });
  // esta funcion se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    console.log('Producto guardado:', data);
    // Aquí iría la lógica para guardar el producto en el backend
    onGuardar();
    reset();
  };
  // funcción para cancelar y cerrar el modal
  const handleCancelar = () => {
    reset();
    onClose();
  };
  // funcion para manejar el cambio de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('imagen', file);
    }
  };

  const imagenActual = watch('imagen'); // observar el campo de imagen 
  // categorias de productos
  const categorias = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'Platos principales', label: 'Platos principales' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Entradas', label: 'Entradas' },
    { value: 'Postres', label: 'Postres' },
    { value: 'Acompañamientos', label: 'Acompañamientos' }
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Producto *
            </label>
            <input
                type="text"
                {...register("nombre", { 
                required: "El nombre es requerido",
                minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres"
                }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombre 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ej: Pollo a la Brasa 1/4"
            />
            {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nombre.message}
                </p>
            )}
        </div>

        {/* Categoría y Precio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              {...register("categoria", { 
                required: "La categoría es requerida",
                validate: value => value !== "" || "Seleccione una categoría"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoria 
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
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoria.message}
              </p>
            )}
          </div>
          
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
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado del Producto *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Disponible"
                {...register("estado", { required: "Seleccione un estado" })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Disponible</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="No disponible"
                {...register("estado")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">No disponible</span>
            </label>
          </div>
          {errors.estado && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.estado.message}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción del Producto
          </label>
          <textarea
            {...register("descripcion")}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe brevemente el producto..."
          />
        </div>

        {/* Imagen del Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen del Producto
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (MAX. 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImagenChange}
              />
            </label>
          </div>
          {imagenActual && (
            <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm text-green-700 dark:text-green-300">
                {imagenActual.name}
              </span>
              <button
                type="button"
                onClick={() => setValue('imagen', null)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Botones de accoón */}
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
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};