// librerías externas
import { Link, useNavigate, useLocation } from "react-router-dom"; // importamos Link para navegar a Inicio de Sesion
import { FaArrowLeft } from "react-icons/fa";
// hooks de ract
import { useEffect, useState } from "react";
// estado global
import { useAutenticacionGlobal } from "../../../app/estado-global/autenticacionGlobal";
// componentes internos
import FormularioRegistro from "../componentes/FormularioRegistro"; // importamos el formulario
import VerificacionCorreo from "../componentes/VerificacionCorreo";
import { mostrarAlerta } from "../../../utilidades/toastUtilidades";
import { ROLES } from "../../../app/constantes/roles";

const Registro = () => {
  // obtenemos la funcion de registrar del estado global
  const registrar = useAutenticacionGlobal((state) => state.registrar); 
  const carga = useAutenticacionGlobal((state) => state.carga);
  const error = useAutenticacionGlobal((state) => state.error);
  const limpiarError = useAutenticacionGlobal((state) => state.limpiarError);
  const verificarCorreo = useAutenticacionGlobal((state) => state.verificarCorreo);
  const validarCodigo = useAutenticacionGlobal((state) => state.validarCodigo);
  // hook de navegacion para redirigir despues del registro
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1);
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [correoVerificacion, setCorreoVerificacion] = useState('');
  // se activa cuando se da click al boton de crear cuenta en el formulario
  const handleRegistroSubmit = async (formularioData) => {
    try {
      // generar código de verificación
      await verificarCorreo(formularioData.correoUsuario);
      console.log("verificandoCorreo")
      // Guardar datos temporalmente y avanzar a verificación
      setDatosTemporales(formularioData);
      setCorreoVerificacion(formularioData.correoUsuario);
      setPaso(2);

      mostrarAlerta.info('Código de verificación enviado a tu correo');
    } catch (error) {
      // el error se maneja en el useEffect
    }
  };
  // ahora vamos a validar el código y completar el registro
  const handleCodigoValidado = async (codigo) => {
    console.log("handleCodigoValidado")
    try {
      // Validar código primero
      await validarCodigo({
        correo: correoVerificacion,
        codigo: codigo
      });
      
      // Si la verificación es exitosa, proceder con el registro
      const usuarioRegistrado = await registrar(datosTemporales);
      
      if (usuarioRegistrado) {
        mostrarAlerta.exito('¡Cuenta verificada y creada exitosamente!');
        if (usuarioRegistrado.idRol === ROLES.USUARIO) {
          navigate("/usuario", { replace: true });
        }
      }
    } catch (error) {
      // Error manejado por el useEffect existente
    }
  };

  // Función para reenviar código
  const handleReenviarCodigo = async () => {
    console.log("handleReenviarCodigo")
    try {
      await verificarCorreo(correoVerificacion);
      mostrarAlerta.info('Nuevo código enviado a tu correo');
    } catch (error) {
      // Error manejado por el useEffect existente
    }
  };

  // Volver al formulario
  const handleVolverAlFormulario = () => {
    console.log("handleVolverAlFormulario")
    setPaso(1);
    setDatosTemporales(null);
    setCorreoVerificacion('');
  };

  // mostrar alerta si hay error
  useEffect(() => {
      if (error) { // si existe algun error
        mostrarAlerta.error(error); // mostramos la alerta con el mensaje de error
        const timer = setTimeout(() => limpiarError(), 200); // limpiamos después de mostrar
        return () => clearTimeout(timer); // limpiamos el timeout
      }
    }, [error, limpiarError]); // dependencias del useEffect

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${paso === 2 ? 'max-w-2xl' : ''}`}>
        <div className="md:flex">
          {/* Parte izquierda (solo en paso 1) */}
          {paso === 1 && (
            <div className="hidden md:block md:w-2/5 bg-azul-primario p-12 text-white">
              <div className="flex flex-col h-full justify-center">
                <h2 className="text-3xl font-bold mb-6">
                  Forma parte de nuestro increíble equipo y diviértete con nosotros.
                </h2>
                <p className="text-gray-300">
                  Únete a nuestra comunidad y disfruta de los beneficios de ser parte de Super Pollo.
                </p>
                <div className="mt-10">
                  <div className="w-24 h-2 bg-yellow-400 mb-4"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contenido principal */}
          <div className={`w-full ${paso === 1 ? 'md:w-3/5' : 'md:w-full'} py-10 px-8`}>
            {paso === 1 ? (
              // Paso 1: Formulario de registro
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                  <p className="text-gray-600">Completa tus datos para registrarte</p>
                </div>
                
                <FormularioRegistro
                  alEnviar={handleRegistroSubmit}
                  estaCargando={carga}
                />
                
                <p className="mt-6 text-center text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/inicio-sesion" className="font-medium text-azul-primario hover:text-azul-secundario">
                    Inicia sesión aquí
                  </Link>
                </p>
              </>
            ) : (
              // Paso 2: Verificación de correo
              <>
                <div className="mb-6 text-center">
                  <button
                    onClick={handleVolverAlFormulario}
                    className="text-azul-primario hover:text-azul-secundario font-medium mb-4 flex items-center justify-center mx-auto"
                  >
                    <FaArrowLeft className="pr-2 text-2xl"/>
                     Volver al formulario
                  </button>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificación de Correo</h2>
                  <p className="text-gray-600">Completa la verificación para finalizar tu registro</p>
                </div>
                
                <VerificacionCorreo
                  correo={correoVerificacion}
                  onCodigoValidado={handleCodigoValidado}
                  onReenviarCodigo={handleReenviarCodigo}
                  estaCargando={carga}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registro;