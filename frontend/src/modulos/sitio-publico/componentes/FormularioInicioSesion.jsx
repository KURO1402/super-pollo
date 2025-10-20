import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEnvelope, FaLock } from 'react-icons/fa';

import CampoEntrada from './CampoEntrada';

// Importa el esquema de validación Yup
import { InicioSesionValidacion } from '../validaciones/InicioSesionValidacion';

const FormularioInicioSesion = ({ alEnviar, estaCargando = false }) => {  
  const {
    //se inicializa el formulario con useForm y yupResolver
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(InicioSesionValidacion), // validacion con yup
    mode: 'onChange' // Validación en tiempo real
  });

  //función que se ejecuta cuando se envis el formulario
  const manejarEnvioFormulario = async (datos) => {
    try {
      await alEnviar(datos);
      reset(); // Limpia el formulario después del envío exitoso
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvioFormulario)} className="space-y-6">
      {/* Correo electrónico */}
      <CampoEntrada
        id="email"
        nombre="email" // se cambio el name a email para que coincida con la validacion
        tipo="email"
        etiqueta="Correo Electrónico"
        marcadorPosicion="Ingresa tu correo electrónico"
        icono={FaEnvelope}
        registro={register}
        error={errors.email}
      />
      
      {/* Contraseña */}
      <CampoEntrada
        id="clave"
        nombre="clave"
        tipo="password"
        etiqueta="Contraseña"
        marcadorPosicion="Ingresa tu contraseña"
        icono={FaLock}
        registro={register}
        error={errors.clave}
      />
      
      {/* Boton de inicio de sesión */}
      <div>
        <button
          type="submit"
          disabled={!isValid || estaCargando} // Deshabilita si no es válido o si está cargando
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
            ${isValid && !estaCargando 
              ? 'bg-azul-primario hover:bg-azul-secundario text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-primario
          `}
        >
          {/* Muestra spinner si esta cargamdo o texto normal */}
          {estaCargando ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Iniciando sesión...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioInicioSesion;