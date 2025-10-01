// Importa el componente del formulario de inicio de sesion
import FormularioInicioSesion from '../componentes/FormularioInicioSesion';
import { Link, useNavigate } from 'react-router-dom'; // Para navegar a registro
// Importamos el estado global de autenticacion
import { useAutenticacionGlobal } from '../../../app/estado-global/autenticacionGlobal';

const InicioSesion = ()=> {
  const login = useAutenticacionGlobal((state) => state.login); // obtenemos la funcion de login del estado global
  const carga = useAutenticacionGlobal((state) => state.carga); // obtenemos el estado de carga del estado global
  const error = useAutenticacionGlobal((state) => state.error); // obtenemos el estado de error del estado global
  const navigate = useNavigate(); // hook de navegacion para redirigir despues del login

  //funcion que se ejecuta al enviar el formulario
  const manejarEnvioInicioSesion = async (datosFormulario) => {
    console.log('Datos del formulario de inicio de sesión:', datosFormulario);
    const usuarioLogueado = await login(datosFormulario); // llamamos a la funcion de login del estado global
    // si el usuario se logueo correctamente
    if (usuarioLogueado){
      if (usuarioLogueado.idRol === 1) {
        navigate("/superadmin"); // redirige a la zona de admin
      } else if (usuarioLogueado.idRol === 2) {
        navigate("/admin"); // redirige a la zona de admin
      } else {
        navigate("/usuario"); // redirige a la zona de usuarios
      }
    }
  };

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
            {/* mostrar el error si existe mejorar más adelante el estilo*/}
            {error && (
              <p className="mt-4 text-center text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InicioSesion;