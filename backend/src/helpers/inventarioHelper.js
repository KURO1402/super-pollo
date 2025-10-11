// helpers para obtener el enum de la bd
const db = require('../config/conexionDB'); 

const obtenerValoresEnum = async (tabla, campo) => {
    const [rows] = await db.query(`SHOW COLUMNS FROM \`${tabla}\` WHERE Field = ?`, [campo]);

    if (!rows || rows.length === 0) {
        throw new Error(`No se encontró el campo '${campo}' en la tabla '${tabla}'`);
    }

    const enumDef = rows[0].Type; 
    
    return enumDef
        .replace(/^enum\(/, '')
        .replace(/\)$/, '')
        .split(',')
        .map(v => v.replace(/'/g, ''));
};

module.exports = {
    obtenerValoresEnum
};
