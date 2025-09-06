//importamos al conexion a base de datos
const pool = require("../../config/conexionDB");

//Esto es la funcion para registrar usuario usando el procedimiento almacenado
const UsuarioModel = {
    insertar : async(datos, claveEncriptada) => {
        const {
            nombresUsuario,
            apellidosUsuario,
            correoUsuario,
            clave,
            numeroDocumentoUsuario,
            telefonoUsuario,
            idRol,
            idTipoDocumento
        } = datos

        //llamamos al procedimiento almacenado
        const[result] = await pool.query(
            "CALL insertarUsuario(?, ? ,?, ?, ?, ?, ?, ?)",
            [
                nombresUsuario,
                apellidosUsuario,
                correoUsuario,
                claveEncriptada,
                numeroDocumentoUsuario,
                telefonoUsuario,
                idRol,
                idTipoDocumento,
            ]
        );
        //retonamos el resultado paar el controlador
        return result
    },
};

module.exports = UsuarioModel;