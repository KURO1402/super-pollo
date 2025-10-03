//Importamos al conexion a base de datos
const pool = require("../../config/conexionDB.js");

//Modelo para listar tipos de documentos
const listarTipoDocumentoModel = async () => {
    try {
       const [rows] = await pool.execute("CALL listarTipoDocumento()");
       return rows[0];
    } catch (err) {
        console.error("Error al listar tipos de documento:", err.message);
        throw new Error("Error en la base de datos al listar tipos de documento");
    }  
}

module.exports = { listarTipoDocumentoModel };