import { useEffect, useState } from "react";
import { obtenerCantidadVentasHoyComparacionServicio } from "../servicios/datosServicio"; // ajusta la ruta

export const useVentasHoyComparacion = () => {
  const [ventas, setVentas] = useState({
    totalVentasHoy: 0,
    totalVentasAyer: 0,
    porcentajeComparacion: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const resultado = await obtenerCantidadVentasHoyComparacionServicio();
        setVentas(resultado);
      } catch (error) {
        console.error("Error al obtener ventas hoy:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchVentas();
  }, []);

  return { ventas, cargando };
};
