import { useRoutes } from "react-router-dom";
import PaginaInicial from "../modulos/sitio-publico/layout/PaginaInicial";

const AppRutas = () => {
    const rutas = useRoutes([
        //rutas públicas
        { path: '/', element: <PaginaInicial /> },
    ])
    return rutas
}

export default AppRutas