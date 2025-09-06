import { useState } from "react"; // importamos useState para el manejo del estado de Carga
import FormularioRegistro from "../componentes/FormularioRegistro"; // importamos el formulario
import { Link } from "react-router-dom"; // importamos Link para navegar a Inicio de Sesion

const Registro = () => {
    // manejo del estado de Carga para bloquear el formulario mientras se envian los datos, empieza el false
  const [estaCargando, setEstaCargando] = useState(false);

  // se activa cuando se da click al boton de crear cuenta en el formulario
  const handleRegistroSubmit = async (formularioData) => {
    //activa el estado de carga para bloquear otros envios 
    setEstaCargando(true);
    
    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Datos del formulario:', formularioData); // mostrar los datos obtenidos por consola

    } catch (error) {
        // mostrar el error
      console.error('Error en el registro:', error);
      alert('Error al crear la cuenta. Por favor, intenta nuevamente.');
    } finally {
        //cambiar el estado de carga a false 
      setEstaCargando(false);
    }
  };

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
              estaCargando={estaCargando}
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