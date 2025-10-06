
import { useForm } from "react-hook-form";
import { obtenerTiposDocumento } from "../../sitio-publico/servicios/tiposDocService";
import { useEffect, useState } from "react";

const FormularioEditUsuario = ({ usuario, onSubmit, cerrar }) => {
    const [tiposDocumento, setTiposDocumento] = useState([]);
    // elementos de react-hook-fom
    const{
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm();
    // cuando el usuario de cargue se reseteara el contonido del usuario
    useEffect(() => {
        if (usuario) {
            reset(usuario);
        }
    }, [usuario, reset]);

    // cargar tipos de documento desde el servicio existente
    useEffect(() => {
        const fetchTiposDocumento = async () => {
        try {
            const data = await obtenerTiposDocumento();
            setTiposDocumento(data);
        } catch (error) {
            console.error("Error al obtener tipos de documento:", error);
        }
        };
        fetchTiposDocumento();
    }, []);

    return ( 
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  {...register("nombre", { required: "El nombre es requerido" })}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Ingresa tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  {...register("apellido", { required: "El apellido es requerido" })}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Ingresa tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Documento *
                </label>
                <select
                  {...register("tipoDocumento", { required: "Selecciona un tipo de documento" })}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Seleccione</option>
                  {tiposDocumento.map((tipo) => (
                    <option key={tipo.idTipoDocumento} value={tipo.nombreTipoDocumento}>
                      {tipo.nombreTipoDocumento}
                    </option>
                  ))}
                </select>
                {errors.tipoDocumento && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipoDocumento.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  {...register("numeroDocumento", { 
                    required: "El número de documento es requerido",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números"
                    }
                  })}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Ingresa tu número de documento"
                />
                {errors.numeroDocumento && (
                  <p className="mt-1 text-sm text-red-600">{errors.numeroDocumento.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo *
                </label>
                <input
                  type="email"
                  {...register("correo", { 
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido"
                    }
                  })}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Ingresa tu correo electrónico"
                />
                {errors.correo && (
                  <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  {...register("telefono")}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Ingresa tu teléfono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={cerrar}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
     );
}
 
export default FormularioEditUsuario;