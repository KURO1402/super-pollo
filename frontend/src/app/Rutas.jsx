// importamos useRoutes de react-router-dom para definir todas las rutas en un solo lugar como un arreglo de objetos
import { useRoutes } from "react-router-dom";
// importamos el componente de ruta privada con rol
import RutaPrivadaConRol from "./RutaPrivadaConRol";
// importamos el hook 
import useScrollAlInicio from "../modulos/sitio-publico/hooks/useScrollAlInicio";
import { ROLES } from "./constantes/roles";

// Sitio publico
import EstructuraBase from "../modulos/sitio-publico/layout/EstructuraBase";
import Inicio from "../modulos/sitio-publico/paginas/Inicio";
import Registro from "../modulos/sitio-publico/paginas/Registro";
import InicioSesion from "../modulos/sitio-publico/paginas/InicioSesion";
import NotFound from "../modulos/sitio-publico/paginas/NotFound";

// Páginas del usuario
import EstructuraBaseUsuario from "../modulos/sitio-publico/layout/EstructuraBaseUsuario";
import InicioUsuario from "../modulos/sitio-publico/paginas/InicioUsuario";
import NuevaReservacion from "../modulos/sitio-publico/paginas/NuevaReservacion";
import MisReservaciones from "../modulos/sitio-publico/paginas/MisReservaciones";
import PerfilUsuario from "../modulos/sitio-publico/paginas/PerfilUsuario";

// PANEL DE ADMINISTRACION
import EstructuraBaseAdmin from "../modulos/panel-administrador/layout/EstructuraBaseAdmin";
import PanelDeControl from "../modulos/panel-administrador/paginas/PanelDeControl";

// secciones de venta
import GenerarVenta from "../modulos/panel-administrador/modulos/ventas/secciones/GenerarVentaSeccion";
import RegistroVentasSeccion from "../modulos/panel-administrador/modulos/ventas/secciones/RegistroVentasSeccion";

// secciones de stock
import StockInsumosSeccion from "../modulos/panel-administrador/modulos/stock/secciones/StockInsumosSeccion";
import HistorialEntradasSeccion from "../modulos/panel-administrador/modulos/stock/secciones/HistorialEntradasSeccion";
import HistorialSalidasSeccion from "../modulos/panel-administrador/modulos/stock/secciones/HistorialSalidasSeccion";
import GestionProductosSeccion from "../modulos/panel-administrador/modulos/stock/secciones/GestionProductosSeccion";

// secciones de caja
import CajaActualSeccion from "../modulos/panel-administrador/modulos/caja/secciones/CajaActualSeccion";
import HistorialCajasSeccion from "../modulos/panel-administrador/modulos/caja/secciones/HistorialCajasSeccion";

// secciones de reserva
import CalendarioReservasSeccion from "../modulos/panel-administrador/modulos/reservas/secciones/CalendarioReservasSeccion";
import HistorialReservasSeccion from "../modulos/panel-administrador/modulos/reservas/secciones/HistorialReservasSeccion";

// secciones de usuario y perfil
import Usuarios from "../modulos/panel-administrador/paginas/Usuarios";
import Perfil from "../modulos/panel-administrador/paginas/Perfil";

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

        {
            path: '/usuario',
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.USUARIO]} redirectTo="/" />,
            children: [
                {
                element: <EstructuraBaseUsuario />,
                children: [
                    // rutas
                    { index: true, element: <InicioUsuario /> },
                    { path:'mis-reservaciones', element: <MisReservaciones /> },
                    { path: 'nueva-reservacion', element: <NuevaReservacion /> },
                    { path: 'reservaciones', element: <MisReservaciones /> },
                    { path: 'perfil', element: <PerfilUsuario /> }, // Nuevo componente, no reutilizado
                ]
                }
            ]
        },

        // PANEL DE ADMINISTRACION
        {
            path: '/admin', // ruta padre para el panel de admin
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.SUPERADMIN, ROLES.ADMIN]} redirectTo="/" />, // solo superadmin y admin
            children: [
                { // se renderiza en el Outelt del componente RutaprivadaconRol
                element: <EstructuraBaseAdmin />, // la estructura base del panel
                children: [
                    // Dashboard - Solo SuperAdmin
                    { index: true, element: <PanelDeControl /> },
                    // Ventas - SuperAdmin y Admin
                    { path: 'generar-venta', element: <GenerarVenta/> },
                    { path: 'registro-ventas', element: <RegistroVentasSeccion/> },
                    // Ventas - SuperAdmin y Admin
                    { path: 'stock-insumos', element: <StockInsumosSeccion/> },
                    { path: 'historial-entradas', element: <HistorialEntradasSeccion/> },
                    { path: 'historial-salidas', element: <HistorialSalidasSeccion/> },
                    { path: 'gestion-productos', element: <GestionProductosSeccion/> },
                    // Reservas - SuperAdmin y Admin
                    { path: 'calendario-reservas', element: <CalendarioReservasSeccion/> },
                    { path: 'historial-reservas', element: <HistorialReservasSeccion/> },
                    // Caja - SuperAdmin y Admin
                    { path: 'caja-actual', element: <CajaActualSeccion/> },
                    { path: 'historial-cajas', element: <HistorialCajasSeccion/> },
                    // Usuarios - Solo SuperAdmin
                    { path: 'usuarios', element: <Usuarios/> },
                    // Perfil - SuperAdmin y Admin
                    { path: 'perfil', element: <Perfil/> },
                ] // ruta por defecto del panel de admin
                }
            ]
        },
        // Ruta de no autorizado
        {
            path: '/no-autorizado',
            element: (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md px-4">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Acceso No Autorizado
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No tienes permisos para acceder a esta sección.
                    </p>
                    <a
                    href="/"
                    className="inline-block px-6 py-3 bg-rojo text-white rounded-lg hover:bg-rojo/90 transition-colors"
                    >
                    Volver al Inicio
                    </a>
                </div>
                </div>
            )
        },

        // Cualquier ruta que no existe - 404
        { path: '*', element: <NotFound /> },
    ])
    // retornamos las rutas generadas 
    return rutas;
}

export default AppRutas;
