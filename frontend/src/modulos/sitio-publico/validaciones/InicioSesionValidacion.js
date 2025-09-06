import * as yup from 'yup';

//define y exporta el esquema de validación para el formulario de inicio de sesión
export const InicioSesionValidacion = yup.object().shape({

  // validacion para el campo de correo electrónico
  correoUsuario: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),

  // validación para el campo de contraseña
  clave: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(1, 'La contraseña es obligatoria')
});