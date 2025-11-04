import * as yup from 'yup'; // Importa todas las funcionalidades de la librería yup

// definimos y exportamos el esquema de validación para el formulario de registro
export const registroValidacion = yup.object().shape({
  // validacion para el campo "nombresUsuario"
  nombresUsuario: yup
    .string() //debe ser una cadena de texto
    .required('Los nombres son obligatorios') //no puede estar vacío
    .min(2, 'Los nombres deben tener al menos 2 caracteres') //minimo 2 caracteres
    .max(50, 'Los nombres no pueden exceder 50 caracteres') // y un maximo 50 caracteres
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras'), //solo letras y espacios, ademaás de contar con soporte para acentos
  
  // Validación para el campo "apellidosUsuario"
  apellidosUsuario: yup
    .string()
    .required('Los apellidos son obligatorios')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),
  
  //validación para el campo "correoUsuario"
  correoUsuario: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')//debe ser un correo válido
    .max(100, 'El correo no puede exceder 100 caracteres'),// limite de caracteres

  //validación para el campo "clave" 
  clave: yup
  .string()
  .required('La contraseña es obligatoria')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña no puede exceder 50 caracteres')
  .test( // se usa para crear una validacion personalizada 
    'clave segura', // nombre de la prueba
    'La contraseña no cumple con los requisitos mínimos', // mensaje de error genérico
    function (value) { // funcion para realizar las validaciones
      const errors = []; // array para ir guardando los errores
      if (!value) return false; // Ya se controla con .required
      // validar que al menos tenga una minuscula
      if (!/[a-z]/.test(value)) {
        errors.push('Debe incluir al menos una letra minúscula.');
      } // debe tener al menos una mayuscula
      if (!/[A-Z]/.test(value)) {
        errors.push('Debe incluir al menos una letra mayúscula.');
      } // debe tener al menos un numero
      if (!/\d/.test(value)) {
        errors.push('Debe incluir al menos un número.');
      } // el caracter especial
      if (errors.length > 0) {
        return this.createError({ message: errors.join(' ') });
      }
      // validacion exitosa xd
      return true;
    }
  ),
  
  // Validacion para confirmar que la contraseña coincide
  confirmarClave: yup
    .string()
    .required('Debes confirmar tu contraseña')
    .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden'), // debe ser igual a "clave'
  
  // validacion para el select se cambio a number para que retorne el id del tipo de documento
  idTipoDocumento: yup
    .number()
    .required('El tipo de documento es obligatorio')
    .typeError('Debe seleccionar un tipo de documento'), // para manejar el error cuando no se selecciona ningun valor
   
  /// validacion para el campo numeroDocumentoUsuario'
  numeroDocumentoUsuario: yup
    .string()
    .required('El número de documento es obligatorio')
    .matches(/^\d{8,12}$/, 'El documento debe contener entre 8 y 12 dígitos'), // Solo digitos, entre 8 y 12
  
  // Validación para el campo "telefonoUsuario"
  telefonoUsuario: yup
    .string()
    .required('El número de teléfono es obligatorio')
    .matches(/^[+]?[\d\s\-()]{8,15}$/, 'Ingresa un número de teléfono válido'), //permite números, espacios, guiones, parentesis y signo "+"
  
  //validación para el checkbox "aceptoTerminos"
  aceptoTerminos: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones') // solo acepta el valor de true como válidd
});