import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaRegEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import BotonSecundario from "./BotonSecundario";
import NombreEmpresa from "../../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../../assets/imagenes/Logo.svg";
import UbicacionMapa from "../../../assets/imagenes/UbicacionMapa.png";

// array de iconos sociales
const socialIconos = [
  { icon: <FaFacebook size={16} />, href: "#" },
  { icon: <FaInstagram size={16} />, href: "#" },
  { icon: <FaXTwitter size={16} />, href: "#" },
];

// array de enlaces de navegación
const navEnlaces = [
  { nombre: "Inicio", href: "#introduccion" },
  { nombre: "Sobre nosotros", href: "#nosotros" },
  { nombre: "Menú", href: "#menu" },
  { nombre: "Reservar", href: "#reservaciones" },
  { nombre: "Trabaja con nosotros", href: "#contacto" },
];

const PiePagina = () => {
  return (
    <footer className="w-full bg-azul-secundario">
      {/* Sección amarilla de información de contacto */}
      <div className="bg-amarillo py-8 px-12 rounded-2xl mx-20 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-gray-800 text-xl mr-2" />
              <h3 className="font-bold text-lg text-gray-800">DIRECCIÓN</h3>
            </div>
            <p className="text-white">JR. ICA NRO 324 JUNIN - HUANCAYO</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-3">
              <FaRegEnvelope className="text-gray-800 text-xl mr-2" />
              <h3 className="font-bold text-lg text-gray-800">CORREO</h3>
            </div>
            <p className="text-white">Super@gmail.com</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-3">
              <FaPhoneAlt className="text-gray-800 text-xl mr-2" />
              <h3 className="font-bold text-lg text-gray-800">TELÉFONO</h3>
            </div>
            <p className="text-white">987654321</p>
          </div>
        </div>
      </div>

      {/* Sección principal del footer */}
      <div className="bg-azul-secundario text-white py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Super Pollo Logo" className="h-20 mr-3" />
              <img src={NombreEmpresa} alt="SUPER POLLO" className="h-10" />
            </div>
            <div className="w-20 h-1 bg-red-500 mb-4"></div>
            <p className="mb-6 text-gray-300">
              Somos el lugar donde el mejor pollo a la brasa se disfruta entre
              risas, familia y buenos momentos que siempre querrás repetir.
            </p>
            {/* Iconos sociales */}
            <div className="flex space-x-4">
              {socialIconos.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="bg-gray-700 text-white rounded-full p-3 hover:bg-gray-100 hover:text-gray-800 transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col">
            <h3 className="text-gray-100 text-xl font-semibold mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
              UBICACIÓN
            </h3>
            <img src={UbicacionMapa} alt="" />
          </div>

          {/* Navegación */}
          <div className="flex flex-col">
            <h3 className="text-gray-100 text-xl font-semibold mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
              NAVEGACIÓN
            </h3>

            {/* enlaces */}
            <ul className="space-y-2 mt-2">
              {navEnlaces.map((enlace, index) => (
                <li key={index}>
                  <a href={enlace.href} className="flex items-center hover:text-yellow-400 transition text-gray-300">
                    <MdKeyboardDoubleArrowRight className="text-yellow-400 text-2xl mr-2" />
                    {enlace.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Atención y registro */}
          <div className="flex flex-col">
            <h3 className="text-gray-100 text-xl font-semibold mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
              ATENCIÓN
            </h3>
            <p className="my-4 text-gray-300">
              Lunes - Domingo
              <br />
              10 am - 9 pm
            </p>
            <BotonSecundario> Registrarse </BotonSecundario>
          </div>
        </div>
      </div>

      {/* Sección de copyright */}
      <div className="bg-red-600 text-white py-4 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p>
            © {new Date().getFullYear()} Super Pollo. Todos los derechos
            reservados.
          </p>
          <div className="mt-2">
            <a href="#" className="hover:underline mx-2">
              Términos y Condiciones
            </a>
            <a href="#" className="hover:underline mx-2">
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;
