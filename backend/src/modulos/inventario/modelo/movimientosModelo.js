//conexion a la BD
const db = require("../../../config/conexionDB");

//registramos un movimiento del stock y actualizamos stock del insumo
const registrarMovimientoModel = async (datosMovimiento) => {
    //Iniciamos la transaccion 
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); //inicio de la transaccion

        //insertamos el movimiento en la bd
        const [resultadoMovimiento] = await connection.query(
            `INSERT INTO movimientosstock (idInsumo, tipoMovimiento, cantidadMovimiento, fechaMovimiento, idUsuario) 
            VALUES (?, ?, ?, NOW(), ?)`,
            [
                datosMovimiento.idInsumo,
                datosMovimiento.tipoMovimiento,
                datosMovimiento.cantidadMovimiento,
                datosMovimiento.idUsuario,
            ]
        );
        //Actualizamos el stock del insumo segun el tipo de movimiento
        const operacion =
        datosMovimiento.tipoMovimiento === "entrada"
        ? "+"
        : "-";

        await connection.query(
            `UPDATE insumos
            SET stockInsumo = stockInsumo ${operacion}?
            WHERE idInsumo = ?`,
            [datosMovimiento.cantidadMovimiento, datosMovimiento.idInsumo] 
        );
        //confirmamos la transaccion 
        await connection.commit();

        //retornamos el id del movimiento creado
        return {
            idMovimiento: resultadoMovimiento.insertId,
            mensaje: "Movimiento registrado y stock actualizado correctamente"
        }
    } catch (error) {
        //si algo falla revertimso los cambios
        await connection.rollback();
        throw error;
    } finally {
        //liberamos la conexion
        connection.release();
    }
};

// Listar todos los movimientos registrados
const listarMovimientosModel = async () => {
  const [rows] = await db.query(
    `SELECT m.idMovimiento, i.nombreInsumo, m.tipoMovimiento, 
            m.cantidadMovimiento, m.fechaMovimiento, m.idUsuario
     FROM movimientosstock m
     JOIN insumos i ON m.idInsumo = i.idInsumo
     ORDER BY m.fechaMovimiento DESC`
  );
  return rows;
};

// Obtener movimientos por ID de insumo
const obtenerMovimientosPorInsumoModel = async (idInsumo) => {
  const [rows] = await db.query(
    `SELECT * FROM movimientosstock WHERE idInsumo = ? ORDER BY fechaMovimiento DESC`,
    [idInsumo]
  );
  return rows;
};

//exporamos la funciones del model
module.exports = {
    registrarMovimientoModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
}