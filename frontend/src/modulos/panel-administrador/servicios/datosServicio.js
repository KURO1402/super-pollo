import API from "../../../app/servicio/axiosConfiguracion";

export const obtenerVentasHoyComparacionServicio = async () => {
  try {
    const url = `/fuente-datos/comparacion-ventas`;

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener ventas de hoy y comparación");
    }
  } catch (error) {
    console.error("Error en obtenerVentasHoyComparacionServicio:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const obtenerCantidadVentasHoyComparacionServicio = async () => {
  try {
    const url = `/fuente-datos/cantidad-ventas`; // <-- aquí la ruta correcta

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; // { totalVentasHoy, totalVentasAyer, porcentajeComparacion }
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener cantidad de ventas y comparación");
    }
  } catch (error) {
    console.error("Error en obtenerCantidadVentasHoyComparacionServicio:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const obtenerReservasHoyComparacionServicio = async () => {
  try {
    const url = "/fuente-datos/cantidad-reservaciones"; // define tu ruta en backend
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener reservas de hoy y comparación");
    }
  } catch (error) {
    console.error("Error en obtenerReservasHoyComparacionServicio:", error);
    throw error;
  }
};

export const obtenerBalanceAnualServicio = async () => {
  try {
    const url = "/fuente-datos/balance-anual"; // ruta en backend
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener el balance anual");
    }
  } catch (error) {
    console.error("Error en obtenerBalanceAnualServicio:", error);
    throw error;
  }
};