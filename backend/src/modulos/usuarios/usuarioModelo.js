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

module.exports = { consultarUsuarioPorIdModel }