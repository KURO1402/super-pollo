USE super_pollo;

DELIMITER //

/* PROCEDIMIENTO ALMACENADO insertarRol */
CREATE PROCEDURE insertarRol(
    IN p_nombreRol VARCHAR(50)
)
BEGIN
    INSERT INTO rolUsuarios(nombreRol) 
    VALUES (p_nombreRol);
END //

/* PROCEDIMIENTO ALMACENADO listarRoles */
CREATE PROCEDURE listarRoles()
BEGIN
    SELECT idRol, nombreRol 
    FROM rolUsuarios;
END //

/* PROCEDIMIENTO ALMACENADO actualizarRol */
CREATE PROCEDURE actualizarRol(
    IN p_idRol INT,
    IN p_nombreRol VARCHAR(50)
)
BEGIN
    UPDATE rolUsuarios
    SET nombreRol = p_nombreRol
    WHERE idRol = p_idRol;
END //

/* PROCEDIMIENTO ALMACENADO eliminarRol */
CREATE PROCEDURE eliminarRol(
    IN p_idRol INT
)
BEGIN
    DELETE FROM rolUsuarios 
    WHERE idRol = p_idRol;
END //

/* PROCEDIMIENTO ALMACENADO insertarUsuario */
CREATE PROCEDURE insertarUsuario (
    IN p_nombresUsuario VARCHAR(50),
    IN p_apellidosUsuario VARCHAR(50),
    IN p_correoUsuario VARCHAR(50),
    IN p_clave CHAR(60),
    IN p_numeroDocumentoUsuario VARCHAR(12),
    IN p_telefonoUsuario VARCHAR(15),
    IN p_idRol INT,
    IN p_idTipoDocumento INT
)
BEGIN 
    INSERT INTO usuarios(
           nombresUsuario, apellidosUsuario, correoUsuario, clave, 
           numeroDocumentoUsuario, telefonoUsuario, idRol, idTipoDocumento
    )
    VALUES (
           p_nombresUsuario, p_apellidosUsuario, p_correoUsuario, p_clave, 
           p_numeroDocumentoUsuario, p_telefonoUsuario, p_idRol, p_idTipoDocumento
    );
END //

/* PROCEDIMIENTO ALMACENADO listarUsuarios */
CREATE PROCEDURE listarUsuarios()
BEGIN 
    SELECT
          nombresUsuario,
          apellidosUsuario,
          correoUsuario,
          numeroDocumentoUsuario,
          telefonoUsuario,
          estadoUsuario,
          idRol,
          idTipoDocumento
    FROM usuarios;
END //

/* PROCEDIMIENTO ALMACENADO actualizarUsuario */
CREATE PROCEDURE actualizarUsuario(
    IN p_idUsuario INT,
    IN p_nombresUsuario VARCHAR(50),
    IN p_apellidosUsuario VARCHAR(50),
    IN p_correoUsuario VARCHAR(50),
    IN p_numeroDocumentoUsuario VARCHAR(12),
    IN p_telefonoUsuario VARCHAR(15),
    IN p_idRol INT,
    IN p_idTipoDocumento INT
)
BEGIN 
    UPDATE usuarios
    SET nombresUsuario = p_nombresUsuario, 
        apellidosUsuario = p_apellidosUsuario,
        correoUsuario = p_correoUsuario,
        numeroDocumentoUsuario = p_numeroDocumentoUsuario, 
        telefonoUsuario = p_telefonoUsuario, 
        idRol = p_idRol, 
        idTipoDocumento = p_idTipoDocumento
   WHERE idUsuario = p_idUsuario;
END //
    
/* PROCEDIMIENTO ALMACENADO eliminarUsuario */   
CREATE PROCEDURE eliminarUsuario(
    IN p_idUsuario INT
) 
BEGIN
    DELETE FROM usuarios
    WHERE idUsuario = p_idUsuario;
END //

/* PROCEDIMIENTO ALMACENADO iniciarSesion */ 
CREATE PROCEDURE iniciarSesion(
    IN p_correoUsuario VARCHAR(50),
    IN p_clave CHAR(60)
)
BEGIN
    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.correoUsuario,
        r.nombreRol
    FROM usuarios u
    INNER JOIN rolUsuarios r ON u.idRol = r.idRol
    WHERE u.correoUsuario = p_correoUsuario 
      AND u.clave = p_clave;
END //

DELIMITER ;

