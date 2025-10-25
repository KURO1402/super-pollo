import { create } from 'zustand'

// Datos temporales para desarrollo
const productosMenu = [
  { id: 1, nombre: "Pollo a la Brasa Familiar", precio: 45, categoria: "Platos Principales" },
  { id: 2, nombre: "Pollo a la Brasa Mediano", precio: 30, categoria: "Platos Principales" },
  { id: 3, nombre: "Papas Fritas Familiar", precio: 12, categoria: "Acompañamientos" },
  { id: 4, nombre: "Ensalada César", precio: 8, categoria: "Ensaladas" },
  { id: 5, nombre: "Gaseosa 1L", precio: 5, categoria: "Bebidas" },
  { id: 6, nombre: "Cerveza Artesanal", precio: 8, categoria: "Bebidas" },
  { id: 7, nombre: "Postre de Lucuma", precio: 6, categoria: "Postres" }
]

const mesasDisponibles = [
  { id: 1, numero: "Mesa 1", capacidad: 4, ubicacion: "Terraza" },
  { id: 2, numero: "Mesa 2", capacidad: 2, ubicacion: "Interior" },
  { id: 3, numero: "Mesa 3", capacidad: 6, ubicacion: "Jardín" },
  { id: 4, numero: "Mesa 4", capacidad: 4, ubicacion: "Interior" },
  { id: 5, numero: "Mesa 5", capacidad: 8, ubicacion: "Sala Privada" }
]

export const reservaEstadoGlobal = create((set, get) => ({
  // Estado
  pasoActual: 1,
  datos: {
    fecha: '',
    hora: '',
    personas: 2,
    mesa: '',
    productos: [],
    notas: ''
  },
  
  // Datos temporales
  productosMenu,
  mesasDisponibles,

  // Actions
  setPaso: (paso) => set({ 
    pasoActual: Math.max(1, Math.min(3, paso)) // Limitar entre 1-3
  }),
  
  updateDatos: (nuevosDatos) => set((state) => ({ 
    datos: { 
      ...state.datos, 
      ...nuevosDatos,
      // Asegurar que productos no se sobreescriba accidentalmente
      productos: nuevosDatos.productos !== undefined ? nuevosDatos.productos : state.datos.productos
    } 
  })),

  agregarProducto: (producto) => set((state) => {
    const existe = state.datos.productos.find(p => p.id === producto.id);
    
    if (existe) {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.map(p =>
            p.id === producto.id 
              ? { ...p, cantidad: (p.cantidad || 0) + 1 } 
              : p
          )
        }
      };
    } else {
      return {
        datos: {
          ...state.datos,
          productos: [...state.datos.productos, { 
            ...producto, 
            cantidad: 1 
          }]
        }
      };
    }
  }),

  quitarProducto: (productoId) => set((state) => ({
    datos: {
      ...state.datos,
      productos: state.datos.productos.filter(p => p.id !== productoId)
    }
  })),

  actualizarCantidad: (productoId, nuevaCantidad) => set((state) => {
    // Validar que nuevaCantidad sea un número válido
    const cantidad = Math.max(0, parseInt(nuevaCantidad) || 0);
    
    if (cantidad === 0) {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.filter(p => p.id !== productoId)
        }
      };
    } else {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.map(p =>
            p.id === productoId ? { ...p, cantidad } : p
          )
        }
      };
    }
  }),

  // Calculados
  getSubtotal: () => {
    const { datos } = get();
    return datos.productos.reduce((total, producto) => {
      const precio = producto.precio || 0;
      const cantidad = producto.cantidad || 0;
      return total + (precio * cantidad);
    }, 0);
  },

  getAnticipo: () => {
    const subtotal = get().getSubtotal();
    return Math.round(subtotal * 0.6 * 100) / 100; // 60% de anticipo, redondeado a 2 decimales
  },

  getTotal: () => {
    return get().getSubtotal();
  },

  // Helper para verificar si puede avanzar al paso 2
  puedeAvanzarPaso1: () => {
    const { datos } = get();
    return datos.fecha && datos.hora && datos.mesa && datos.personas > 0;
  },

  // Helper para verificar si puede avanzar al paso 3
  puedeAvanzarPaso2: () => {
    const { datos } = get();
    return datos.productos.length > 0;
  },

  // Reset para nueva reserva
  resetReserva: () => set({
    pasoActual: 1,
    datos: {
      fecha: '',
      hora: '',
      personas: 2,
      mesa: '',
      productos: [],
      notas: ''
    }
  })
}));