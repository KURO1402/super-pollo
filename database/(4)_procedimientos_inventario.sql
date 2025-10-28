USE super_pollo;

-- Eliminar procedimientos de insumos
DROP PROCEDURE IF EXISTS insertarInsumo;
DROP PROCEDURE IF EXISTS obtenerInsumos;
DROP PROCEDURE IF EXISTS obtenerInsumosPaginacion;
DROP PROCEDURE IF EXISTS obtenerInsumoPorID;
DROP PROCEDURE IF EXISTS actualizarInsumo;
DROP PROCEDURE IF EXISTS eliminarInsumo;
DROP PROCEDURE IF EXISTS registrarMovimientoStock;
DROP PROCEDURE IF EXISTS listarMovimientos;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorInsumo;
DROP PROCEDURE IF EXISTS obtenerStockActual;
DROP PROCEDURE IF EXISTS eliminarMovimientoStock;
DROP PROCEDURE IF EXISTS obtenerConteoInsumosPorNombre;

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
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_stockActual DECIMAL(10,2);

    -- Iniciar transacción
    START TRANSACTION;

    -- Registrar movimiento con usuario
    INSERT INTO movimientosStock (
        idInsumo,
        cantidadMovimiento,
        tipoMovimiento,
        detallesMovimiento,
        idUsuario
    ) VALUES (
        p_idInsumo,
        p_cantidad,
        p_tipoMovimiento,
        P_detallesMovimiento,
        p_idUsuario
    );

    -- Actualizar stock del insumo
    IF p_tipoMovimiento = 'entrada' THEN
        UPDATE insumos
        SET stockInsumo = stockInsumo + p_cantidad
        WHERE idInsumo = p_idInsumo;
    ELSE
        UPDATE insumos
        SET stockInsumo = stockInsumo - p_cantidad
        WHERE idInsumo = p_idInsumo;
    END IF;

    COMMIT;
    SELECT CONCAT(p_tipoMovimiento, ' registrado exitosamente') AS mensaje;
END //

CREATE PROCEDURE listarMovimientos()
BEGIN
    SELECT m.idMovimientoStock, i.nombreInsumo, m.tipoMovimiento, 
           m.cantidadMovimiento, m.fechaMovimiento, m.idUsuario
    FROM movimientosstock m
    JOIN insumos i ON m.idInsumo = i.idInsumo
    ORDER BY m.fechaMovimiento DESC;
END //

CREATE PROCEDURE obtenerMovimientosPorInsumo(
    IN p_idInsumo INT
)
BEGIN
    SELECT * FROM movimientosstock WHERE idInsumo = p_idInsumo ORDER BY fechaMovimiento DESC;
END //

CREATE PROCEDURE obtenerStockActual(
    IN p_idInsumo INT
)
BEGIN
    SELECT 
        i.idInsumo,
        i.nombreInsumo,
        i.stockInsumo
            + IFNULL((
                SELECT SUM(
                    CASE 
                        WHEN m.tipoMovimiento = 'entrada' THEN m.cantidadMovimiento
                        ELSE -m.cantidadMovimiento
                    END
                )
                FROM movimientosStock AS m
                WHERE m.idInsumo = i.idInsumo
            ), 0) AS stockActual
    FROM insumos AS i
    WHERE i.idInsumo = p_idInsumo;
END //

CREATE PROCEDURE eliminarMovimientoStock(
    IN p_idMovimiento INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM movimientosStock WHERE idMovimientoStock = p_idMovimiento) THEN
        DELETE FROM movimientosStock 
        WHERE idMovimientoStock = p_idMovimiento;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Movimiento no encontrado';
    END IF;
END //

DELIMITER ;