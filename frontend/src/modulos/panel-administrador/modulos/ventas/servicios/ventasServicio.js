import API from "../../../../../app/servicio/axiosConfiguracion"
// función para registrar una venta
export const generarBoletaServicio = async (datos) => {
    const respuesta = await API.post("/ventas/generar-boleta", datos)
    if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    // retornamos la respuesta completa con lo que nos devuelve el backend
    console.log("Respuesta completa del backend:", respuesta.data)
    return respuesta.data; // Retorna toda la respuesta, no solo .venta
}

export const generarFacturaServicio = async (datos) => {
    const respuesta = await API.post("/ventas/generar-factura", datos)
    if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    // retornamos la respuesta completa con lo que nos devuelve el backend
    console.log("Respuesta completa del backend:", respuesta.data)
    return respuesta.data; // Retorna toda la respuesta, no solo .venta
}
export const obtenerMetodosPagoServicio = async () => {
    try {
        const respuesta = await API.get("/ventas/medios-pago")
        if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los medios de pago");
    }
    // retornamos la respuesta con lo que nos devuelve el backend
    return respuesta.data.medios;
    } catch (error) {
        console.error("Error en el servicio:", error)
    }
}

// Obtener resumen de ventas
export const obtenerVentasServicio = async () => {
    const respuesta = await API.get("/ventas/resumen");
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener las ventas");
    }
    return respuesta.data.ventas;
}

// Obtener detalle de una venta específica
export const obtenerDetalleVentaServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/detalle-venta/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el detalle de la venta");
    }
    return respuesta.data.detalles;
}

// Obtener comprobante para descargar PDF
export const obtenerComprobanteServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/comprobante/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el comprobante");
    }
    return respuesta.data.comprobante[0]; // Retorna el primer elemento del array
}