// Importamos la conexión a la base de datos
const db = require("../../../config/conexionDB");

// Insertar nuevo insumo
const insertarInsumoModel = async (datos) => {
    const [result] = await db.query(
        "INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida, categoriaProducto) VALUES (?, ?, ?, ?)",
        [datos.nombreInsumo, datos.stockInsumo, datos.unidadMedida, datos.categoriaProducto]
    );
    return { insertId: result.insertId };
};

// Obtener todos los insumos
const obtenerInsumosModel = async () => {
    const [rows] = await db.query("SELECT * FROM insumos ORDER BY idInsumo DESC");
    return rows;
};

// Obtener insumo por ID
const obtenerInsumoIDModel = async (id) => {
    const [rows] = await db.query("SELECT * FROM insumos WHERE idInsumo = ?", [id]);
    return rows[0];
};

// Actualizar insumo
const actualizarInsumoModel = async (id, datos) => {
    await db.query(
        "UPDATE insumos SET nombreInsumo=?, stockInsumo=?, unidadMedida=?, categoriaProducto=? WHERE idInsumo=?",
        [datos.nombreInsumo, datos.stockInsumo, datos.unidadMedida, datos.categoriaProducto, id]
    );
    return { idInsumo: id, ...datos };
};

// Eliminar insumo
const eliminarInsumoModel = async (id) => {
    await db.query("DELETE FROM insumos WHERE idInsumo = ?", [id]);
};

// Exportamos todos los modelos
module.exports = {
    insertarInsumoModel,
    obtenerInsumosModel,
    obtenerInsumoIDModel,
    actualizarInsumoModel,
    eliminarInsumoModel
};
