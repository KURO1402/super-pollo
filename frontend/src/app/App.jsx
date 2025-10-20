import { BrowserRouter } from "react-router-dom";
import AppRutas from "./Rutas";
import { ThemeProvider } from "../modulos/panel-administrador/context/ThemeContext";
import ToastTemaWrapper from "./ToastTemaWrapper";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRutas />
        <ToastTemaWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
