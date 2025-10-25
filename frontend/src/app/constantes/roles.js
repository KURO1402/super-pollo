export const ROLES = {
  SUPERADMIN: 1,
  ADMIN: 2,
  USUARIO: 3,
};

export const NOMBRES_ROLES = {
  [ROLES.SUPERADMIN]: 'Super Administrador',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.USUARIO]: 'Usuario',
};

/**
 * PERMISOS POR ROL
 * Define qué puede ver/hacer cada rol
 */
export const PERMISOS = {
  // SUPERADMIN - Acceso total
  [ROLES.SUPERADMIN]: {
    // Panel de administración
    accesoPanelAdmin: true,
    dashboard: true,
    usuarios: true,
    
    // Módulos principales
    ventas: true,
    generarVenta: true,
    historialVentas: true,
    
    stock: true,
    stockInsumos: true,
    historialEntradas: true,
    historialSalidas: true,
    gestionProductos: true,
    
    caja: true,
    cajaActual: true,
    historialCajas: true,
    
    reservas: true,
    calendarioReservas: true,
    historialReservas: true,
    
    // General
    perfil: true,
  },

  // ADMIN - Sin dashboard ni usuarios
  [ROLES.ADMIN]: {
    // Panel de administración
    accesoPanelAdmin: true,
    dashboard: false,
    usuarios: false,
    
    // Módulos principales
    ventas: true,
    generarVenta: true,
    historialVentas: true,
    
    stock: true,
    stockInsumos: true,
    historialEntradas: true,
    historialSalidas: true,
    gestionProductos: true,
    
    caja: true,
    cajaActual: true,
    historialCajas: true,
    
    reservas: true,
    calendarioReservas: true,
    historialReservas: true,
    
    // Generales
    perfil: true,
    reportes: false,
    configuracion: false,
  },

  // USUARIO - Solo área pública y reservas
  [ROLES.USUARIO]: {
    // Panel de administración
    accesoPanelAdmin: false,
    dashboard: false,
    usuarios: false,
    
    // Área pública
    accesoAreaUsuario: true,
    hacerReservas: true,
    verMisReservas: true,
    modificarReservas: true,
    cancelarReservas: true,
    
    // Generales
    perfil: true,
    reportes: false,
    configuracion: false,
  },
};

// RUTAS DE REDIRECCIÓN DESPUÉS DEL LOGIN

export const RUTAS_REDIRECCION = {
  [ROLES.SUPERADMIN]: '/admin',
  [ROLES.ADMIN]: '/admin/generar-venta',
  [ROLES.USUARIO]: '/usuario',
};

/**
 * Verificar si un usuario tiene un permiso específico
 * @param {number} idRol - ID del rol del usuario
 * @param {string} permiso - Nombre del permiso a verificar
 * @returns {boolean}
 */

export const tienePermiso = (idRol, permiso) => {
  return PERMISOS[idRol]?.[permiso] || false;
};

/**
 * Obtener nombre del rol
 * @param {number} idRol - ID del rol
 * @returns {string}
 */

export const obtenerNombreRol = (idRol) => {
  return NOMBRES_ROLES[idRol] || 'Desconocido';
};

/**
 * Obtener ruta de redirección según rol
 * @param {number} idRol - ID del rol
 * @returns {string}
 */

export const obtenerRutaRedireccion = (idRol) => {
  return RUTAS_REDIRECCION[idRol] || '/';
};

/**
 * Verificar si el usuario puede acceder al panel de admin
 * @param {number} idRol - ID del rol
 * @returns {boolean}
 */
export const puedeAccederPanelAdmin = (idRol) => {
  return tienePermiso(idRol, 'accesoPanelAdmin');
};
/**
 * Verificar si el usuario puede acceder al área de usuario
 * @param {number} idRol - ID del rol
 * @returns {boolean}
 */
export const puedeAccederAreaUsuario = (idRol) => {
  return tienePermiso(idRol, 'accesoAreaUsuario');
};