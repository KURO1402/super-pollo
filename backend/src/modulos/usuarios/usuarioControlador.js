const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { insertarUsuarioDB } = require("./usuarioModelo");

const insertarUsuario = async (req, res) => {
    res.json({mensaje: "Solo trata con el cliente no aplica logica"});
}


module.exports = insertarUsuario;
