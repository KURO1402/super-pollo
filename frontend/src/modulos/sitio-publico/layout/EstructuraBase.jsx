import Cabecera from "../componentes/Cabecera"

const EstructuraBase = ({ children }) => {
    return(
        <>
            <Cabecera />
            <main> {children} </main>
        </>
    )
}
export default EstructuraBase