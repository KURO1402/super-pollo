import { FiSave, FiX, FiLoader, FiUser, FiPhone } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { actualizarUsuarioServicio, obtenerUsuarioPorIdServicio } from "../servicios/usuariosServicios";
import mostrarAlerta from "../../../../../utilidades/toastUtilidades";

export const ModalEditarUsuario = ({ idUsuario, onClose, onUsuarioActualizado }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Cargar datos del usuario cuando cambia el idUsuario
  useEffect(() => {
    if (idUsuario) {
      cargarUsuario();
    }
  }, [idUsuario]);

  const cargarUsuario = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerUsuarioPorIdServicio(idUsuario);
      
      if (respuesta.ok && respuesta.usuario) {
        const usuarioData = respuesta.usuario;
        setUsuario(usuarioData);
        
        // Precargar solo los campos editables en el formulario
        reset({
          nombresUsuario: usuarioData.nombresUsuario || '',
          apellidosUsuario: usuarioData.apellidosUsuario || '',
          numeroDocumentoUsuario: usuarioData.numeroDocumentoUsuario || '',
          telefonoUsuario: usuarioData.telefonoUsuario || '',
          idTipoDocumento: usuarioData.idTipoDocumento?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      mostrarAlerta.error("Error al cargar los datos del usuario");
      onClose();
    } finally {
      setCargando(false);
    }
  };

  const onSubmitUsuario = async (data) => {
    try {
      setGuardando(true);
      
      // Preparar datos para enviar - solo los campos editables
      const datosActualizados = {
        nombresUsuario: data.nombresUsuario,
        apellidosUsuario: data.apellidosUsuario,
        numeroDocumentoUsuario: data.numeroDocumentoUsuario,
        telefonoUsuario: data.telefonoUsuario,
        idTipoDocumento: parseInt(data.idTipoDocumento)
      };

      // Llamar al servicio para actualizar
      const respuesta = await actualizarUsuarioServicio(idUsuario, datosActualizados);
      
      if (respuesta.ok) {
        mostrarAlerta.exito("Usuario actualizado exitosamente");
        
        // Llamar al callback con los datos actualizados
        if (onUsuarioActualizado) {
          onUsuarioActualizado({
            ...usuario,
            ...datosActualizados
          });
        }
        
        onClose();
      } else {
        throw new Error(respuesta.mensaje || "Error al actualizar usuario");
      }
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      mostrarAlerta.error(error.message || "Error al actualizar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitUsuario)} className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiUser size={14} className="text-blue-600 dark:text-blue-400" />
              Nombres *
            </div>
          </label>
          <input
            type="text"
            {...register("nombresUsuario", { 
              required: "Los nombres son requeridos",
              minLength: {
                value: 2,
                message: "Los nombres deben tener al menos 2 caracteres"
              }
            })}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ingresa los nombres"
            disabled={guardando}
          />
          {errors.nombresUsuario && (
            <p className="mt-1 text-sm text-red-600">{errors.nombresUsuario.message}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Apellidos *
          </label>
          <input
            type="text"
            {...register("apellidosUsuario", { 
              required: "Los apellidos son requeridos",
              minLength: {
                value: 2,
                message: "Los apellidos deben tener al menos 2 caracteres"
              }
            })}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ingresa los apellidos"
            disabled={guardando}
          />
          {errors.apellidosUsuario && (
            <p className="mt-1 text-sm text-red-600">{errors.apellidosUsuario.message}</p>
          )}
        </div>

        {/* Tipo de Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              Tipo de Documento *
            </div>
          </label>
          <select
            {...register("idTipoDocumento", { required: "El tipo de documento es requerido" })}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            disabled={guardando}
          >
            <option value="">Selecciona un tipo</option>
            <option value="1">DNI</option>
            <option value="2">Pasaporte</option>
            <option value="3">Carné de extranjería</option>
            <option value="4">RUC</option>
          </select>
          {errors.idTipoDocumento && (
            <p className="mt-1 text-sm text-red-600">{errors.idTipoDocumento.message}</p>
          )}
        </div>

        {/* Número de Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Documento *
          </label>
          <input
            type="text"
            {...register("numeroDocumentoUsuario", { 
              required: "El número de documento es requerido",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números"
              },
              minLength: {
                value: 8,
                message: "El documento debe tener al menos 8 caracteres"
              }
            })}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ingresa el número de documento"
            disabled={guardando}
          />
          {errors.numeroDocumentoUsuario && (
            <p className="mt-1 text-sm text-red-600">{errors.numeroDocumentoUsuario.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiPhone size={14} className="text-amber-600 dark:text-amber-400" />
              Teléfono
            </div>
          </label>
          <input
            type="tel"
            {...register("telefonoUsuario", {
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Ingresa un número de teléfono válido"
              },
              minLength: {
                value: 9,
                message: "El teléfono debe tener al menos 9 caracteres"
              }
            })}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="+51 987 654 321"
            disabled={guardando}
          />
          {errors.telefonoUsuario && (
            <p className="mt-1 text-sm text-red-600">{errors.telefonoUsuario.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Formato: +51 987 654 321
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          disabled={guardando}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardando ? (
            <>
              <FiLoader className="animate-spin" size={16} />
              Guardando...
            </>
          ) : (
            <>
              <FiSave size={16} />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ModalEditarUsuario;