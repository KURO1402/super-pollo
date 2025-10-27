USE super_pollo;

-- Eliminar procedimientos existentes
DROP PROCEDURE IF EXISTS insertarRol;
DROP PROCEDURE IF EXISTS listarRoles;
DROP PROCEDURE IF EXISTS actualizarRol;
DROP PROCEDURE IF EXISTS eliminarRol;
DROP PROCEDURE IF EXISTS listarTipoDocumento;
DROP PROCEDURE IF EXISTS listarUsuarios;
DROP PROCEDURE IF EXISTS actualizarUsuario;
DROP PROCEDURE IF EXISTS actualizarClaveUsuario;
DROP PROCEDURE IF EXISTS actualizarCorreoUsuario;
DROP PROCEDURE IF EXISTS eliminarUsuario;
DROP PROCEDURE IF EXISTS seleccionarUsuarioId;
DROP PROCEDURE IF EXISTS obtenerClaveUsuario;

DELIMITER //

-- SECCIÓN 1: ROLES

CREATE PROCEDURE insertarRol(
    IN p_nombreRol VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar el rol.';
    END;

    START TRANSACTION;

    INSERT INTO rolUsuarios(nombreRol)
    VALUES (p_nombreRol);

    COMMIT;
END //

CREATE PROCEDURE listarRoles()
BEGIN
    SELECT idRol, nombreRol 
    FROM rolUsuarios;
END //

CREATE PROCEDURE actualizarRol(
    IN p_idRol INT,
    IN p_nombreRol VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar el rol.';
    END;

    START TRANSACTION;

    UPDATE rolUsuarios
    SET nombreRol = p_nombreRol
    WHERE idRol = p_idRol;

    COMMIT;
END //

CREATE PROCEDURE eliminarRol(
    IN p_idRol INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar el rol.';
    END;

    START TRANSACTION;

    DELETE FROM rolUsuarios
    WHERE idRol = p_idRol;

    COMMIT;
END //

/* ============================================================
   📁 SECCIÓN 2: TIPO DE DOCUMENTO
   ============================================================ */

CREATE PROCEDURE listarTipoDocumento()
BEGIN
    SELECT idTipoDocumento, nombreTipoDocumento
    FROM tipoDocumento;
END //

/* ============================================================
   📁 SECCIÓN 3: USUARIOS
   ============================================================ */

-- Procedimiento para actualizar datos de un usuario
CREATE PROCEDURE actualizarUsuario(
    IN p_idUsuario INT,
    IN p_nombresUsuario VARCHAR(50),
    IN p_apellidosUsuario VARCHAR(50),
    IN p_numeroDocumentoUsuario VARCHAR(12),
    IN p_telefonoUsuario VARCHAR(15),
    IN p_idTipoDocumento INT
)
BEGIN
    -- 🔹 Manejador de errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar los datos del usuario.';
    END;

    START TRANSACTION;

    -- 🔸 Actualizar los datos 
    UPDATE usuarios
    SET 
        nombresUsuario = p_nombresUsuario,
        apellidosUsuario = p_apellidosUsuario,
        numeroDocumentoUsuario = p_numeroDocumentoUsuario,
        telefonoUsuario = p_telefonoUsuario,
        idTipoDocumento = p_idTipoDocumento
    WHERE idUsuario = p_idUsuario;

    COMMIT;

    -- 🔹 Retornar mensaje de éxito
    SELECT 'Usuario actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarCorreoUsuario(
    IN p_idUsuario INT,
    IN p_correoUsuario VARCHAR(50)
)
BEGIN
    -- 🔹 Manejador de errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar el correo del usuario.';
    END;

    START TRANSACTION;

    -- 🔸 Actualizar solo el correo
    UPDATE usuarios
    SET correoUsuario = p_correoUsuario
    WHERE idUsuario = p_idUsuario;

    COMMIT;

    -- 🔹 Retornar mensaje de éxito
    SELECT 'Correo actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarClaveUsuario(
    IN p_idUsuario INT,
    IN p_clave CHAR(60)
)
BEGIN
    -- 🔹 Manejador de errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar la contraseña del usuario.';
    END;

    START TRANSACTION;

    -- 🔸 Actualizar solo la contraseña
    UPDATE usuarios
    SET clave = p_clave
    WHERE idUsuario = p_idUsuario;

    COMMIT;

    -- 🔹 Retornar mensaje de éxito
    SELECT 'Contraseña actualizada correctamente' AS mensaje;
END //


CREATE PROCEDURE eliminarUsuario(
    IN p_idUsuario INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar el usuario.';
    END;

    START TRANSACTION;

    DELETE FROM usuarios
    WHERE idUsuario = p_idUsuario;

    COMMIT;
END //

CREATE PROCEDURE obtenerClaveUsuario (
    IN p_idUsuario INT
)
BEGIN
    SELECT clave
    FROM usuarios
    WHERE idUsuario = p_idUsuario;
END //


CREATE PROCEDURE seleccionarUsuarioId(
    IN p_idUsuario INT
)
BEGIN
    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.correoUsuario,
        u.clave,
        u.idRol
    FROM usuarios u
    WHERE u.idUsuario = p_idUsuario
    AND u.estadoUsuario = 1;
END //

DELIMITER ;