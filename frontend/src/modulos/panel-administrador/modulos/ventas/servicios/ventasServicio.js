import API from "../../../../../app/servicio/axiosConfiguracion"
// importamos nuestra variable de entorno
const apiUrl = import.meta.env.VITE_BACKEND_URL;
// función para registrar una venta
export const generarBoletaServicio = async (datos) => {
    const respuesta = await API.post("/ventas/generar-boleta", datos)
    if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    // retornamos la respuesta con lo que nos devuelve el backend
    return respuesta.data.resultado;
}