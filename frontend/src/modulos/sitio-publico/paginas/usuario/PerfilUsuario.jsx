import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiUser, FiFileText, FiShield } from "react-icons/fi";
import { FaRegUser, FaCrown } from "react-icons/fa";
import { GoPencil } from "react-icons/go";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);

  // Datos de ejemplo - mismo formato que el perfil original
  useEffect(() => {
    const fetchUsuario = async () => {
      const respuesta = {
        nombre: "Juan",
        apellido: "Pérez Casas",
        tipoDocumento: "DNI",
        numeroDocumento: "12345678",
        correo: "juan@example.com",
        telefono: "987654321",
        clave: "123123abc"
      };
      setUsuario(respuesta);
    };

    fetchUsuario();
  }, []);

  const getIniciales = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  if (!usuario) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rojo"></div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Estilo Sitio Público */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            MI <span className="text-rojo">PERFIL</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestiona tu información personal y mantén tus datos actualizados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tarjeta de Perfil Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-azul-secundario to-azul-primario py-8 px-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <span className="text-4xl font-bold text-white">
                      {getIniciales(usuario.nombre, usuario.apellido)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amarillo rounded-full p-2 shadow-lg">
                    <FaCrown className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mt-6 mb-2">
                  {usuario.nombre} {usuario.apellido}
                </h2>
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <FiShield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">Usuario</span>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-colors">
                  <div className="w-12 h-12 bg-rojo/10 rounded-xl flex items-center justify-center">
                    <FiMail className="w-6 h-6 text-rojo" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white truncate">
                      {usuario.correo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-colors">
                  <div className="w-12 h-12 bg-azul-primario/10 rounded-xl flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-azul-primario" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="font-semibold text-white">
                      {usuario.telefono}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Principal */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
              
              {/* Header de Información Personal */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-6 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Información Personal
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Actualiza y gestiona tus datos personales
                    </p>
                  </div>
                  <button className="flex items-center cursor-pointer gap-2 bg-rojo hover:bg-rojo/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    <GoPencil className="w-4 h-4" />
                    Editar Perfil
                  </button>
                </div>
              </div>

              {/* Campos de Información */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Columna Izquierda */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-azul-primario" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Nombre
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {usuario.nombre}
                        </p>
                      </div>

                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-azul-primario" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Apellido
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {usuario.apellido}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-rojo/10 rounded-lg flex items-center justify-center">
                          <FiMail className="w-5 h-5 text-rojo" />
                        </div>
                        <label className="text-sm font-semibold text-gray-400">
                          Correo Electrónico
                        </label>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {usuario.correo}
                      </p>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-yellow-600" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Tipo Doc.
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {usuario.tipoDocumento}
                        </p>
                      </div>

                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-yellow-600" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            N° Documento
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {usuario.numeroDocumento}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-azul-primario/5 to-azul-secundario/5 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-azul-primario/20 rounded-lg flex items-center justify-center">
                          <FiShield className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-sm font-semibold text-gray-400">
                          Contraseña
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-white">
                          ••••••••••
                        </p>
                        <button className="text-white hover:text-gray-300 font-semibold text-sm transition-colors">
                          Cambiar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfilUsuario;