//Importamos al conexion a base de datos
const pool = require("../../config/conexionDB");

//Esto es la funcion para registrar usuario que recibe como parametros un objeto con los datos y la clave encriptada
const insertarUsuarioDB = async (datos, claveEncriptada) => {
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
        const [result] = await conexion.execute("CALL insertarUsuario(?, ? ,?, ?, ?, ?, ?, ?)",
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

        //retonamos el resultado paar el controlador
        return result
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

//Funcion para obtener un usuario por correo
const buscarUsuarioPorCorreoDB = async (correoUsuario) => {
    //Variable para guardar la conexion
    let conexion;
    try {
        //Ejecutamos y guardamos la conexion
        conexion = await pool.getConnection();

        //Llamamos al procedimiento de seleccionar usario por correo
        const [rows] = await conexion.execute("CALL seleccionarUsuarioCorreo(?)", [correoUsuario]);

        //Retornamos la fila siempre en cuando exista el usuario con el correo especificado, si no hay ninguna fila retornamos null
        return rows.length > 0 ? rows[0] : null;
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

module.exports = {
    insertarUsuarioDB,
    buscarUsuarioPorCorreoDB
};