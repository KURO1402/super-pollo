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
