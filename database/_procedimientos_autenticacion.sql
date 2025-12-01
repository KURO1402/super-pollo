USE super_pollo;

DROP PROCEDURE IF EXISTS insertarUsuario;
DROP PROCEDURE IF EXISTS registrarCodigoVerificacion;
DROP PROCEDURE IF EXISTS actualizarVerificacionCorreo;
DROP PROCEDURE IF EXISTS obtenerEstadoVerificacionCorreo;
DROP PROCEDURE IF EXISTS seleccionarUsuarioCorreo;
DROP PROCEDURE IF EXISTS obtenerVerificacionCorreo;

DELIMITER //

--  Procedimiento para insertar un nuevo usuario
CREATE PROCEDURE insertarUsuario(
    IN p_nombresUsuario VARCHAR(50),
    IN p_apellidosUsuario VARCHAR(50),
    IN p_correoUsuario VARCHAR(50),
    IN p_clave CHAR(60),
    IN p_telefonoUsuario VARCHAR(15)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar usuario.';
    END;

    START TRANSACTION;

    INSERT INTO usuarios(
        nombresUsuario, 
        apellidosUsuario, 
        correoUsuario, 
        clave, 
        telefonoUsuario
    )
    VALUES (
        p_nombresUsuario, 
        p_apellidosUsuario, 
        p_correoUsuario, 
        p_clave,
        p_telefonoUsuario
    );

    SELECT 
        u.idUsuario,
        u.nombresUsuario,
        u.apellidosUsuario,
        u.idRol
    FROM usuarios u
    WHERE u.idUsuario = LAST_INSERT_ID();

    COMMIT;
END //

-- Procedimiento para registrar el codigo de verificacion
CREATE PROCEDURE registrarCodigoVerificacion(
    IN p_correo VARCHAR(100),
    IN p_codigo VARCHAR(6)
)
BEGIN
    DECLARE v_existente INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar o actualizar el código de verificación.';
    END;

    START TRANSACTION;

    SELECT COUNT(*) INTO v_existente
    FROM verificacioncorreos
    WHERE correoVerificacion = p_correo AND verificado = 0;

    IF v_existente > 0 THEN
        UPDATE verificacioncorreos
        SET 
            codigoVerificacion = p_codigo,
            expiracionVerificacion = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
            registroVerificacion = NOW()
        WHERE correoVerificacion = p_correo AND verificado = 0;
    ELSE
        INSERT INTO verificacioncorreos (
            correoVerificacion,
            codigoVerificacion,
            expiracionVerificacion
        )
        VALUES (
            p_correo,
            p_codigo,
            DATE_ADD(NOW(), INTERVAL 5 MINUTE)
        );
    END IF;

    COMMIT;
END //

CREATE PROCEDURE actualizarVerificacionCorreo(
    IN p_correo VARCHAR(100),
    IN p_codigo VARCHAR(6)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar la verificación del correo.';
    END;

    START TRANSACTION;

    UPDATE verificacioncorreos
    SET verificado = 1
    WHERE correoVerificacion = p_correo
      AND codigoVerificacion = p_codigo;

    COMMIT;
END //


-- Procedimiento para usarlo para el login
CREATE PROCEDURE obtenerEstadoVerificacionCorreo(
    IN p_correo VARCHAR(100)
)
BEGIN
    SELECT verificado
    FROM verificacioncorreos
    WHERE correoVerificacion = p_correo
    ORDER BY registroVerificacion DESC
    LIMIT 1;
END //

-- Procedimiento para usarlo en el login
CREATE PROCEDURE seleccionarUsuarioCorreo(
    IN p_correoUsuario VARCHAR(100)
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
    WHERE u.correoUsuario = p_correoUsuario;
END //

CREATE PROCEDURE obtenerVerificacionCorreo(
    IN p_correo VARCHAR(100),
    IN p_codigo VARCHAR(6)
)
BEGIN
    SELECT 
        idVerificacion,
        expiracionVerificacion,
        verificado
    FROM verificacioncorreos
    WHERE correoVerificacion = p_correo
      AND codigoVerificacion = p_codigo
    LIMIT 1;
END //

DELIMITER ;