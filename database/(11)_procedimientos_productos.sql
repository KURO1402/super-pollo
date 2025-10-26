USE super_pollo;

-- Eliminar procedimientos de productos
DROP PROCEDURE IF EXISTS registrarProducto;
DROP PROCEDURE IF EXISTS registrarCantidadInsumoProducto;
DROP PROCEDURE IF EXISTS validarProductoPorNombre;
DROP PROCEDURE IF EXISTS registrarImagenProducto;
DROP PROCEDURE IF EXISTS actualizarProducto;
DROP PROCEDURE IF EXISTS obtenerProductoPorId;
DROP PROCEDURE IF EXISTS eliminarProducto;
DROP PROCEDURE IF EXISTS actualizarImagenProducto;
DROP PROCEDURE IF EXISTS obtenerPublicIDPorProducto;
DROP PROCEDURE IF EXISTS actualizarCantidadUsoInsumoProducto;
DROP PROCEDURE IF EXISTS verificarRelacionProductoInsumo;
DROP PROCEDURE IF EXISTS eliminarCantidadInsumoProducto;
DROP PROCEDURE IF EXISTS actualizarUsaInsumosProducto;
DROP PROCEDURE IF EXISTS contarInsumosPorProducto;

DELIMITER //
-- =============================================
-- PROCEDIMIENTOS PARA PRODUCTOS
-- =============================================

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
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
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

    SET v_idProducto = LAST_INSERT_ID();

    COMMIT;

    SELECT v_idProducto AS idGenerado;
END //

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

CREATE PROCEDURE actualizarProducto(
    IN p_idProducto INT,
    IN p_nombreProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_precio DECIMAL(10,2)
)
BEGIN
    DECLARE exit HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar datos de producto';
    END;

    START TRANSACTION;

    IF EXISTS (SELECT 1 FROM productos WHERE idProducto = p_idProducto) THEN
        UPDATE productos
        SET 
            nombreProducto = p_nombreProducto,
            descripcionProducto = p_descripcionProducto,
            precio = p_precio
        WHERE idProducto = p_idProducto;

        COMMIT;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El producto especificado no existe';
    END IF;
END //

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

-- =============================================
-- PROCEDIMIENTOS PARA IMÁGENES DE PRODUCTOS
-- =============================================

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

CREATE PROCEDURE actualizarImagenProducto(
    IN p_idProducto INT,
    IN p_nuevaUrlImagen VARCHAR(300),
    IN p_nuevoPublicID VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar la imagen del producto';
    END;

    START TRANSACTION;

    UPDATE imagenesProductos
    SET 
        urlImagen = p_nuevaUrlImagen,
        publicID = p_nuevoPublicID
    WHERE idProducto = p_idProducto;

    COMMIT;
END //

CREATE PROCEDURE obtenerPublicIDPorProducto(
    IN p_idProducto INT
)
BEGIN
    DECLARE v_publicID VARCHAR(100);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al obtener el publicID del producto';
    END;

    SELECT publicID INTO v_publicID
    FROM imagenesProductos
    WHERE idProducto = p_idProducto;

    SELECT v_publicID AS publicID;
END //

-- =============================================
-- PROCEDIMIENTOS PARA RELACIÓN PRODUCTO-INSUMO
-- =============================================

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

    IF NOT EXISTS (SELECT 1 FROM productos WHERE idProducto = p_idProducto) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM insumos WHERE idInsumo = p_idInsumo) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El insumo no existe';
    END IF;

    INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso)
    VALUES (p_idProducto, p_idInsumo, p_cantidadUso)
    ON DUPLICATE KEY UPDATE cantidadUso = VALUES(cantidadUso);

    COMMIT;

    SELECT CONCAT('verdadero') AS mensaje;
END //

CREATE PROCEDURE actualizarCantidadUsoInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT,
    IN p_nuevaCantidad DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar la cantidad de uso del insumo en el producto';
    END;

    START TRANSACTION;

    UPDATE cantidadInsumoProducto
    SET cantidadUso = p_nuevaCantidad
    WHERE idProducto = p_idProducto AND idInsumo = p_idInsumo;

    COMMIT;
END //

CREATE PROCEDURE verificarRelacionProductoInsumo(
    IN p_idProducto INT,
    IN p_idInsumo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al verificar la relación entre producto e insumo';
    END;

    SELECT COUNT(*) AS contador
    FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto AND idInsumo = p_idInsumo;
END //

-- Procedimiento para eliminar la cantidad de uso de un insumo en un producto
CREATE PROCEDURE eliminarCantidadInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT
)
BEGIN
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar el registro de cantidadInsumoProducto';
    END;

    START TRANSACTION;

    DELETE FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto
      AND idInsumo = p_idInsumo;

    COMMIT;
END //

-- Procedimiento almacenado que obtiene si un producto usa insumos o no 
CREATE PROCEDURE actualizarUsaInsumosProducto(
    IN p_idProducto INT,
    IN p_usaInsumo INT
)
BEGIN
    -- Manejador de errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar el campo usaInsumos del producto';
    END;

    START TRANSACTION;

    UPDATE productos
    SET usaInsumos = p_usaInsumo
    WHERE idProducto = p_idProducto;

    COMMIT;
END //

-- Procedimiento para obtener el numero de insumos que usa un producto
CREATE PROCEDURE contarInsumosPorProducto(
    IN p_idProducto INT
)
BEGIN
    DECLARE v_totalInsumos INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al contar los insumos del producto';
    END;

    SELECT COUNT(*) INTO v_totalInsumos
    FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto;

    SELECT v_totalInsumos AS totalInsumos;
END //

DELIMITER ;