import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiUser, FiFileText, FiBriefcase} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import Modal from "../../../componentes/modal/Modal";
import { useModal } from "../../../hooks/useModal"
import FormularioEditUsuario from "../componentes/FormularioEditUsuario";
import CampoInfo from "../../../componentes/CampoInfo";
import { BotonSimple } from "../../../componentes/botones/BotonSimple";
import InputContraseñaEditable from "../componentes/InputContraseñaEditable";


const Perfil = () => {
  const [usuario, setUsuario] = useState(null); //estado para guardar la info del usuario
  const { estaAbierto, abrir, cerrar } = useModal(); // de nuestro hook modal
  useEffect(() => {
    const fetchUsuario = async () => {
      const respuesta = {
        nombre: "Juan",
        apellido: "Pérez Casas",
        tipoDocumento: "DNI",
        numeroDocumento: "12345678",
        correo: "juan@example.com",
        telefono: "987654321",
        rol: "Admin",
        clave: "123123abc"
      };
      setUsuario(respuesta);
    };

    fetchUsuario();
  }, []);

  //función para subir los datos, aqui se debe cambiar para mandar al backend
  const onSubmit = async (data) => {
    try {
      setUsuario(data);
      cerrar();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };
  // hallar las iniciales 
  const getIniciales = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  if (!usuario) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 dark:text-gray-400">Cargando perfil...</p>
    </div>
  );

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mt-0 mb-1 leading-tight ">Perfil</h1>
        <FaRegUser className="text-2xl mb-2 text-gray-800 dark:text-gray-100" />
      </div>

      {/* Header del Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-white">
                  {getIniciales(usuario.nombre, usuario.apellido)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {usuario.nombre} {usuario.apellido}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  <span>{usuario.rol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{usuario.correo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiPhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-medium text-gray-900 dark:text-white">{usuario.telefono}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-left">
            Información personal
          </h2>
          <BotonSimple
            funcion={abrir}
            etiqueta="Editar"
            icono={GoPencil}
          />
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <CampoInfo 
                  icono={FiUser}
                  etiqueta="Nombre"
                  valor={usuario.nombre}
                />
                <CampoInfo 
                  icono={FiUser}
                  etiqueta="Apellido"
                  valor={usuario.apellido}
                />
              </div>
              <CampoInfo 
                icono={FiMail}
                etiqueta="Correo electrónico"
                valor={usuario.correo}
              />
              <CampoInfo 
                icono={FiPhone}
                etiqueta="Teléfono"
                valor={usuario.telefono}
              />
            </div>
            {/* Columna Derecha */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <CampoInfo 
                  icono={FiFileText}
                  etiqueta="Tipo de documento"
                  valor={usuario.tipoDocumento}
                />
                <CampoInfo 
                  icono={FiFileText}
                  etiqueta="Número de documento"
                  valor={usuario.numeroDocumento}
                />
              </div>
              <CampoInfo 
                icono={FiBriefcase}
                etiqueta="Rol Usuario"
                valor={usuario.rol}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contraseña
                </label>
                <InputContraseñaEditable usuario={usuario} setUsuario={setUsuario} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Edición */}
      <Modal
        estaAbierto={estaAbierto}
        onCerrar={cerrar}
        titulo="Editar Perfil"
        tamaño="xl"
        mostrarHeader
        mostrarFooter={false}
      >
        <FormularioEditUsuario
          usuario={usuario}
          onSubmit={onSubmit}
          cerrar={cerrar}
        />
      </Modal>
    </div>
  );
};

export default Perfil;