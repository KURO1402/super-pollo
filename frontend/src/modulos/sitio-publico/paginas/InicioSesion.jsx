// librerías externas
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Para navegar a registro
// hook de react
import { useEffect } from 'react';
// Importamos el estado global de autenticacion
import { useAutenticacionGlobal } from '../../../app/estado-global/autenticacionGlobal';
// componentes internos
import FormularioInicioSesion from '../componentes/FormularioInicioSesion';
// utilidades y constantes
import { mostrarAlerta } from '../../../utilidades/toastUtilidades';
import { obtenerRutaRedireccion } from '../../../app/constantes/roles';

const InicioSesion = ()=> {
  const { login, carga, error, limpiarError, usuario } = useAutenticacionGlobal(); // obtenemos varias cosas del estado global}
  const navigate = useNavigate(); // hook de navegacion para redirigir despues del login
  const location = useLocation(); // obtenemos la ubicacion actual  

  //funcion que se ejecuta al enviar el formulario
  const manejarEnvioInicioSesion = async (datosFormulario) => {
    const usuarioLogueado = await login(datosFormulario); // llamamos a la funcion de login del estado global
    // si el usuario se logueo correctamente
    if (usuarioLogueado){
      // Obtener la ruta de redirección según su rol
      const rutaDestino = obtenerRutaRedireccion(usuarioLogueado.idRol);
      
      // Si venía de algún lugar específico
      const from = location.state?.from?.pathname;
      
      // Mensaje de bienvenida personalizado
      mostrarAlerta.exito('¡Bienvenido de nuevo!');
      
      // Redirigir a donde corresponde o de donde venía
      if (from && from !== '/inicio-sesion') {
        navigate(from, { replace: true });
      } else {
        navigate(rutaDestino, { replace: true });
      }
    }
  };
  // mostrar alerta si hay error 
  useEffect(() => {
    if (error) {
      mostrarAlerta.error(error); // mostramos la alerta con el mensaje de error 
      const timer = setTimeout(() => limpiarError(), 200); // limpiamos después de mostrar
      return () => clearTimeout(timer); // limpiamos el timeout al desmontar
    }
  }, [error, limpiarError]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Seccion principal */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Sección lateral */}
          <div className="hidden md:block md:w-2/5 bg-azul-primario p-12 text-white">
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold mb-6">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-300">
                Accede a tu cuenta para disfrutar de todos los beneficios de Super Pollo.
              </p>
              <div className="mt-10">
                <div className="w-24 h-2 bg-yellow-400 mb-4"></div>
              </div>
            </div>
          </div>
          
          {/* Formulario de inicio de sesión */}
          <div className="w-full md:w-3/5 py-10 px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa a tu cuenta</p>
            </div>
            
            <FormularioInicioSesion 
              alEnviar={manejarEnvioInicioSesion}  // función a ejecutar al enviar
              estaCargando={carga}/// Estado de carga para mostrar loading
            />
            {/* enlace para registrase si no tiene cuenta */} 
            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="font-medium text-azul-primario hover:text-azul-secundario">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InicioSesion;