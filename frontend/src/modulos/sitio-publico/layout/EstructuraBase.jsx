import Cabecera from "../componentes/Cabecera";
import PiePagina from "../componentes/PiePagina";

const EstructuraBase = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Cabecera />
      <main className="flex-grow w-full overflow-hidden">{children}</main>
      <PiePagina />
    </div>
  );
};
export default EstructuraBase;
