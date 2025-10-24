USE super_pollo;

DROP PROCEDURE IF EXISTS insertarInsumo;
DROP PROCEDURE IF EXISTS obtenerInsumos;
DROP PROCEDURE IF EXISTS obtenerInsumoPorID;
DROP PROCEDURE IF EXISTS actualizarInsumo;
DROP PROCEDURE IF EXISTS eliminarInsumo;
DROP PROCEDURE IF EXISTS registrarMovimientoStock;
DROP PROCEDURE IF EXISTS listarMovimientos;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorInsumo;
DROP PROCEDURE IF EXISTS obtenerStockActual;
DROP PROCEDURE IF EXISTS eliminarMovimientoStock;

DELIMITER //
CREATE PROCEDURE insertarInsumo(
    IN p_nombreInsumo VARCHAR(50),
    IN p_stockInsumo DECIMAL(10,2),
    IN p_unidadMedida VARCHAR(20),
    IN p_categoriaProducto ENUM('insumo','bebida')
)
BEGIN
    INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida, categoriaProducto, estadoInsumo)
    VALUES (p_nombreInsumo, p_stockInsumo, p_unidadMedida, p_categoriaProducto,
            CASE WHEN p_stockInsumo <= 0 THEN '0' ELSE '1' END);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE obtenerInsumos()
BEGIN
    SELECT * FROM insumos ORDER BY idInsumo DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE obtenerInsumoPorID(IN p_idInsumo INT)
BEGIN
    SELECT * FROM insumos WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE actualizarInsumo(
    IN p_idInsumo INT,
    IN p_nombreInsumo VARCHAR(50),
    IN p_stockInsumo DECIMAL(10,2),
    IN p_unidadMedida VARCHAR(20),
    IN p_categoriaProducto ENUM('insumo','bebida')
)
BEGIN
    UPDATE insumos
    SET nombreInsumo = p_nombreInsumo,
        stockInsumo = p_stockInsumo,
        unidadMedida = p_unidadMedida,
        categoriaProducto = p_categoriaProducto,
        estadoInsumo = CASE 
                    WHEN p_stockInsumo <= 0 THEN '0'
                    ELSE '1'
                 END
    WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE eliminarInsumo(IN p_idInsumo INT)
BEGIN
    UPDATE insumos SET estadoInsumo = '0' WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

-- MOVIMIENTOS STOCK
DELIMITER //
CREATE PROCEDURE registrarMovimientoStock(
    IN p_idInsumo INT,
    IN p_tipoMovimiento ENUM('entrada', 'salida'),
    IN p_cantidadMovimiento DECIMAL(10,2),
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_stockActual DECIMAL(10,2);

    -- Obtener stock actual
    SELECT stockInsumo INTO v_stockActual FROM insumos WHERE idInsumo = p_idInsumo;

    -- Validar stock suficiente para salida
    IF p_tipoMovimiento = 'salida' AND v_stockActual < p_cantidadMovimiento THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente stock para realizar la salida.';
    END IF;

    -- Insertar movimiento
    INSERT INTO movimientosstock (idInsumo, tipoMovimiento, cantidadMovimiento, fechaMovimiento, idUsuario)
    VALUES (p_idInsumo, p_tipoMovimiento, p_cantidadMovimiento, NOW(), p_idUsuario);

    -- Actualizar stock
    IF p_tipoMovimiento = 'entrada' THEN
        UPDATE insumos SET stockInsumo = stockInsumo + p_cantidadMovimiento WHERE idInsumo = p_idInsumo;
    ELSE
        UPDATE insumos SET stockInsumo = stockInsumo - p_cantidadMovimiento WHERE idInsumo = p_idInsumo;
    END IF;

    -- Actualizar estado
    UPDATE insumos
    SET estadoInsumo = CASE WHEN stockInsumo <= 0 THEN '0' ELSE '1' END
    WHERE idInsumo = p_idInsumo;
END //

CREATE PROCEDURE listarMovimientos()
BEGIN
    SELECT m.idMovimientoStock, i.nombreInsumo, m.tipoMovimiento, 
           m.cantidadMovimiento, m.fechaMovimiento, m.idUsuario
    FROM movimientosstock m
    JOIN insumos i ON m.idInsumo = i.idInsumo
    ORDER BY m.fechaMovimiento DESC;
END //

CREATE PROCEDURE obtenerMovimientosPorInsumo(IN p_idInsumo INT)
BEGIN
    SELECT * FROM movimientosstock WHERE idInsumo = p_idInsumo ORDER BY fechaMovimiento DESC;
END //
DELIMITER ;

-- Procedimeitno para hhalar el stock actual
DELIMITER $$

CREATE PROCEDURE obtenerStockActual (
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
END$$

DELIMITER ;

-- Procedimiento para eliminar un movimiento
DELIMITER $$

CREATE PROCEDURE eliminarMovimientoStock (
    IN p_idMovimiento INT
)
BEGIN
    -- Primero verificamos si el movimiento existe
    IF EXISTS (SELECT 1 FROM movimientosStock WHERE idMovimientoStock = p_idMovimiento) THEN
        DELETE FROM movimientosStock 
        WHERE idMovimientoStock = p_idMovimiento;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Movimiento no encontrado';
    END IF;
END$$

DELIMITER ;
