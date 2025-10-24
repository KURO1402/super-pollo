// librerías externas
import { Link, useNavigate, useLocation } from "react-router-dom"; // importamos Link para navegar a Inicio de Sesion
// hooks de ract
import { useEffect } from "react";
// estado global
import { useAutenticacionGlobal } from "../../../app/estado-global/autenticacionGlobal";
// componentes internos
import FormularioRegistro from "../componentes/FormularioRegistro"; // importamos el formulario
import { mostrarAlerta } from "../../../utilidades/toastUtilidades";
import { ROLES } from "../../../app/constantes/roles";

const Registro = () => {
  // obtenemos la funcion de registrar del estado global
  const registrar = useAutenticacionGlobal((state) => state.registrar); 
  const carga = useAutenticacionGlobal((state) => state.carga);
  const error = useAutenticacionGlobal((state) => state.error);
  const limpiarError = useAutenticacionGlobal((state) => state.limpiarError);
  // hook de navegacion para redirigir despues del registro
  const navigate = useNavigate()
  // se activa cuando se da click al boton de crear cuenta en el formulario
  const handleRegistroSubmit = async (formularioData) => {
    const usuarioRegistrado = await registrar(formularioData); // llamamos a la funcion de registro del estado global
    // si el usuario se registro correctamente
    if (usuarioRegistrado){
      // Mensaje de exito
      mostrarAlerta.exito(
        `¡Bienvenido! Tu cuenta ha sido creada exitosamente.`
      );
      // los usuarios registrados por defecto tienen rol USUARIO (3)
      // por lo tanto, siempre redirigen a la landing page
      if (usuarioRegistrado.idRol === ROLES.USUARIO) {
        // Usuario normal va al landing
        navigate("/", { replace: true });
      };
    }
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
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
            {/* Parte derecha del formulario */}
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
          
          {/* Formulario de registro */}
          <div className="w-full md:w-3/5 py-10 px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
              <p className="text-gray-600">Completa tus datos para registrarte</p>
            </div>
            {/* Usar el componente formulario para el registro */}
            <FormularioRegistro
             // Enviamos como props el handleRegistroSubmit y el estado de Carga 
              alEnviar={handleRegistroSubmit} 
              estaCargando={carga}
            />
            
            <p className="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                {/* Agregamos Link para ir al otro formulario */}
                <Link to="/inicio-sesion" className="font-medium text-azul-primario hover:text-azul-secundario">
                    Inicia sesión aquí
                </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registro;