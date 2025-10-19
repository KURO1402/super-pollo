import axios from "axios";
// importamos nuestra variable de entorno
const apiUrl = import.meta.env.VITE_BACKEND_URL;
// función para registrar una venta
export const registrarVenta = async (datos) => {
    const respuesta = await axios.post(`${apiUrl}/ventas/generar-venta`, datos)
    if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    // retornamos la respuesta con lo que nos devuelve el backend
    return respuesta.data.resultado;
}