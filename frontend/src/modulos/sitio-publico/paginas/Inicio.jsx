import IntroduccionSeccion from "../secciones/IntroduccionSeccion";
import MenuSeccion from "../secciones/MenuSeccion";
import NosotrosSeccion from "../secciones/NosotrosSeccion";
import ReservaSeccion from "../secciones/ReservaSeccion";
import TrabajaNosotrosSeccion from "../secciones/TrabajaNosotrosSeccion";
import useScrollParaSecciones from "../hooks/useScrollParaSecciones";

const Inicio = () => {
  // llamamos al hook personalizado de scroll
  useScrollParaSecciones();

  return (
    <>
      <IntroduccionSeccion />
      <NosotrosSeccion />
      <MenuSeccion />
      <ReservaSeccion />
      <TrabajaNosotrosSeccion />
    </>
  );
};

export default Inicio;
