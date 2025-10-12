import { FiPlus, FiUsers } from "react-icons/fi";
import { useForm } from "react-hook-form";

import { Tabla } from '../componentes/tabla/Tabla';
import FilaUsuario from "../componentes/FilaUsuario";
import { BarraBusqueda } from "../componentes/busqueda-filtros/BarraBusqueda"; 
import { Paginacion } from "../componentes/tabla/Paginacion";

import { FiltroBusqueda } from "../componentes/busqueda-filtros/FiltroBusqueda";
import { useBusqueda } from "../hooks/useBusqueda"; 
import { useFiltro } from "../hooks/useFiltro";
import { usePaginacion } from "../hooks/usePaginacion";
import { useModal } from "../hooks/useModal";
import Modal from "../componentes/modal/Modal";

import { usuarios } from "../data-temporal/usuarios";

const Usuarios = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const { estaAbierto: modalUsuarioAbierto, abrir: abrirUsuario, cerrar: cerrarUsuario } = useModal();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(usuarios, [
    "nombre",
    "apellido",
    "correo",
    "rol",
    "telefono"
  ]);

  // Aplicar filtros por rol y estado
  filtrados = aplicarFiltros(filtrados, "rol");

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Mapear los usuarios para las filas de la tabla
  const filasUsuarios = datosPaginados.map((usuario) => (
    <FilaUsuario key={usuario.id} usuario={usuario} />
  ));

  const onSubmitUsuario = (data) => {
    // Aquí iría la lógica para guardar el usuario
    console.log("Datos del usuario:", data);
    cerrarUsuario();
    reset();
  };

  const opcionesRoles = [
    { value: "todos", label: "Todos los roles" },
    { value: "Superadministrador", label: "Superadministrador" },
    { value: "Administrador", label: "Administrador" },
    { value: "Cajero", label: "Cajero" },
    { value: "Usuario", label: "Usuario" }
  ];

  const opcionesEstados = [
    { value: "todos", label: "Todos los estados" },
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Administración y control de acceso al sistema
            </p>
          </div>
          <button
            onClick={abrirUsuario}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <BarraBusqueda
                valor={terminoBusqueda} 
                onChange={setTerminoBusqueda}
                placeholder="Buscar por nombre, apellido, correo o teléfono..."
              />
            </div>
            <div>
              <FiltroBusqueda
                valor={filtro}
                onChange={setFiltro} 
                opciones={opcionesRoles}
                label="Filtrar por rol"
              />
            </div>
            <div>
              <FiltroBusqueda
                valor={filtro}
                onChange={setFiltro} 
                opciones={opcionesEstados}
                label="Filtrar por estado"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lista de Usuarios
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({filtrados.length} usuarios encontrados)
            </span>
          </div>
        </div>

        {filtrados.length > 0 ? (
          <>
            <Tabla
              encabezados={["Usuario", "Información de Contacto", "Rol", "Estado", "Último Acceso", "Acciones"]}
              registros={filasUsuarios}
            />
            {totalPaginas > 1 && (
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                alCambiarPagina={setPaginaActual}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal para Nuevo/Editar Usuario */}
      <Modal
        estaAbierto={modalUsuarioAbierto}
        onCerrar={cerrarUsuario}
        titulo="Nuevo Usuario"
        tamaño="lg"
        mostrarHeader
        mostrarFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmitUsuario)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                {...register("nombre", { required: "El nombre es requerido" })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Ingresa el nombre"
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
                placeholder="Ingresa el apellido"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico *
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
                placeholder="usuario@empresa.com"
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
                type="tel"
                {...register("telefono")}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="+51 987 654 321"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol *
              </label>
              <select
                {...register("rol", { required: "El rol es requerido" })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Selecciona un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Cajero">Cajero</option>
                <option value="Vendedor">Vendedor</option>
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado *
              </label>
              <select
                {...register("estado", { required: "El estado es requerido" })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Selecciona un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña Temporal *
              </label>
              <input
                type="password"
                {...register("password", { 
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Ingresa una contraseña temporal"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                El usuario deberá cambiar esta contraseña en su primer acceso
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={cerrarUsuario}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Usuarios;