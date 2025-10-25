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
DROP PROCEDURE IF EXISTS registrarProducto;
DROP PROCEDURE IF EXISTS registrarCantidadInsumoProducto;
DROP PROCEDURE IF EXISTS validarProductoPorNombre;
DROP PROCEDURE IF EXISTS registrarImagenProducto;
DROP PROCEDURE IF EXISTS actualizarProducto;
DROP PROCEDURE IF EXISTS obtenerProductoPorId;
DROP PROCEDURE IF EXISTS eliminarProducto;
DROP PROCEDURE IF EXISTS actualizarImagenProducto;
DROP PROCEDURE IF EXISTS obtenerPublicIDPorProducto;


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

CREATE PROCEDURE obtenerInsumos()
BEGIN
    SELECT * FROM insumos ORDER BY idInsumo DESC;
END //

-- Procedimiento que trae los datos de un insumo por id 
CREATE PROCEDURE obtenerInsumoPorId(
    IN p_idInsumo INT
)
BEGIN
    SELECT 
        idInsumo,
        nombreInsumo,
        stockInsumo,
        unidadMedida,
        categoriaProducto,
        estadoInsumo
    FROM insumos
    WHERE idInsumo = p_idInsumo 
      AND estadoInsumo = 1;
END // 

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

CREATE PROCEDURE eliminarInsumo(IN p_idInsumo INT)
BEGIN
    UPDATE insumos SET estadoInsumo = '0' WHERE idInsumo = p_idInsumo;
END //

-- MOVIMIENTOS STOCK
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

-- Procedimeitno para hhalar el stock actual
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
END //

-- Procedimiento para eliminar un movimiento
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
END //

-- Procedimiento para insertar un producto
CREATE PROCEDURE registrarProducto(
    IN p_nombreProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_usaInsumos TINYINT(1)
)
BEGIN
    DECLARE v_idProducto INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Si ocurre algún error, se revierte la transacción
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Insertar el nuevo producto
    INSERT INTO productos (
        nombreProducto,
        descripcionProducto,
        precio,
        usaInsumos
    )
    VALUES (
        p_nombreProducto,
        p_descripcionProducto,
        p_precio,
        p_usaInsumos
    );

    -- Obtener el ID del producto recién insertado
    SET v_idProducto = LAST_INSERT_ID();

    -- Confirmar la transacción si todo fue exitoso
    COMMIT;

    -- Retornar el resultado
    SELECT 
        v_idProducto AS idGenerado;
END //

-- Procedimiento para registrar la cantidad de uso de un insumo en un producto
CREATE PROCEDURE registrarCantidadInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT,
    IN p_cantidadUso DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validaciones
    IF NOT EXISTS (SELECT 1 FROM productos WHERE idProducto = p_idProducto) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM insumos WHERE idInsumo = p_idInsumo) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El insumo no existe';
    END IF;

    -- Inserción o actualización
    INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso)
    VALUES (p_idProducto, p_idInsumo, p_cantidadUso)
    ON DUPLICATE KEY UPDATE cantidadUso = VALUES(cantidadUso);

    COMMIT;

    SELECT CONCAT('verdadero') AS mensaje;
END //

-- Procedimiento para validar un producto por nombre 
CREATE PROCEDURE validarProductoPorNombre(
    IN p_nombreProducto VARCHAR(50)
)
BEGIN
    SELECT 
        nombreProducto
    FROM productos
    WHERE nombreProducto = p_nombreProducto
      AND estadoProducto = 1;
END //

-- Procedimiento que registra una imagen 
CREATE PROCEDURE registrarImagenProducto(
    IN p_urlImagen VARCHAR(300),
    IN p_publicID VARCHAR(100),
    IN p_idProducto INT
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se pudo agregar la imagen del producto';
    END;

    START TRANSACTION;

    INSERT INTO imagenesProductos (urlImagen, publicID, idProducto)
    VALUES (p_urlImagen, p_publicID, p_idProducto);

    COMMIT;

END //

-- Procedimiento para actualizar datos de un producto
CREATE PROCEDURE actualizarProducto(
    IN p_idProducto INT,
    IN p_nombreProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_precio DECIMAL(10,2)
)
BEGIN
    DECLARE exit HANDLER FOR SQLEXCEPTION 
    BEGIN
        -- Si ocurre un error, revierte la transacción
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar datos de producto';
    END;

    START TRANSACTION;

    -- Verificar si el producto existe
    IF EXISTS (SELECT 1 FROM productos WHERE idProducto = p_idProducto) THEN
        UPDATE productos
        SET 
            nombreProducto = p_nombreProducto,
            descripcionProducto = p_descripcionProducto,
            precio = p_precio
        WHERE idProducto = p_idProducto;

        COMMIT;
    ELSE
        -- Si no existe, revierte y lanza un mensaje
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El producto especificado no existe';
    END IF;
END //

-- Procedimiento para obtener un producto por su id
CREATE PROCEDURE obtenerProductoPorId(
    IN p_idProducto INT
)
BEGIN
    SELECT 
        idProducto,
        nombreProducto,
        descripcionProducto,
        precio,
        usaInsumos,
        estadoProducto
    FROM productos
    WHERE idProducto = p_idProducto;
END //

-- Procedimiento para eliminar un producto
CREATE PROCEDURE eliminarProducto(
    IN p_idProducto INT
)
BEGIN
    DECLARE exit HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar producto';
    END;

    START TRANSACTION;

    -- Verificar si el producto existe
    IF EXISTS (SELECT 1 FROM productos WHERE idProducto = p_idProducto) THEN
        UPDATE productos
        SET estadoProducto = 0
        WHERE idProducto = p_idProducto;

        COMMIT;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto especificado no existe';
    END IF;
END //

-- Procedimiento para actualizar una imagen de un producto
CREATE PROCEDURE actualizarImagenProducto(
    IN p_idProducto INT,
    IN p_nuevaUrlImagen VARCHAR(300),
    IN p_nuevoPublicID VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        -- Si ocurre algún error, se revierte la transacción
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar la imagen del producto';
    END;

    START TRANSACTION;
    -- Actualizar imagen
    UPDATE imagenesProductos
    SET 
        urlImagen = p_nuevaUrlImagen,
        publicID = p_nuevoPublicID
    WHERE idProducto = p_idProducto;

    COMMIT;
END //

-- Procediemiento para obtener el public id de la imagen para eliminarlo de cloudinary
CREATE PROCEDURE obtenerPublicIDPorProducto(
    IN p_idProducto INT
)
BEGIN
    DECLARE v_publicID VARCHAR(100);

    -- Manejador de errores generales
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al obtener el publicID del producto';
    END;

    -- Obtener el publicID correspondiente al producto
    SELECT publicID INTO v_publicID
    FROM imagenesProductos
    WHERE idProducto = p_idProducto;

    -- Devolver el resultado
    SELECT v_publicID AS publicID;
END //

DELIMITER ;

