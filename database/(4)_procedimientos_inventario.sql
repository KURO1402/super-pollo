USE super_pollo;

-- Eliminar procedimientos de insumos
DROP PROCEDURE IF EXISTS insertarInsumo;
DROP PROCEDURE IF EXISTS obtenerInsumos;
DROP PROCEDURE IF EXISTS obtenerInsumosPaginacion;
DROP PROCEDURE IF EXISTS obtenerInsumoPorID;
DROP PROCEDURE IF EXISTS actualizarInsumo;
DROP PROCEDURE IF EXISTS eliminarInsumo;
DROP PROCEDURE IF EXISTS registrarMovimientoStock;
DROP PROCEDURE IF EXISTS obtenerMovimientos;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorInsumo;
DROP PROCEDURE IF EXISTS obtenerStockActual;
DROP PROCEDURE IF EXISTS eliminarMovimientoStock;
DROP PROCEDURE IF EXISTS obtenerConteoInsumosPorNombre;
DROP PROCEDURE IF EXISTS buscarMovimientosPorInsumo;
DROP PROCEDURE IF EXISTS buscarMovimientosPorUsuario;
DROP PROCEDURE IF EXISTS buscarMovimientosPorFecha;
DROP PROCEDURE IF EXISTS buscarMovimientosPorTipo;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorVenta;

DELIMITER //
-- =============================================
-- PROCEDIMIENTOS PARA INSUMOS
-- =============================================

CREATE PROCEDURE insertarInsumo(
    IN p_nombreInsumo VARCHAR(100),
    IN p_stockInsumo DECIMAL(10,2),
    IN p_unidadMedida VARCHAR(30)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar insumo.';
    END;

    START TRANSACTION;

    INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida)
    VALUES (
        p_nombreInsumo,
        p_stockInsumo,
        p_unidadMedida
    );

    COMMIT;

    SELECT 'Insumo insertado correctamente.' AS mensaje;
END //

CREATE PROCEDURE obtenerInsumos()
BEGIN
    SELECT 
        idInsumo,
        nombreInsumo,
        stockInsumo,
        unidadMedida
    FROM insumos
    WHERE estadoInsumo = 1 
    ORDER BY idInsumo DESC;
END //

CREATE PROCEDURE obtenerInsumosPaginacion(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        idInsumo,
        nombreInsumo,
        stockInsumo,
        unidadMedida
    FROM insumos
    WHERE estadoInsumo = 1
    ORDER BY idInsumo DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE obtenerInsumoPorId(
    IN p_idInsumo INT
)
BEGIN
    SELECT 
        idInsumo,
        nombreInsumo,
        stockInsumo,
        unidadMedida
    FROM insumos
    WHERE idInsumo = p_idInsumo 
      AND estadoInsumo = 1;
END //

CREATE PROCEDURE obtenerConteoInsumosPorNombre(
    IN p_nombreInsumo VARCHAR(100)
)
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM insumos
    WHERE nombreInsumo = p_nombreInsumo
    AND estadoInsumo = 1;

    SELECT v_count AS cantidadInsumos;

END //

CREATE PROCEDURE actualizarInsumo(
    IN p_idInsumo INT,
    IN p_nombreInsumo VARCHAR(100),
    IN p_unidadMedida VARCHAR(30)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar insumo.';
    END;
    
    START TRANSACTION;

    UPDATE insumos
    SET nombreInsumo = p_nombreInsumo,
        unidadMedida = p_unidadMedida
    WHERE idInsumo = p_idInsumo;

    COMMIT;

    SELECT 'Insumo actualizado correctamente' AS mensaje;

END //

CREATE PROCEDURE eliminarInsumo(
    IN p_idInsumo INT
)
BEGIN
    -- Manejador de errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar el insumo.';
    END;

    START TRANSACTION;

    -- Actualizar el estado del insumo a inactivo (0)
    UPDATE insumos
    SET estadoInsumo = 0
    WHERE idInsumo = p_idInsumo;

    COMMIT;
    SELECT 'Insumo eliminado correctamente' as mensaje;
END //

-- =============================================
-- PROCEDIMIENTOS PARA MOVIMIENTOS DE STOCK
-- =============================================

CREATE PROCEDURE registrarMovimientoStock(
    IN p_idInsumo INT,
    IN p_cantidad DECIMAL(10,2),
    IN p_tipoMovimiento ENUM('entrada','salida'),
    IN P_detallesMovimiento TEXT,
    IN p_idVenta INT,
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_stockActual DECIMAL(10,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar movimiento de insumos.';
    END;

    -- Iniciar transacción
    START TRANSACTION;

    -- Registrar movimiento con usuario
    INSERT INTO movimientosStock (
        idInsumo,
        cantidadMovimiento,
        tipoMovimiento,
        detallesMovimiento,
        idVenta,
        idUsuario
    ) VALUES (
        p_idInsumo,
        p_cantidad,
        p_tipoMovimiento,
        P_detallesMovimiento,
        p_idVenta,
        p_idUsuario
    );

    -- Actualizar stock del insumo
    IF p_tipoMovimiento = 'entrada' THEN
        UPDATE insumos
        SET stockInsumo = stockInsumo + p_cantidad
        WHERE idInsumo = p_idInsumo;
    ELSEIF p_tipoMovimiento = 'salida' THEN
        UPDATE insumos
        SET stockInsumo = stockInsumo - p_cantidad
        WHERE idInsumo = p_idInsumo;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tipo movimiento no valido.';
    END IF;

    COMMIT;
    SELECT CONCAT(p_tipoMovimiento, ' registrado exitosamente') AS mensaje;
END //

CREATE PROCEDURE obtenerMovimientos(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    ORDER BY m.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //


CREATE PROCEDURE buscarMovimientosPorInsumo(
    IN p_nombreInsumo VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    WHERE i.nombreInsumo LIKE CONCAT('%', p_nombreInsumo, '%')
    ORDER BY m.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE buscarMovimientosPorUsuario(
    IN p_nombreApellido VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    WHERE u.nombresUsuario LIKE CONCAT('%', p_nombreApellido, '%')
       OR u.apellidosUsuario LIKE CONCAT('%', p_nombreApellido, '%')
    ORDER BY m.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END // 

CREATE PROCEDURE buscarMovimientosPorFecha(
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    WHERE DATE(m.fechaMovimiento) BETWEEN p_fechaInicio AND p_fechaFin
    ORDER BY m.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE buscarMovimientosPorTipo(
    IN p_tipoMovimiento ENUM('entrada','salida'),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    WHERE m.tipoMovimiento = p_tipoMovimiento
    ORDER BY m.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE obtenerMovimientosPorVenta(
    IN p_idVenta INT
)
BEGIN
    SELECT 
        i.idInsumo,
        m.tipoMovimiento AS nombreMovimiento,
        i.nombreInsumo,
        m.cantidadMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%d-%m-%Y') AS fechaMovimiento,
        DATE_FORMAT(m.fechaMovimiento, '%H:%i:%s') AS horaMovimiento,
        m.detallesMovimiento,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosStock m
    INNER JOIN insumos i ON m.idInsumo = i.idInsumo
    INNER JOIN usuarios u ON m.idUsuario = u.idUsuario
    WHERE m.idVenta = p_idVenta
    ORDER BY m.fechaMovimiento DESC;
END //

DELIMITER ;