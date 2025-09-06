// middleware/autenticacionMiddleware.js
const jwt = require('jsonwebtoken');

const autenticacionToken = (req, res, next) => {
  // Obtener el token desde los headers de la peticion
  const autenticacionHeader = req.headers['authorization'];

  //Aqui se guarda el token pero primero se verifica que el token no sea undefined para ejecutar el metodo split de js
  //que lo que hace es separar texto segun un  caracter que tu le pases, hacemos esto por que el token del header biene asi 
  //"Bearer <token>" por eso quitamos la palabra Bearer
  const token = autenticacionHeader && autenticacionHeader.split(' ')[1]; 

  //Verificamos que exista el token y no sea undefined o algun valor invalido
  //si se cumple la condicion mandamos un estado de 401 Unauthorized que niega el acceso y mandamos un mensaje informativo 
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Ahora verificamos que el token proporcionado sea igual al proporcionado al iniciar sesion o que se ha modificado su contenido
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
        //si se cumple la condicion le negamos el acceso con un status 403(Forbidden)
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    // Aqui se pone la informacion decodificada del token y se le adjunta a la solicitud(request)
    req.usuario = usuario;
    //Llamamos a next que hace que se ejecute la siguiente funcion
    next();
  });
};

//Exportamos el modulo
module.exports = autenticacionToken;