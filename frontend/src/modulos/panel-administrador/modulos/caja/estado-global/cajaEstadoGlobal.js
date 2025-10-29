// stores/useCajaStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const cajaEstadoGlobal = create(
  persist( // para percistir los datos aun que se cambie de página 
    (set, get) => ({
      // Estado inicial
      caja: {
        idCaja: null,
        estado: "cerrada",
        saldoInicial: 0,
        saldoActual: 0,
        ingresos: 0,
        egresos: 0,
        movimientos: []
      },
      loading: false,
      error: null,
      // función para calcular totales de los movimientos
      calcularTotales: (movimientos) => {
        let ingresos = 0;
        let egresos = 0;
        
        movimientos.forEach(movimiento => {
          if (movimiento.tipoMovimiento === 'Ingreso') {
            ingresos += parseFloat(movimiento.montoMovimiento) || 0;
          } else if (movimiento.tipoMovimiento === 'Egreso') {
            egresos += parseFloat(movimiento.montoMovimiento) || 0;
          }
        });

        return { ingresos, egresos };
      },

      // acciones para setear la caja, manejar los diferentes servicios
      setCaja: (cajaData) => set({ 
        caja: { ...get().caja, ...cajaData },
        error: null 
      }),

      setCajaCompleta: (cajaData) => {
        // Calcular totales desde los movimientos
        const { ingresos, egresos } = get().calcularTotales(cajaData.movimientos || []);
        
        const cajaCompleta = {
          ...cajaData,
          ingresos,
          egresos,
          saldoActual: (cajaData.saldoInicial || 0) + ingresos - egresos
        }; 

        set({ 
          caja: cajaCompleta,
          error: null 
        });
      },

      setMovimientos: (movimientos) => {
        const state = get();
        const { ingresos, egresos } = get().calcularTotales(movimientos);
        
        set({
          caja: { 
            ...state.caja, 
            movimientos,
            ingresos,
            egresos,
            saldoActual: (state.caja.saldoInicial || 0) + ingresos - egresos
          }
        });
      },

      agregarMovimiento: (nuevoMovimiento) => {
        const state = get();
        const movimientosActualizados = [nuevoMovimiento, ...state.caja.movimientos];
        
        // Calcular nuevos totales
        let nuevosIngresos = state.caja.ingresos;
        let nuevosEgresos = state.caja.egresos;

        if (nuevoMovimiento.tipoMovimiento === 'ingreso') {
          nuevosIngresos += parseFloat(nuevoMovimiento.monto) || 0;
        } else if (nuevoMovimiento.tipoMovimiento === 'egreso') {
          nuevosEgresos += parseFloat(nuevoMovimiento.monto) || 0;
        }

        const nuevoSaldoActual = state.caja.saldoInicial + nuevosIngresos - nuevosEgresos;

        set({
          caja: {
            ...state.caja,
            movimientos: movimientosActualizados,
            ingresos: nuevosIngresos,
            egresos: nuevosEgresos,
            saldoActual: nuevoSaldoActual
          },
          error: null
        });
      },
      // accion para cerrar caja y resetear los estados
      abrirCaja: (cajaData) => set({ 
        caja: {
          idCaja: cajaData.idCaja,      
          estado: "abierta",
          saldoInicial: parseFloat(cajaData.saldoInicial) || 0,
          saldoActual: parseFloat(cajaData.saldoActual) || 0,
          ingresos: 0,  
          egresos: 0,
          movimientos: []
        }
      }),

      cerrarCaja: () => set({
        caja: {
          idCaja: null, // eliminar el id
          estado: "cerrada",
          saldoInicial: 0,
          saldoActual: 0,
          ingresos: 0,
          egresos: 0,
          movimientos: []
        }
      }),

      setLoading: (isLoading) => set({ loading: isLoading }),

      setError: (errorMessage) => set({ error: errorMessage }),

      limpiarError: () => set({ error: null }),

      // Para visualizar el estado si hay algun problema 
      getEstado: () => {
        const state = get();
        console.log('Estado actual de caja:', state.caja);
        return state;
      }
    }),
    {
      name: 'caja-storage',
      partialize: (state) => ({
        caja: state.caja
      })
    }
  )
);