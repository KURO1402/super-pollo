import * as yup from 'yup';

//define y exporta el esquema de validación para el formulario de inicio de sesión
export const InicioSesionValidacion = yup.object().shape({

  // solo se le cambio el nombre al campo de correo para que coincida con el name del input
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),

  // validación para el campo de contraseña
  clave: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(1, 'La contraseña es obligatoria')
});