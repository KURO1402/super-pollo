import { BrowserRouter } from "react-router-dom";
import AppRutas from "./Rutas";
import { ThemeProvider } from "../modulos/panel-administrador/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRutas />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
