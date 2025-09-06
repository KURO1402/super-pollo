const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsuarioModelo = require("./usuarioModelo");

const UsuarioControlador = {
    registrar: async (req, res) => {
        try {
            const { clave, ...datosUsuario } = req.body;

            // Validación de campos obligatorios
            if (!datosUsuario.nombresUsuario || !datosUsuario.apellidosUsuario || 
                !datosUsuario.correoUsuario || !clave || 
                !datosUsuario.numeroDocumentoUsuario || 
                !datosUsuario.telefonoUsuario || 
                !datosUsuario.idRol || !datosUsuario.idTipoDocumento) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }

            // Encriptar la clave
            const hash = await bcrypt.hash(clave, 10);

            // Guardar usuario en BD
            await UsuarioModelo.insertar(datosUsuario, hash);

            // Crear tokens
            const accessToken = jwt.sign(
                { correo: datosUsuario.correoUsuario },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { correo: datosUsuario.correoUsuario },
                process.env.JWT_SECRET_REFRESH,
                { expiresIn: "1d" }
            );

            res.status(201).json({
                mensaje: "Usuario Registrado",
                accessToken,
                refreshToken,
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //refrescar el accsesToken usando refreshToken
    refreshToken: (req, res) =>{
        try {
            //obtenemos el refresh del body
            const{refreshToken} = req.body;

            //validamso si existe, si no hay -> no autorizado
            if(!refreshToken){
                return res.status(401).json({error:"Se requiere el refresh token"});
            }

            //verificamos que el refresh token no haya expirado y sea valido
            jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, decoded) => {
                if(err){
                    return res.status(403).json({error: "refresh token invalido o expirado"});
                }
                //creamos un nuevo access token  con los datos del usuario
                const nuevoAccessToken = jwt.sign(
                    {correo: decoded.correo},
                    process.env.JWT_SECRET,
                    {expiresIn: "15m"}
                );
                //respondemos con el nuevo accesstokken
                res.json({
                    mensaje:"Nuevo accessToken generado",
                    accessToken: nuevoAccessToken,
                });
            });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
};

module.exports = UsuarioControlador;
