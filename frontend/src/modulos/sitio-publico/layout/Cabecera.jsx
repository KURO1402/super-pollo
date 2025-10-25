import { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useAutenticacionGlobal } from "../../../app/estado-global/autenticacionGlobal";
import BarraNavegacion from "../componentes/BarraNavegacion";
import BotonIniciarSesion from "../componentes/BotonIniciarSesion";
import BotonRegistro from "../componentes/BotonRegistro";
import DropdownUsuario from "../componentes/usuario/DropdownUsuario";
import NombreEmpresa from "../../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../../assets/imagenes/Logo.svg";
import { ROLES } from "../../../app/constantes/roles";

const Cabecera = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const usuario = useAutenticacionGlobal((state) => state.usuario);
  const location = useLocation();

  // Determinar en qué área estamos
  const esAreaUsuario = location.pathname.startsWith('/usuario');
  const esAreaAdmin = location.pathname.startsWith('/admin');
  
  // Logo link dinámico
  const getLogoLink = () => {
    if (esAreaUsuario) return "/usuario";
    if (esAreaAdmin) return "/admin";
    return "/";
  };

  // Renderizar sección de usuario según el contexto
  const renderSeccionUsuario = () => {
    // Si hay usuario logueado Y es usuario normal (rol 3)
    if (usuario && usuario.idRol === ROLES.USUARIO) {
      return <DropdownUsuario usuario={usuario} />;
    }
    
    // Si no hay usuario Y estamos en sitio público (no admin)
    if (!usuario && !esAreaAdmin && !esAreaUsuario) {
      return (
        <>
          <BsPerson className="text-3xl text-gray-100" />
          <BotonIniciarSesion />
          <p className="flex items-center text-gray-100">/</p>
          <BotonRegistro />
        </>
      );
    }
    
    return null;
  };

  // Renderizar sección de usuario para móvil
  const renderSeccionUsuarioMobile = () => {
    if (usuario && usuario.idRol === ROLES.USUARIO) {
      return (
        <div className="flex flex-col items-center space-y-3">
          <span className="text-gray-100 font-medium">
            Hola, {usuario.nombresUsuario}
          </span>
          <DropdownUsuario usuario={usuario} mobile />
        </div>
      );
    }
    
    if (!usuario && !esAreaAdmin && !esAreaUsuario) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <BsPerson className="text-3xl text-gray-100" />
          <div className="flex space-x-3">
            <BotonIniciarSesion />
            <p className="flex items-center text-gray-100">/</p>
            <BotonRegistro />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-azul-secundario shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo y título */}
          <Link to={getLogoLink()} className="flex items-center space-x-3">
            <img
              src={NombreEmpresa}
              alt="SUPER POLLO"
              className="h-8 md:h-10 w-auto"
            />
            <img src={Logo} alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
          </Link>

          {/* Misma barra de navegación SIEMPRE (no cambia en área usuario) */}
          <div className="hidden lg:block flex-1 mx-8">
            <BarraNavegacion />
          </div>

          {/* Sección de usuario desktop - SOLO cambia aquí */}
          <div className="hidden lg:flex items-center space-x-3">
            {renderSeccionUsuario()}
          </div>

          {/* Botón menú móvil */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-100 hover:bg-azul-primario focus:outline-none"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú de navegación"
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu desplegable para móvil y tablet */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            menuAbierto
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 px-2 space-y-4 bg-azul-secundario border-t border-azul-primario">
            {/* Misma navegación móvil SIEMPRE */}
            <BarraNavegacion />

            {/* Sección de usuario móvil - SOLO cambia aquí */}
            <div className="flex flex-col space-y-3 pt-2">
              {renderSeccionUsuarioMobile()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cabecera;