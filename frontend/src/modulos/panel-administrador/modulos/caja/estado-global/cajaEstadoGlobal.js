// stores/useCajaStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const cajaEstadoGlobal = create(
  persist( // para percistir los datos aun que se cambie de página 
    (set, get) => ({
      // Estado inicial
      caja: {
        estado: "cerrada",
        saldoInicial: 0,
        saldoActual: 0,
        ingresos: 0,
        egresos: 0,
        movimientos: []
      },
      loading: false,
      error: null,

      // Actiones
      setCaja: (cajaData) => set({ 
        caja: { ...get().caja, ...cajaData },
        error: null 
      }),

      setCajaCompleta: (cajaData) => set({ 
        caja: cajaData,
        error: null 
      }),

      setMovimientos: (movimientos) => set({
        caja: { ...get().caja, movimientos }
      }),

      agregarMovimiento: (nuevoMovimiento) => {
        const state = get();
        const movimientosActualizados = [nuevoMovimiento, ...state.caja.movimientos];
        
        // Calcular nuevos totales
        let nuevosIngresos = state.caja.ingresos;
        let nuevosEgresos = state.caja.egresos;
        let nuevoSaldoActual = state.caja.saldoActual;

        if (nuevoMovimiento.tipo === 'ingreso') {
          nuevosIngresos += nuevoMovimiento.monto;
          nuevoSaldoActual += nuevoMovimiento.monto;
        } else if (nuevoMovimiento.tipo === 'egreso') {
          nuevosEgresos += nuevoMovimiento.monto;
          nuevoSaldoActual -= nuevoMovimiento.monto;
        }

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

      abrirCaja: (montoInicial) => set({
        caja: {
          ...get().caja,
          estado: "abierta",
          saldoInicial: montoInicial,
          saldoActual: montoInicial,
          ingresos: 0,
          egresos: 0,
          movimientos: []
        }
      }),

      cerrarCaja: () => set({
        caja: {
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
      getEstado: () => get()
    }),
    {
      name: 'caja-storage',
      partialize: (state) => ({
        caja: state.caja
      })
    }
  )
);