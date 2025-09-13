// importamos useRoutes de react-router-dom para definir todas las rutas en un solo lugar como un arreglo de objetos
import { useRoutes } from "react-router-dom";

// Sitio publico
import EstructuraBase from "../modulos/sitio-publico/layout/EstructuraBase";
import Inicio from "../modulos/sitio-publico/paginas/Inicio";
import Registro from "../modulos/sitio-publico/paginas/Registro";
import InicioSesion from "../modulos/sitio-publico/paginas/InicioSesion";

// Administrador
import EstructuraBaseAdmin from "../modulos/panel-administrador/layout/EstructuraBaseAdmin";
import PanelDeControl from "../modulos/panel-administrador/paginas/PanelDeControl";

// Página no encontrada
import NotFound from "../modulos/sitio-publico/paginas/NotFound";

// importamos el hook 
import useScrollAlInicio from "../modulos/sitio-publico/hooks/useScrollAlInicio";
// importamos el componente de ruta privada con rol
import RutaPrivadaConRol from "./RutaPrivadaConRol"; 

const AppRutas = () => {
    // activamos el hook para que haga scroll al inicio en cada cambio de ruta
    useScrollAlInicio();
    // definimos la estructura de rutas 
    const rutas = useRoutes([
        //rutas públicas 
        {    
            // se define la ruta padre raíz de la pagina web 
            // además la estructura base que se renderizará en cada ruta hija que coincida
            path: '/', element: <EstructuraBase />, 
            // estas rutas se renderizan en el Outlet del componente EstructuraBase
            children: [
                // index : true significa que es la ruta predeterminada cuando se visita a '/'
                { index: true, element: <Inicio /> },
                // las demás rutas 
                { path: '/registro', element: <Registro /> },
                { path: '/inicio-sesion', element: <InicioSesion /> },
            ]
        },

        // Rutas protegidas según rol
        {
            path: '/admin', // ruta padre para el panel de admin
            element: <RutaPrivadaConRol rolesPermitidos={[1, 2]} />, // solo superadmin y admin
            children: [
                { // se renderiza en el Outelt del componente RutaprivadaconRol
                element: <EstructuraBaseAdmin />, // la estructura base del panel
                children: [
                    { index: true, element: <PanelDeControl /> }] // ruta por defecto del panel de admin
                }
            ]
        },

        { // ruta padre para superadmin
            path: '/superadmin',
            element: <RutaPrivadaConRol rolesPermitidos={[1]} />, // solo el superadmin 
            children: [
                { index: true, element: <h1>Zona Superadmin</h1> } // ruta por defecto
            ]
        },

        { // ruta padre para usuarios, aun quue no se si va a ver alguna, pero por si acaso 
            path: '/usuario',
            element: <RutaPrivadaConRol rolesPermitidos={[3]} />, // solo usuarios
            children: [ // ruta por defecto 
                { index: true, element: <h1>Zona Usuarios</h1> }
            ]
        },

        // Cualquier ruta que no existe
        { path: '*', element: <NotFound /> },
    ])
    // retornamos las rutas generadas 
    return rutas;
}

export default AppRutas;
