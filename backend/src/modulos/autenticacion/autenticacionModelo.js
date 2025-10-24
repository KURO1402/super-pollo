//Importamos al conexion a base de datos
const pool = require("../../config/conexionDB.js");

//MODELO PARA REGISTRAR USUARIO
const insertarUsuarioModel = async (datos, claveEncriptada) => {
    //Usamos desestructuracion para obtener los valores del objeto datos
    const { nombresUsuario,
        apellidosUsuario,
        correoUsuario,
        numeroDocumentoUsuario,
        telefonoUsuario,
        idTipoDocumento } = datos;

    let conexion;//Variable para guardar la conexion a la base de datos
    try {
        conexion = await pool.getConnection() //Ejecutamos y guardamos en la variable la conexion a la db

        // Iniciamos transacción para asegurarnos que se complete todo o nada 
        await conexion.beginTransaction();

        //llamamos y ejecutamos el procedimiento almacenado creado en la base de datos
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

        //Confirmamos los cambios o modificaciones hechas
        await conexion.commit();
        //Guardamos el usuario ya que el result contiene dos arrays y el primero es el usuario por eso [0][0] 
        const usuario = result[0][0]

        return usuario;
    } catch (err) {
        // Si algo falla, revertimos cambios
        if (conexion) await conexion.rollback();
        //Mostramos el error
        console.error("Error al insertar usuario:", err.message);
        //Creamos un error para manejarlo en el controlador
        throw new Error("Error al insertar usuario en la base de datos");
    } finally {
        //Liberamos la conexion
        if (conexion) conexion.release();
    }
}

//MODELO PARA INICIAR SESION
const seleccionarUsuarioModel = async (correoUsuario) => {
    //Variable para guardar la conexion
    let conexion;
    try {
        //Ejecutamos y guardamos la conexion
        conexion = await pool.getConnection();

        //Llamamos al procedimiento de seleccionar usario por correo
        const [result] = await conexion.execute("CALL seleccionarUsuarioCorreo(?)", [correoUsuario]);

        //Retornamos la fila siempre en cuando exista el usuario con el correo especificado, si no hay ninguna fila retornamos null
        return result[0];
    } catch (err) {
        //Mostramos el error
        console.error("Error al buscar usuario por correo:", err.message);
        //Creamos un error para manejarlo en el controlador
        throw new Error("Error en la base de datos al buscar usuario");
    } finally {
        //Liberamos la conexion
        if (conexion) conexion.release();
    }
};

// Modulo para registrar un codigo de verificaión de un correo
const insertarVerificacionCorreoModel = async (correo, codigo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarCodigoVerificacion(?, ?)", [correo, codigo]);

        return result;
    } catch (err) {
        //Mostramos el error
        console.error("Error al insertar codigo de verificacion del correo:", err.message);
        //Creamos un error para manejarlo en el controlador
        throw new Error("Error al insertar codigo de verificacion en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para validar el codigo de verificacion del correo
const validarCodigoVerificacionCorreoModel = async (correo, codigo) => {
    const conexion = await pool.getConnection();
    try {
        // 1️⃣ Buscar el registro
        const [rows] = await conexion.execute(
            "CALL obtenerVerificacionCorreo(?, ?)",
            [correo, codigo]
        );

        const registro = rows[0][0]; // Primer resultado

        // Validaciones en servidor
        if (!registro) {
            throw Object.assign(new Error('Código incorrecto'), { status: 400 });
        }

        if (registro.verificado === 1) {
            throw Object.assign(new Error('El correo ya fue validado'), { status: 400 });
        }

        const expiracion = new Date(registro.expiracionVerificacion);
        if (expiracion < new Date()) {
            throw Object.assign(new Error('El código ha expirado, genere uno nuevo'), { status: 400 });
        }

        // Si todo está correcto, marcar como verificado
        await conexion.execute(
            "CALL actualizarVerificacionCorreo(?, ?)",
            [correo, codigo]
        );

        return {ok: true, mensaje: 'Correo verificado con éxito' };
    } catch (err) {
        console.error("Error al validar código de verificación del correo:", err.message);
        throw err;
    } finally {
        conexion.release();
    }
};

// Modelo para traer la verificacion de un correo si esta verificado o no
const obtenerEstadoVerificacionCorreoModel = async (correo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            "CALL obtenerEstadoVerificacionCorreo(?)",
            [correo]
        );

        // MySQL devuelve los resultados dentro de un array adicional cuando se usa CALL
        const resultado = rows[0]?.[0] || null;

        return resultado; // Devuelve { verificado: 0 } o { verificado: 1 } o null si no hay datos
    } catch (err) {
        console.error("Error al obtener el estado de verificación del correo:", err.message);
        throw Object.assign(new Error('Error al obtener el estado de verificación del correo'), { status: 500 });
    } finally {
        if (conexion) conexion.release();
    }
};

//Exportamos modulo
module.exports = {
    insertarUsuarioModel,
    seleccionarUsuarioModel,
    insertarVerificacionCorreoModel,
    validarCodigoVerificacionCorreoModel,
    obtenerEstadoVerificacionCorreoModel
};