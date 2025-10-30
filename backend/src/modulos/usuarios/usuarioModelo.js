const pool = require("../../config/conexionDB");

const  consultarUsuarioPorIdModel = async (id) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL seleccionarUsuarioId(?)", [id]);
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

        const [rows] = await conexion.execute(
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

// Modelo para actualizar correo de usuario
const actualizarCorreoUsuarioModel = async (idUsuario, nuevoCorreo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            "CALL actualizarCorreoUsuario(?, ?)",
            [idUsuario, nuevoCorreo]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        console.error("Error en actualizarCorreoUsuarioModel:", err.message);
        throw new Error("Error al actualizar el correo en la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarClaveUsuarioModel = async (idUsuario, clave) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            "CALL actualizarClaveUsuario(?, ?)",
            [idUsuario, clave]
        );

        return result[0][0]?.mensaje || "No se pudo actualizar la contraseña.";
    } catch (err) {
        console.error("Error en actualizarClaveUsuarioModel:", err.message);
        throw new Error("Error al actualizar la contraseña en la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};

const consultarClaveUsuarioModel = async (idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL obtenerClaveUsuario(?)", [idUsuario]);
        return rows[0]; // Devuelve solo la clave
    } catch (err) {
        console.error("Error en consultarClaveUsuarioModel: ", err.message);
        throw new Error("Error al consultar la clave del usuario en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para eliminar un usuario
const eliminarUsuarioModel = async (idUsuario, estado) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL actualizarEstadoUsuario(?, ?)", [idUsuario, estado]);

        return result[0][0]?.mensaje;
        
    } catch (error) {
        console.error("Error en eliminarUsuarioModel : ", err.message);
        throw new Error("Error al eliminar el usaurio en la base de datos.");
    } finally {
        if (conexion) conexion.release
    }
};

const recuperarUsuarioModel = async (idUsuario, estado) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL actualizarEstadoUsuario(?, ?)", [idUsuario, estado]);

        return result[0][0]?.mensaje;
        
    } catch (error) {
        console.error("Error en recuperarUsuarioModel : ", err.message);
        throw new Error("Error al recuperar usuario de la base de datos.");
    } finally {
        if (conexion) conexion.release
    }
};

//Modelo para obtener todos los usuarios
const listarUsuariosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL listarUsuarios()");
        return result[0]; // Devuelve el arreglo de usuarios
    } catch (error) {
        console.error("Error en listarUsuariosModel: ", err.message);
        throw new Error("Error al listar los usuarios de la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para listar usuarios con paginación.
const listarUsuariosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL listarUsuariosPaginacion(?, ?)", [limit, offset]);
        return result[0]; // Devuelve el arreglo de usuarios
    } catch (error) {
        console.error("Error en listarUsuariosPaginacionModel: ", err.message);
        throw new Error("Error al listar los usuarios de la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};

 //Modelo para buscar usuarios por un valor (nombre, apellido, correo o teléfono).
const buscarUsuariosPorValorModel = async (valor) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL buscarUsuariosPorValor(?)", [valor]);
        return result[0]; // Devuelve un arreglo de usuarios que coincidan
    } catch (error) {
        console.error("Error en buscarUsuariosPorValorModel: ", err.message);
        throw new Error("Error al buscar al usuario en la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};


//Modelo para contar los usuarios activos.
const contarUsuariosActivosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL contarUsuariosActivos()");
        return result[0][0]?.totalUsuariosActivos; // Devuelve el número de usuarios activos
    } catch (error) {
        console.error("Error en contarUsuariosActivosModel: ", err.message);
        throw new Error("Error al obtener el numero total de usuarios.");
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoPorIdModel = async (idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            "CALL contarTipoDocumentoPorId(?)",
            [idTipoDocumento]
        );

        // El resultado queda dentro del primer arreglo
        return result[0][0]?.total || 0;

    } catch (err) {
        console.error("Error en contarTipoDocumentoPorIdModel: ", err.message);
        throw new Error("Error al obtener el numero total de tipos de documento.");
    } finally {
        if (conexion) conexion.release();
    }
};


module.exports = { 
    consultarUsuarioPorIdModel,
    actualizarUsuarioModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    consultarClaveUsuarioModel,
    eliminarUsuarioModel,
    recuperarUsuarioModel,
    listarUsuariosModel,
    listarUsuariosPaginacionModel,
    buscarUsuariosPorValorModel,
    contarUsuariosActivosModel,
    contarTipoDocumentoPorIdModel
}