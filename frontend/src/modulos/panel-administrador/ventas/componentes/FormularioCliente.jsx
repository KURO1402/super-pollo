import { useForm } from "react-hook-form";
// formulario para el cliente, que resibe como parametro la función de submit y oncancelar
export const FormularioCliente = ({ onSubmit, onCancelar }) => {
  // funciones de react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // enviamos los datos registrados o insertados
  const manejarEnviar = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(manejarEnviar)} className="space-y-4">
      {/* Primera fila: Tipo Documento y numero */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Documento *
          </label>
          <select
            {...register("tipoDocumento", { required: "Este campo es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">DNI</option>
            <option value="4">Carnet de Extranjería</option>
            <option value="6">RUC</option>
            <option value="7">Pasaporte</option>
          </select>
          {errors.tipoDocumento && (
            <span className="text-xs text-red-500">{errors.tipoDocumento.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Número de Documento *
          </label>
          <input
            type="text"
            {...register("numeroDocumento", { 
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el número de documento"
          />
          {errors.numeroDocumento && (
            <span className="text-xs text-red-500">{errors.numeroDocumento.message}</span>
          )}
        </div>
      </div>

      {/* Segunda fila: Nombre y Nombre Comercial */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre / Razón Social *
          </label>
          <input
            type="text"
            {...register("nombre", { required: "Este campo es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre completo o razón social"
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre Comercial
          </label>
          <input
            type="text"
            {...register("nombreComercial")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre comercial (opcional)"
          />
        </div>
      </div>

      {/* Tercera fila: Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección
        </label>
        <input
          type="text"
          {...register("direccion")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dirección completa"
        />
      </div>

      {/* Cuarta fila: Teléfono y Correo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            {...register("telefono", {
              pattern: {
                value: /^[0-9+-\s]+$/,
                message: "Formato de teléfono inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Número de teléfono"
          />
          {errors.telefono && (
            <span className="text-xs text-red-500">{errors.telefono.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  );
};