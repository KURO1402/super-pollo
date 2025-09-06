import { useForm } from 'react-hook-form';// manejar estados de componentes
import { yupResolver } from '@hookform/resolvers/yup'; // Importa el resolver de yup para integrarlo con react hook form
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone } from 'react-icons/fa'; // importamos iconos 

//importa componentes personalisados para los campos de entrada y checkbox
import CampoEntrada from './CampoEntrada';
import CampoCheckbox from './CampoCheckbox';
import CampoSelect from './CampoSelect'; // importamos nuestro componente reutilizable 

//Importa el esquema de validacion definido con Yup
import { registroValidacion } from '../validaciones/registroValidacion';
import { useEffect, useState } from 'react'; // manejo de estados

// datos de ejemplo, ya que esta informacion debe venir de la db
const tipoDocumentoEjemplo = [
  { valor: 'DNI' },
  { valor: 'Carnet de Extranjería' },
  { valor: 'Pasaporte' },
  { valor: 'RUC' }
];

// Función para obtener tipos de documento, en esta parte hiría la conexion a la API
const obtenerTiposDocumento = async () => {
  return tipoDocumentoEjemplo; // de vuelve los datos de prueba
};

// resive dos parametros que le enviamos en Registro.jxs
const FormularioRegistro = ({ alEnviar, estaCargando = false }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]); 
  //configura el formulario usando useForm 
  const {
    register, // registrar campos
    handleSubmit, // manejar el envio
    formState: { errors, isValid }, // errores y estado de validez
    reset, // para limpiar el formulario
  } = useForm({
    resolver: yupResolver(registroValidacion), // usamos la validación con yup
    mode: 'onChange' // Validación en tiempo real
  });

  // Funcion para cargar los tipos de documentos
  useEffect(() => {
    const cargarTiposDocumento = async () => {
      try {
        // guardamos los tipos de documentos optenidos de esa funcion
        const tipos = await obtenerTiposDocumento();
        // lo guardamos en su estado
        setTiposDocumento(tipos);
      } catch (error) {
        console.error('Error al cargar tipos de documento:', error);
        // En caso de error usar datos por defecto
        setTiposDocumento([
          { valor: 'DNI' }
        ]);
      }
    };
    // ejecutamos
    cargarTiposDocumento();
  }, []);

  // Funcion que se ejecuta cuando se envia el formulario
  const manejarEnvioFormulario = async (datos) => {
    try {
      await alEnviar(datos); // Llama a la función que recibe los datos (prop)
      reset(); // Limpia el formulario después del envío exitoso
    } catch (error) {
        // mostrar error si ocurre alguno
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    //renderizar el formulario
    <form onSubmit={handleSubmit(manejarEnvioFormulario)} className="space-y-6">
      {/* Grid para nombres y apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoEntrada
          id="nombresUsuario"
          nombre="nombresUsuario"
          etiqueta="Nombres"
          marcadorPosicion="Ingresa tus nombres"
          icono={FaUser}
          registro={register}
          error={errors.nombresUsuario}
        />
        
        <CampoEntrada
          id="apellidosUsuario"
          nombre="apellidosUsuario"
          etiqueta="Apellidos"
          marcadorPosicion="Ingresa tus apellidos"
          icono={FaUser}
          registro={register}
          error={errors.apellidosUsuario}
        />
      </div>
      
      {/* correo electrónico */}
      <CampoEntrada
        id="correoUsuario"
        nombre="correoUsuario"
        tipo="email"
        etiqueta="Correo Electrónico"
        marcadorPosicion="Ingresa tu correo electrónico"
        icono={FaEnvelope}
        registro={register}
        error={errors.correoUsuario}
      />
      
      {/* grid para contraseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoEntrada
          id="clave"
          nombre="clave"
          tipo="password"
          etiqueta="Contraseña"
          marcadorPosicion="Crea una contraseña"
          icono={FaLock}
          registro={register}
          error={errors.clave}
        />
        
        <CampoEntrada
          id="confirmarClave"
          nombre="confirmarClave"
          tipo="password"
          etiqueta="Confirmar Contraseña"
          marcadorPosicion="Confirma tu contraseña"
          icono={FaLock}
          registro={register}
          error={errors.confirmarClave}
        />
      </div>
      
      {/* grid para documento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoSelect
          id="tipoDocumentoUsuario"
          nombre="tipoDocumentoUsuario"
          etiqueta="Tipo de Documento"
          placeholder="Selecciona el tipo"
          opciones={tiposDocumento}
          icono={FaIdCard}
          registro={register}
          error={errors.tipoDocumentoUsuario}
        />
        
        <CampoEntrada
          id="numeroDocumentoUsuario"
          nombre="numeroDocumentoUsuario"
          etiqueta="Número de Documento"
          marcadorPosicion="Ingresa tu número de documento"
          icono={FaIdCard}
          registro={register}
          error={errors.numeroDocumentoUsuario}
        />
        
      </div>

      {/* input para agregar teléfono */}
      <CampoEntrada
        id="telefonoUsuario"
        nombre="telefonoUsuario"
        tipo="tel"
        etiqueta="Teléfono"
        marcadorPosicion="Ingresa tu número de teléfono"
        icono={FaPhone}
        registro={register}
        error={errors.telefonoUsuario}
      />

      
      {/* términos y condiciones */}
      <CampoCheckbox
        id="aceptoTerminos"
        nombre="aceptoTerminos"
        etiqueta={
          <>
            Acepto los{' '}
            <a href="#" className="text-azul-primario hover:underline">
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-azul-primario hover:underline">
              Política de Privacidad
            </a>
          </>
        }
        registro={register}
        error={errors.aceptoTerminos}
      />
      
      {/* botón de registro */}
      <div>
        <button
          type="submit"
          disabled={!isValid || estaCargando}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
            ${isValid && !estaCargando 
              ? 'bg-azul-primario hover:bg-azul-secundario text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-primario
          `}
        >
          {estaCargando ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creando cuenta...
            </div>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioRegistro;