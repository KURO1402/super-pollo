import { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import BarraNavegacion from "../componentes/BarraNavegacion";
import BotonIniciarSesion from "../componentes/BotonIniciarSesion";
import BotonRegistro from "../componentes/BotonRegistro";
import NombreEmpresa from "../../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../../assets/imagenes/Logo.svg";

const Cabecera = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-azul-secundario shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo y titulo */}
          <div className="flex items-center space-x-3">
            <img
              src={NombreEmpresa}
              alt="SUPER POLLO"
              className="h-8 md:h-10 w-auto"
            />
            <img src={Logo} alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          {/* Barra de navegación en la interfaz de escritorio*/}
          <div className="hidden lg:block flex-1 mx-8">
            <BarraNavegacion />
          </div>

          {/* Botones de usuario en la interfaz de escritorio */}
          <div className="hidden lg:flex items-center space-x-3">
            <BsPerson className="text-3xl text-gray-100" />
            <BotonIniciarSesion />
            <p className="flex items-center text-gray-100">/</p>
            <BotonRegistro />
          </div>

          {/* Botón menú, visible en móvil y tablet */}
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

        {/* Menu desplegable para movil y tablet  */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            menuAbierto
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 px-2 space-y-4 bg-azul-secundario border-t border-azul-primario">
            <BarraNavegacion />

            {/* Botones de usuario en movil */}
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center justify-center space-x-2">
                <BsPerson className="text-3xl text-gray-100" />
                <div className="flex space-x-3">
                  <BotonIniciarSesion />
                  <p className="flex items-center text-gray-100">/</p>
                  <BotonRegistro />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cabecera;