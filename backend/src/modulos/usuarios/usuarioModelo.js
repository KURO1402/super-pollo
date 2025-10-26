const pool = require("../../config/conexionDB");

const  consultarUsuarioPorIdModel = async (id) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL seleccionarUsuarioId(?)", [id]);
        return rows[0];
    } catch (err) {
        console.error("Error en consultarUsuarioPorIdModel: ", err.message);
        throw new Error("Error al consultar el usuario en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para actualizar datos de un usuario
const actualizarUsuarioModel = async (datos, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const {
            nombresUsuario,
            apellidosUsuario,
            numeroDocumentoUsuario,
            telefonoUsuario,
            idTipoDocumento
        } = datos;

        const [rows] = await conexion.query(
            "CALL actualizarUsuario(?, ?, ?, ?, ?, ?)",
            [
                idUsuario,
                nombresUsuario,
                apellidosUsuario,
                numeroDocumentoUsuario,
                telefonoUsuario,
                idTipoDocumento
            ]
        );

        // ✅ Retornar el mensaje del procedimiento
        return rows[0][0]?.mensaje;
    } catch (err) {
        console.error("Error en actualizarUsuarioModel:", err.message);
        throw new Error("Error al actualizar el usuario en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = { 
    consultarUsuarioPorIdModel,
    actualizarUsuarioModel 
}