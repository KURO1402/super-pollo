function convertirA24Horas(hora12) {
  const [hora, modificador] = hora12.split(" ");
  let [h, m] = hora.split(":");

  h = parseInt(h);

  if (modificador === "PM" && h !== 12) {
    h += 12;
  }

  if (modificador === "AM" && h === 12) {
    h = 0;
  }

  return `${String(h).padStart(2, "0")}:${m}:00`;
};

module.exports = { convertirA24Horas };