import { useRoutes } from "react-router-dom";
import Inicio from "../modulos/sitio-publico/paginas/Inicio";

const AppRutas = () => {
    const rutas = useRoutes([
        //rutas públicas
        { path: '/', element: <Inicio /> },
    ])
    return rutas
}

export default AppRutas