import IntroduccionSeccion from "../secciones/IntroduccionSeccion"
import MenuSeccion from "../secciones/MenuSeccion"
import NosotrosSeccion from "../secciones/NosotrosSeccion"
import ReservaSeccion from "../secciones/ReservaSeccion"

const Inicio = () => {
    return (
        <>
            <IntroduccionSeccion />
            <NosotrosSeccion />
            <MenuSeccion />
            <ReservaSeccion />
        </>
    )
}

export default Inicio 
