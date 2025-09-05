import { Link } from "react-router-dom";

const BotonIniciarSesion = () => {
    return ( 
        <Link to='/inicio-sesion'>
            <button className="text-gray-100 text-sm md:text-base hover:text-rojo transition-colors duration-200 px-2 py-1 rounded-md hover:bg-azul-primario">
                Iniciar Sesión
            </button>
        </Link>
     );
}
 
export default BotonIniciarSesion;