import IntroduccionSeccion from "../secciones/IntroduccionSeccion"
import MenuSeccion from "../secciones/MenuSeccion"
import NosotrosSeccion from "../secciones/NosotrosSeccion"
import ReservaSeccion from "../secciones/ReservaSeccion"
import TrabajaNosotrosSeccion from "../secciones/TrabajaNosotrosSeccion"

const Inicio = () => {
    return (
        <>
            <IntroduccionSeccion />
            <NosotrosSeccion />
            <MenuSeccion />
            <ReservaSeccion />
            <TrabajaNosotrosSeccion />
        </>
    )
}

export default Inicio 
