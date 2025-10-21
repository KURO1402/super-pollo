-- Usar la base de datos
USE super_pollo;

-- Eliminar procedimientos si ya existen
DROP PROCEDURE IF EXISTS insertarInsumo;
DROP PROCEDURE IF EXISTS obtenerInsumos;
DROP PROCEDURE IF EXISTS obtenerInsumoPorID;
DROP PROCEDURE IF EXISTS actualizarInsumo;
DROP PROCEDURE IF EXISTS eliminarInsumo;

-- Crear procedimiento: insertarInsumo
DELIMITER //
CREATE PROCEDURE insertarInsumo(
    IN p_nombreInsumo VARCHAR(50),
    IN p_stockInsumo DECIMAL(10,2),
    IN p_unidadMedida VARCHAR(20),
    IN p_categoriaProducto ENUM('insumo','bebida')
)
BEGIN
    INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida, categoriaProducto)
    VALUES (p_nombreInsumo, p_stockInsumo, p_unidadMedida, p_categoriaProducto);
END //
DELIMITER ;

-- Crear procedimiento: obtenerInsumos
DELIMITER //
CREATE PROCEDURE obtenerInsumos()
BEGIN
    SELECT * FROM insumos ORDER BY idInsumo DESC;
END //
DELIMITER ;

-- Crear procedimiento: obtenerInsumoPorID
DELIMITER //
CREATE PROCEDURE obtenerInsumoPorID(IN p_idInsumo INT)
BEGIN
    SELECT * FROM insumos WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

-- Crear procedimiento: actualizarInsumo
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
        categoriaProducto = p_categoriaProducto
    WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

-- Crear procedimiento: eliminarInsumo
DELIMITER //
CREATE PROCEDURE eliminarInsumo(IN p_idInsumo INT)
BEGIN
    DELETE FROM insumos WHERE idInsumo = p_idInsumo;
END //
DELIMITER ;

-- MOVIMEINTOS DEL STOCK
USE super_pollo; 

-- Eliminar procedimientos si existen
DROP PROCEDURE IF EXISTS registrarMovimientoStock;
DROP PROCEDURE IF EXISTS listarMovimientos;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorInsumo;

DELIMITER //

-- Procedimiento para Registrar un movimiento
CREATE PROCEDURE registrarMovimientoStock(
    IN p_idInsumo INT,
    IN p_tipoMovimiento ENUM('entrada', 'salida'),
    IN p_cantidadMovimiento DECIMAL(10,2),
    IN p_idUsuario INT
)
BEGIN
    -- Insertar el movimiento
    INSERT INTO movimientosstock (idInsumo, tipoMovimiento, cantidadMovimiento, fechaMovimiento, idUsuario)
    VALUES (p_idInsumo, p_tipoMovimiento, p_cantidadMovimiento, NOW(), p_idUsuario);

    -- Actualizar el stock según tipoMovimiento
    IF p_tipoMovimiento = 'entrada' THEN
        UPDATE insumos SET stockInsumo = stockInsumo + p_cantidadMovimiento WHERE idInsumo = p_idInsumo;
    ELSE
        UPDATE insumos SET stockInsumo = stockInsumo - p_cantidadMovimiento WHERE idInsumo = p_idInsumo;
    END IF;
END //

-- Procedimeinto pata listar los movimientos
CREATE PROCEDURE listarMovimientos()
BEGIN
    SELECT m.idMovimientoStock, i.nombreInsumo, m.tipoMovimiento, 
           m.cantidadMovimiento, m.fechaMovimiento, m.idUsuario
    FROM movimientosstock m
    JOIN insumos i ON m.idInsumo = i.idInsumo
    ORDER BY m.fechaMovimiento DESC;
END //

-- Procedimiento para obtener movimiento de un insumo
CREATE PROCEDURE obtenerMovimientosPorInsumo(IN p_idInsumo INT)
BEGIN
    SELECT * FROM movimientosstock WHERE idInsumo = p_idInsumo ORDER BY fechaMovimiento DESC;
END //

DELIMITER ;
