import { useRoutes } from "react-router-dom";

import RutaPrivadaConRol from "./RutaPrivadaConRol";

import useScrollAlInicio from "../modulos/sitio-publico/hooks/useScrollAlInicio";
import { ROLES } from "./constantes/roles";

import EstructuraBase from "../modulos/sitio-publico/layout/EstructuraBase";
import Inicio from "../modulos/sitio-publico/paginas/Inicio";
import Registro from "../modulos/sitio-publico/paginas/Registro";
import InicioSesion from "../modulos/sitio-publico/paginas/InicioSesion";
import NotFound from "../modulos/sitio-publico/paginas/NotFound";

import EstructuraBaseUsuario from "../modulos/sitio-publico/layout/EstructuraBaseUsuario";
import InicioUsuario from "../modulos/sitio-publico/paginas/usuario/InicioUsuario";
import NuevaReservacion from "../modulos/sitio-publico/paginas/usuario/NuevaReservacion";
import MisReservaciones from "../modulos/sitio-publico/paginas/usuario/MisReservaciones";
import PerfilUsuario from "../modulos/sitio-publico/paginas/usuario/PerfilUsuario";

import EstructuraBaseAdmin from "../modulos/panel-administrador/layout/EstructuraBaseAdmin";
import PanelDeControl from "../modulos/panel-administrador/paginas/PanelDeControl";

import GenerarVenta from "../modulos/panel-administrador/modulos/ventas/secciones/GenerarVentaSeccion";
import RegistroVentasSeccion from "../modulos/panel-administrador/modulos/ventas/secciones/RegistroVentasSeccion";

import GestionProductosSeccion from "../modulos/panel-administrador/modulos/productos/secciones/GestionProductosSeccion";
import GestionImagenesSeccion from "../modulos/panel-administrador/modulos/productos/secciones/GestionImagenesSeccion";

import StockInsumosSeccion from "../modulos/panel-administrador/modulos/stock/secciones/StockInsumosSeccion";
import HistorialEntradasSeccion from "../modulos/panel-administrador/modulos/stock/secciones/HistorialEntradasSeccion";
import HistorialSalidasSeccion from "../modulos/panel-administrador/modulos/stock/secciones/HistorialSalidasSeccion";

import CajaActualSeccion from "../modulos/panel-administrador/modulos/caja/secciones/CajaActualSeccion";
import HistorialCajasSeccion from "../modulos/panel-administrador/modulos/caja/secciones/HistorialCajasSeccion";

import CalendarioReservasSeccion from "../modulos/panel-administrador/modulos/reservas/secciones/CalendarioReservasSeccion";
import HistorialReservasSeccion from "../modulos/panel-administrador/modulos/reservas/secciones/HistorialReservasSeccion";

import Usuarios from "../modulos/panel-administrador/modulos/usuario/secciones/Usuarios"
import Perfil from "../modulos/panel-administrador/modulos/usuario/secciones/Perfil";
import PagoExitoso from "../modulos/sitio-publico/paginas/usuario/PagoExitoso";
import PagoFallido from "../modulos/sitio-publico/paginas/usuario/PagoFallido";
import PagoPendiente from "../modulos/sitio-publico/paginas/usuario/PagoPendiente";
import TerminosCondiciones from "../modulos/sitio-publico/paginas/TerminosCondiciones";
import PoliticasPrivacidad from "../modulos/sitio-publico/paginas/PoliticasPrivacidad";

const AppRutas = () => {
    useScrollAlInicio();
    const rutas = useRoutes([
        {    
            path: '/', element: <EstructuraBase />, 

            children: [
                { index: true, element: <Inicio /> },
                { path: '/registro', element: <Registro /> },
                { path: '/inicio-sesion', element: <InicioSesion /> },
                { path: 'pago-pendiente', element: <PagoPendiente /> },
                { path: 'terminos-condiciones', element: <TerminosCondiciones /> },
                { path: 'politicas-privacidad', element: <PoliticasPrivacidad /> },
            ]
        },

        {
            path: '/usuario',
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.USUARIO]} redirectTo="/" />,
            children: [
                {
                element: <EstructuraBaseUsuario />,
                children: [
                    { index: true, element: <InicioUsuario /> },
                    { path:'mis-reservaciones', element: <MisReservaciones /> },
                    { path: 'nueva-reservacion', element: <NuevaReservacion /> },
                    { path: 'reservaciones', element: <MisReservaciones /> },
                    { path: 'perfil', element: <PerfilUsuario /> },
                    { path: 'pago-exitoso', element: <PagoExitoso /> },
                    { path: 'pago-fallido', element: <PagoFallido /> },
                ]
                }
            ]
        },

        {
            path: '/admin',
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.SUPERADMIN, ROLES.ADMIN]} redirectTo="/" />,
            children: [
                {
                element: <EstructuraBaseAdmin />,
                children: [
                    { index: true, element: <PanelDeControl /> },
                    { path: 'generar-venta', element: <GenerarVenta/> },
                    { path: 'registro-ventas', element: <RegistroVentasSeccion/> },
                    { path: 'stock-insumos', element: <StockInsumosSeccion/> },
                    { path: 'historial-entradas', element: <HistorialEntradasSeccion/> },
                    { path: 'historial-salidas', element: <HistorialSalidasSeccion/> },
                    { path: 'gestion-productos', element: <GestionProductosSeccion/> },
                    { path: 'gestion-imagenes', element: <GestionImagenesSeccion/> },
                    { path: 'calendario-reservas', element: <CalendarioReservasSeccion/> },
                    { path: 'historial-reservas', element: <HistorialReservasSeccion/> },
                    { path: 'caja-actual', element: <CajaActualSeccion/> },
                    { path: 'historial-cajas', element: <HistorialCajasSeccion/> },
                    { path: 'usuarios', element: <Usuarios/> },
                    { path: 'perfil', element: <Perfil/> },
                ]
                }
            ]
        },

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

        { path: '*', element: <NotFound /> },
    ])
    
    return rutas;
}

export default AppRutas;
