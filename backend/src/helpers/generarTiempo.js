const generarFechaActual = () => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${anio}-${mes}-${dia}`;
};

const generarHoraActual = () => {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");
  return `${horas}:${minutos}:${segundos}`;
};

module.exports = {
  generarFechaActual, 
  generarHoraActual
};