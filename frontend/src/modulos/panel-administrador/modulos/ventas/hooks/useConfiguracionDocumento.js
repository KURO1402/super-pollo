import { useEffect, useState } from "react";

const useConfiguracionDocumento = (tipo, setValue) => {
  const [placeholder, setPlaceholder] = useState("Ingrese el número de documento");
  const [busquedaHabilitada, setbusquedaHabilitada] = useState(false);

  useEffect(() => {
    if (tipo === "1") {
      // DNI
      setPlaceholder("Ejemplo: 87654321");
      setbusquedaHabilitada(true);
      setValue("numeroDocumento", ""); // reset input
    } else if (tipo === "2") {
      // Pasaporte
      setPlaceholder("Ejemplo: E1234567");
      setbusquedaHabilitada(false);
      setValue("numeroDocumento", ""); // reset input
    } else if (tipo === "3") {
      // Carne de extranjería
      setPlaceholder("Ejemplo: P1234567");
      setbusquedaHabilitada(false);
      setValue("numeroDocumento", ""); // reset input
    } else if (tipo === "4") {
      // RUC
      setPlaceholder("Ejemplo: 20123456789");
      setbusquedaHabilitada(true);
      setValue("numeroDocumento", ""); // reset input
    }
  }, [tipo, setValue]);

  return { placeholder, busquedaHabilitada };
};

export default useConfiguracionDocumento;

