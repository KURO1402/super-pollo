const pool = require("../../config/conexionDB.js");

const registrarUsuarioModel = async (datos, claveEncriptada) => {

    const { nombresUsuario,
        apellidosUsuario,
        correoUsuario,
        numeroDocumentoUsuario,
        telefonoUsuario,
        idTipoDocumento } = datos;

    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL insertarUsuario(?, ? ,?, ?, ?, ?, ?)",
            [
                nombresUsuario,
                apellidosUsuario,
                correoUsuario,
                claveEncriptada,
                numeroDocumentoUsuario,
                telefonoUsuario,
                idTipoDocumento,
            ]
        );

        const usuarioNuevo = result[0][0]

        return usuarioNuevo;
    } catch (err) {

        throw new Error("Error al insertar usuario en la base de datos");

    } finally {

        if (conexion) conexion.release();

    }
};

const insertarVerificacionCorreoModel = async (correo, codigo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarCodigoVerificacion(?, ?)", [correo, codigo]);

        return result;
    } catch (err) {

        throw new Error("Error al insertar codigo de verificacion en la base de datos");

    } finally {
        if (conexion) conexion.release();
    }
};

const validarCodigoVerificacionCorreoModel = async (correo, codigo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute(
            "CALL obtenerVerificacionCorreo(?, ?)",
            [correo, codigo]
        );

        const registro = rows[0][0]; 

        return registro;
    } catch (err) {

        throw err;

    } finally {

        conexion.release();

    }
};

const actualizarVerificacionCorreoModel = async (correo, codigo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.execute(
            "CALL actualizarVerificacionCorreo(?, ?)",
            [correo, codigo]
        );

        return {
            ok: true,
            mensaje: "Correo validado exitosamente"
        }

    } catch (err) {

        throw err;

    } finally {

        conexion.release();

    }
};

const seleccionarUsuarioCorreoModel = async (correoUsuario) => {
    let conexion;
    try {

        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL seleccionarUsuarioCorreo(?)", [correoUsuario]);

        return result[0];
    } catch (err) {

        throw new Error("Error en la base de datos al buscar usuario");

    } finally {

        if (conexion) conexion.release();

    }
};

const obtenerEstadoVerificacionCorreoModel = async (correo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            "CALL obtenerEstadoVerificacionCorreo(?)",
            [correo]
        );

        const resultado = rows[0]?.[0] || null;

        return resultado; 
    } catch (err) {

        throw Object.assign(new Error('Error al obtener el estado de verificación del correo'), { status: 500 });

    } finally {

        if (conexion) conexion.release();

    }
};

module.exports = {
    registrarUsuarioModel,
    insertarVerificacionCorreoModel,
    validarCodigoVerificacionCorreoModel,
    actualizarVerificacionCorreoModel,
    obtenerEstadoVerificacionCorreoModel,
    seleccionarUsuarioCorreoModel
};