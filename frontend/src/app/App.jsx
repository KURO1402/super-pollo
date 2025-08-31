import { BrowserRouter } from "react-router-dom";
import AppRutas from "./Rutas";
import EstructuraBase from "../modulos/sitio-publico/layout/EstructuraBase";

function App() {
  return (
    <BrowserRouter>
      <EstructuraBase>
        <AppRutas />
      </EstructuraBase>
    </BrowserRouter>
  );
}

export default App;
