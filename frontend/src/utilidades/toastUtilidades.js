// src/utils/toastUtils.js

import { toast } from 'react-toastify';

// ALERTAS BÁSICAS
export const mostrarAlerta = {

  // Alerta de exito
  exito: (mensaje, opciones = {}) => {
    toast.success(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...opciones,
    });
  },
  // Alerta de error
  error: (mensaje, opciones = {}) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...opciones,
    });
  },
  //Alerta de advertencia
  advertencia: (mensaje, opciones = {}) => {
    toast.warning(mensaje, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...opciones,
    });
  },
  // Alerta de informacion
  info: (mensaje, opciones = {}) => {
    toast.info(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...opciones,
    });
  },

  // Alerta de carga
  promesa: (promesa, mensajes = {}) => {
    return toast.promise(
      promesa,
      {
        pending: mensajes.cargando || 'Procesando...',
        success: mensajes.exito || 'Operación exitosa',
        error: mensajes.error || 'Error en la operación',
      },
      {
        position: "top-right",
      }
    );
  },
};

// ALERTAS PARA OPERACIONES CRUD

export const alertasCRUD = {
  // Crear
  creado: (entidad = 'Registro') => {
    mostrarAlerta.exito(`${entidad} creado exitosamente`);
  },

  // Actualizar
  actualizado: (entidad = 'Registro') => {
    mostrarAlerta.exito(`${entidad} actualizado exitosamente`);
  },

  // Eliminar
  eliminado: (entidad = 'Registro') => {
    mostrarAlerta.exito(`${entidad} eliminado exitosamente`);
  },

  // Error genérico
  errorOperacion: (accion = 'realizar la operación') => {
    mostrarAlerta.error(`Error al ${accion}. Intente nuevamente`);
  },
};

// ALERTAS ESPECÍFICAS PARA POLLERÍA

export const alertasAdministrador = {
  // Ventas
  ventaRegistrada: (monto) => {
    mostrarAlerta.exito(`Venta registrada: S/ ${monto.toFixed(2)}`);
  },

  ventaCancelada: () => {
    mostrarAlerta.advertencia('Venta cancelada');
  },

  // Reservas
  reservaCreada: () => {
    mostrarAlerta.exito('Reserva creada exitosamente');
  },

  reservaActualizada: () => {
    mostrarAlerta.exito('Reserva actualizada');
  },

  reservaCancelada: () => {
    mostrarAlerta.info('Reserva cancelada');
  },

  mesaNoDisponible: () => {
    mostrarAlerta.advertencia('La mesa no está disponible en ese horario');
  },

  // Stock
  stockBajo: (producto) => {
    mostrarAlerta.advertencia(`Stock bajo: ${producto}`);
  },

  stockAgotado: (producto) => {
    mostrarAlerta.error(`Sin stock: ${producto}`);
  },

  stockActualizado: () => {
    mostrarAlerta.exito('Stock actualizado correctamente');
  },

  // Caja
  cajaAbierta: () => {
    mostrarAlerta.info('Caja aperturada correctamente');
  },

  cajaCerrada: (monto) => {
    mostrarAlerta.exito(`Caja cerrada - Total: S/ ${monto.toFixed(2)}`);
  },

  // Usuarios
  usuarioCreado: () => {
    mostrarAlerta.exito('Usuario creado exitosamente');
  },

  perfilActualizado: () => {
    mostrarAlerta.exito('Perfil actualizado');
  },

  contraseñaCambiada: () => {
    mostrarAlerta.exito('Contraseña cambiada exitosamente');
  },
};

// ==========================================
// ALERTAS DE VALIDACIÓN
// ==========================================

export const alertasValidacion = {
  campoRequerido: (campo) => {
    mostrarAlerta.advertencia(`El campo "${campo}" es requerido`);
  },

  formatoInvalido: (campo) => {
    mostrarAlerta.advertencia(`Formato inválido en "${campo}"`);
  },

  datosIncompletos: () => {
    mostrarAlerta.advertencia('Complete todos los campos requeridos');
  },

  rangoInvalido: (campo, min, max) => {
    mostrarAlerta.advertencia(`${campo} debe estar entre ${min} y ${max}`);
  },
};

// ALERTAS DE AUTENTICACIÓN

export const alertasAuth = {
  bienvenido: (nombre) => {
    mostrarAlerta.exito(`¡Bienvenido, ${nombre}!`, { autoClose: 2000 });
  },

  sesionCerrada: () => {
    mostrarAlerta.info('Sesión cerrada exitosamente', { autoClose: 2000 });
  },

  credencialesInvalidas: () => {
    mostrarAlerta.error('Usuario o contraseña incorrectos');
  },

  sesionExpirada: () => {
    mostrarAlerta.advertencia('Tu sesión ha expirado. Inicia sesión nuevamente');
  },

  sinPermisos: () => {
    mostrarAlerta.error('No tienes permisos para realizar esta acción');
  },
};

// ALERTAS DE RED
export const alertasRed = {
  sinConexion: () => {
    mostrarAlerta.error('Sin conexión a internet', {
      autoClose: false,
      closeButton: true,
    });
  },

  conexionRestablecida: () => {
    mostrarAlerta.info('Conexión restablecida', { autoClose: 2000 });
  },

  errorServidor: () => {
    mostrarAlerta.error('Error del servidor. Intente más tarde');
  },

  timeout: () => {
    mostrarAlerta.error('La solicitud tardó demasiado. Intente nuevamente');
  },
};

// ALERTA PERSONALIZADA

export const alertaPersonalizada = (contenido, tipo = 'default', opciones = {}) => {
  const tiposValidos = ['success', 'error', 'warning', 'info', 'default'];
  const tipoFinal = tiposValidos.includes(tipo) ? tipo : 'default';

  toast[tipoFinal](contenido, {
    position: "top-right",
    autoClose: 3000,
    ...opciones,
  });
};

// CONTROL DE TOASTS

export const controlarToasts = {
  cerrarTodos: () => {
    toast.dismiss();
  },

  cerrarUno: (toastId) => {
    toast.dismiss(toastId);
  },
};

// Exportación por defecto
export default mostrarAlerta;