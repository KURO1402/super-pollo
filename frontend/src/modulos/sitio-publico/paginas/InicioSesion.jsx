import { useState } from 'react';
// Importa el componente del formulario de inicio de sesion
import FormularioInicioSesion from '../componentes/FormularioInicioSesion';
import { Link } from 'react-router-dom'; // Para navegar a registro

const InicioSesion = ()=> {
  // Estado para mostrar si el formulario está cargando, igual que el otro de registro
  const [estaCargando, setEstaCargando] = useState(false);

  //funcion que se ejecuta al enviar el formulario
  const manejarEnvioInicioSesion = async (datosFormulario) => {
    setEstaCargando(true); // activa el estade de carga
    
    try { 
      // Aqui iria la lógica para enviar los datos al servidor
      console.log('Datos del formulario de inicio de sesión:', datosFormulario);
      // notoficacion simple al usuario
      alert('¡Inicio de sesión exitoso!');
      
    } catch (error) {
      // manejo de errores
      console.error('Error en el inicio de sesión:', error);
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      //finaliza el estado de carga sin importar el resultado
      setEstaCargando(false);
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
              estaCargando={estaCargando}/// Estado de carga para mostrar loading
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