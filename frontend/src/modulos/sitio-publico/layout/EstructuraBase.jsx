import { Outlet } from "react-router-dom"; // Outlet practicamente sirve como punto de partida de la rutas hijas 
// importamos la cabecera y pie de pagina 

import Cabecera from "./Cabecera";
import PiePagina from "./PiePagina";

const EstructuraBase = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Cabecera />
      <main className="flex-grow w-full overflow-hidden pt-16 md:pt-20">
        {/* renderiza el contenido de la ruta activa */}
        <Outlet /> 
      </main>
      <PiePagina />
    </div>
  );
};

export default EstructuraBase;
