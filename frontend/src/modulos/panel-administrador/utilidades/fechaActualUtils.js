// función para obtener la fecha de hoy, formateada para colocarlo en un input de tipo date
export const obtenerFechaActual = () => {
    const hoy = new Date(); // el día de hoy
    const fechaFormateada = hoy.toISOString().split("T")[0];// formateamos la fecha 
    return fechaFormateada; // devolvemos para que sea utilizada
}