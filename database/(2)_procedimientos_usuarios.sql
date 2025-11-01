USE super_pollo;

-- Eliminar procedimientos existentes
DROP PROCEDURE IF EXISTS insertarRol;
DROP PROCEDURE IF EXISTS listarRoles;
DROP PROCEDURE IF EXISTS actualizarRol;
DROP PROCEDURE IF EXISTS eliminarRol;
DROP PROCEDURE IF EXISTS listarTipoDocumento;
DROP PROCEDURE IF EXISTS listarUsuariosPaginacion;
DROP PROCEDURE IF EXISTS actualizarUsuario;
DROP PROCEDURE IF EXISTS actualizarClaveUsuario;
DROP PROCEDURE IF EXISTS actualizarCorreoUsuario;
DROP PROCEDURE IF EXISTS actualizarEstadoUsuario;
DROP PROCEDURE IF EXISTS seleccionarUsuarioId;
DROP PROCEDURE IF EXISTS obtenerClaveUsuario;
DROP PROCEDURE IF EXISTS listarUsuarios;
DROP PROCEDURE IF EXISTS buscarUsuariosPorValor;
DROP PROCEDURE IF EXISTS contarUsuariosActivos;

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

CREATE PROCEDURE actualizarEstadoUsuario(
    IN p_idUsuario INT,
    IN p_nuevoEstado TINYINT(1)
)
BEGIN
    DECLARE v_mensaje VARCHAR(100);

    -- Manejador de errores: si ocurre un error SQL, revierte la transacción
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar el estado del usuario.';
    END;

    START TRANSACTION;

    -- Actualizar el estado del usuario
    UPDATE usuarios
    SET estadoUsuario = p_nuevoEstado
    WHERE idUsuario = p_idUsuario;

    -- Definir mensaje según el nuevo estado
    IF p_nuevoEstado = 0 THEN
        SET v_mensaje = 'Usuario eliminado correctamente.';
    ELSEIF p_nuevoEstado = 1 THEN
        SET v_mensaje = 'Usuario recuperado correctamente.';
    ELSE
        SET v_mensaje = 'Estado del usuario actualizado correctamente.';
    END IF;

    COMMIT;
    SELECT v_mensaje AS mensaje;
END //

CREATE PROCEDURE obtenerClaveUsuario (
    IN p_idUsuario INT
)
BEGIN
    SELECT clave
    FROM usuarios
    WHERE idUsuario = p_idUsuario;
END //

CREATE PROCEDURE listarUsuarios()
BEGIN
    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.correoUsuario,
        u.numeroDocumentoUsuario,
        u.telefonoUsuario,
        u.idRol,
        r.nombreRol,
        u.idTipoDocumento,
        td.nombreTipoDocumento
    FROM usuarios u
    LEFT JOIN rolUsuarios r ON u.idRol = r.idRol
    LEFT JOIN tipoDocumento td ON u.idTipoDocumento = td.idTipoDocumento
    WHERE u.estadoUsuario = 1
    ORDER BY u.idUsuario DESC;
END //

CREATE PROCEDURE listarUsuariosPaginacion(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.correoUsuario,
        u.numeroDocumentoUsuario,
        u.telefonoUsuario,
        u.idRol,
        r.nombreRol,
        u.idTipoDocumento,
        td.nombreTipoDocumento
    FROM usuarios u
    LEFT JOIN rolUsuarios r ON u.idRol = r.idRol
    LEFT JOIN tipoDocumento td ON u.idTipoDocumento = td.idTipoDocumento
    WHERE u.estadoUsuario = 1
    ORDER BY u.idUsuario DESC
    LIMIT p_limit OFFSET p_offset;
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
        u.numeroDocumentoUsuario,
        u.telefonoUsuario,
        u.idRol,
        r.nombreRol,
        u.idTipoDocumento,
        td.nombreTipoDocumento
    FROM usuarios u
    LEFT JOIN rolUsuarios r ON u.idRol = r.idRol
    LEFT JOIN tipoDocumento td ON u.idTipoDocumento = td.idTipoDocumento
    WHERE u.estadoUsuario = 1
      AND u.idUsuario = p_idUsuario;
END //

CREATE PROCEDURE buscarUsuariosPorValor(
    IN p_valor VARCHAR(100)
)
BEGIN
    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.correoUsuario,
        u.numeroDocumentoUsuario,
        u.telefonoUsuario,
        u.idRol,
        r.nombreRol,
        u.idTipoDocumento,
        td.nombreTipoDocumento
    FROM usuarios u
    LEFT JOIN rolUsuarios r ON u.idRol = r.idRol
    LEFT JOIN tipoDocumento td ON u.idTipoDocumento = td.idTipoDocumento
    WHERE u.estadoUsuario = 1
      AND (
            u.nombresUsuario LIKE CONCAT('%', p_valor, '%') OR
            u.apellidosUsuario LIKE CONCAT('%', p_valor, '%') OR
            u.correoUsuario LIKE CONCAT('%', p_valor, '%') OR
            u.telefonoUsuario LIKE CONCAT('%', p_valor, '%')
          );
END //

CREATE PROCEDURE contarUsuariosActivos()
BEGIN
    SELECT COUNT(*) AS totalUsuariosActivos
    FROM usuarios
    WHERE estadoUsuario = 1;
END //


CREATE PROCEDURE contarTipoDocumentoPorId(
    IN p_idTipoDocumento INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipoDocumento
    WHERE idTipoDocumento = p_idTipoDocumento;
END //

DELIMITER ;