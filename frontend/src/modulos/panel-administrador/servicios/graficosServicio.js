import API from "../../../app/servicio/axiosConfiguracion";

// Servicio para obtener los 5 productos más vendidos
export const obtenerTopProductosMasVendidosServicio = async (fechaInicio, fechaFin) => {
  try {

    let url = `/fuente-datos/top-productos`;

    // Si hay filtros, agregarlos a la URL
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener productos más vendidos");
    }

  } catch (error) {
    console.error('Error en obtenerTopProductosMasVendidosServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const obtenerResumenVentasEgresosMensualServicio = async (cantidadMeses) => {
  try {
    let url = `/fuente-datos/ingresos-egresos`;

    // Agregar parámetro de cantidad de meses si viene
    if (cantidadMeses) {
      url += `?meses=${cantidadMeses}`;
    }

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; // <- directamente usable en Recharts
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener resumen de ventas y egresos");
    }
  } catch (error) {
    console.error("Error en obtenerResumenVentasEgresosMensualServicio:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const obtenerPorcentajeMediosPagoServicio = async () => {
  try {
    const url = "/fuente-datos/porcentaje-medios-pago"; // define tu ruta en backend
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener porcentaje de medios de pago");
    }
  } catch (error) {
    console.error("Error en obtenerPorcentajeMediosPagoServicio:", error);
    throw error;
  }
};

export const obtenerVentasPorMesServicio = async (cantidadMeses) => {
  try {
    let url = `/fuente-datos/ventas-mes`;

    // Agregar parámetro de cantidad de meses si viene
    if (cantidadMeses) {
      url += `?meses=${cantidadMeses}`;
    }

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; // Array directamente usable en gráficos
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener ventas por mes");
    }
  } catch (error) {
    console.error("Error en obtenerVentasPorMesServicio:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};