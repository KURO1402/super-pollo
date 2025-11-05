import { create } from 'zustand'
import { obtenerMesasDisponiblesServicio } from '../servicios/reservacionesServicio';

export const reservaEstadoGlobal = create((set, get) => ({
  // Estado
  pasoActual: 1,
  datos: {
    fecha: '',
    hora: '',
    personas: 2,
    mesa: '',
    productos: [],
  },
  
  productosMenu: [],
  mesasDisponibles: [],
  cargandoMesas: false,
  errorMesas: null,

  setPaso: (paso) => set({ 
    pasoActual: Math.max(1, Math.min(3, paso)) 
  }),
  setProductosMenu: (producto) => set({ productoMenu : producto}),
  
  updateDatos: (nuevosDatos) => set((state) => ({ 
    datos: { 
      ...state.datos, 
      ...nuevosDatos,
      productos: nuevosDatos.productos !== undefined ? nuevosDatos.productos : state.datos.productos
    } 
  })),

  buscarMesasDisponibles: async (fecha, hora) => {
    if (!fecha || !hora) {
      set({ 
        mesasDisponibles: [],
        errorMesas: 'Fecha y hora son requeridas'
      });
      return;
    }

    set({ cargandoMesas: true, errorMesas: null });
    
    try {
      const respuesta = await obtenerMesasDisponiblesServicio(fecha, hora);
      
      const mesasTransformadas = respuesta.mesas.map(mesa => ({
        id: mesa.idMesa,
        numero: `Mesa ${mesa.numeroMesa}`,
        capacidad: mesa.capacidad
      }));

      set({ 
        mesasDisponibles: mesasTransformadas,
        cargandoMesas: false,
        errorMesas: null
      });

    } catch (error) {
      set({ 
        mesasDisponibles: [],
        cargandoMesas: false,
        errorMesas: error.message || 'Error al cargar mesas disponibles'
      });
    }
  },

  limpiarMesas: () => set({ 
    mesasDisponibles: [],
    datos: { ...get().datos, mesa: '' }
  }),

  agregarProducto: (producto) => set((state) => {
    const existe = state.datos.productos.find(p => p.idProducto === producto.idProducto);
    
    if (existe) {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.map(p =>
            p.idProducto === producto.idProducto 
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
      productos: state.datos.productos.filter(p => p.idProducto !== productoId)
    }
  })),

  actualizarCantidad: (productoId, nuevaCantidad) => set((state) => {
    const cantidad = Math.max(0, parseInt(nuevaCantidad) || 0);
    
    if (cantidad === 0) {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.filter(p => p.idProducto !== productoId)
        }
      };
    } else {
      return {
        datos: {
          ...state.datos,
          productos: state.datos.productos.map(p =>
            p.idProducto === productoId ? { ...p, cantidad } : p
          )
        }
      };
    }
  }),

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
    return Math.round(subtotal * 0.5 * 100) / 100; 
  },

  getTotal: () => {
    return get().getSubtotal();
  },

  puedeAvanzarPaso1: () => {
    const { datos } = get();
    return datos.fecha && datos.hora && datos.mesa && datos.personas > 0;
  },

  puedeAvanzarPaso2: () => {
    const { datos } = get();
    return datos.productos.length > 0;
  },

  resetReserva: () => set({
    pasoActual: 1,
    datos: {
      fecha: '',
      hora: '',
      personas: 2,
      mesa: '',
      productos: [],
    }
  })
}));