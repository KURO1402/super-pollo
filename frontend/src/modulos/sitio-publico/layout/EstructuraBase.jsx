import Cabecera from "../componentes/Cabecera";
import PiePagina from "../componentes/PiePagina";

const EstructuraBase = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Cabecera />
      {/* Añade padding-top equivalente a la altura del header */}
      <main className="flex-grow w-full overflow-hidden pt-16 md:pt-20">
        {children}
      </main>
      <PiePagina />
    </div>
  );
};

export default EstructuraBase;
