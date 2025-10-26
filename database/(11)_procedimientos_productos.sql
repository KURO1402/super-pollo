USE super_pollo;

-- Eliminar procedimientos de productos
DROP PROCEDURE IF EXISTS registrarProducto;
DROP PROCEDURE IF EXISTS validarProductoPorNombre;
DROP PROCEDURE IF EXISTS registrarImagenProducto;
DROP PROCEDURE IF EXISTS registrarCantidadInsumoProducto;
DROP PROCEDURE IF EXISTS obtenerProductoPorId;
DROP PROCEDURE IF EXISTS actualizarProducto;
DROP PROCEDURE IF EXISTS actualizarImagenProducto;
DROP PROCEDURE IF EXISTS actualizarCantidadUsoInsumoProducto;
DROP PROCEDURE IF EXISTS actualizarUsaInsumosProducto;
DROP PROCEDURE IF EXISTS verificarRelacionProductoInsumo;
DROP PROCEDURE IF EXISTS contarInsumosPorProducto;
DROP PROCEDURE IF EXISTS obtenerPublicIDPorProducto;
DROP PROCEDURE IF EXISTS eliminarCantidadInsumoProducto;
DROP PROCEDURE IF EXISTS eliminarProducto;
DROP PROCEDURE IF EXISTS obtenerProductos;
DROP PROCEDURE IF EXISTS buscarProductosPorNombre;
DROP PROCEDURE IF EXISTS obtenerInsumosPorProducto;

DELIMITER //

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

CREATE PROCEDURE verificarRelacionProductoInsumo(
    IN p_idProducto INT,
    IN p_idInsumo INT
)
BEGIN
    SELECT COUNT(*) AS contador
    FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto AND idInsumo = p_idInsumo;
END //

CREATE PROCEDURE contarInsumosPorProducto(
    IN p_idProducto INT
)
BEGIN
    SELECT COUNT(*) AS totalInsumos
    FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto;
END //

CREATE PROCEDURE obtenerPublicIDPorProducto(
    IN p_idProducto INT
)
BEGIN
    SELECT publicID
    FROM imagenesProductos
    WHERE idProducto = p_idProducto;
END //

-- =============================================
-- PROCEDIMIENTOS QUE DEVUELVEN MENSAJES (INSERT/UPDATE/DELETE)
-- =============================================

CREATE PROCEDURE registrarProducto(
    IN p_nombreProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_usaInsumos TINYINT(1)
)
BEGIN
    DECLARE v_idProducto INT;
    
    START TRANSACTION;
    
    INSERT INTO productos (
        nombreProducto,
        descripcionProducto,
        precio,
        usaInsumos
    ) VALUES (
        p_nombreProducto,
        p_descripcionProducto,
        p_precio,
        p_usaInsumos
    );

    SET v_idProducto = LAST_INSERT_ID();
    COMMIT;

    SELECT v_idProducto AS idGenerado;
END //

CREATE PROCEDURE registrarImagenProducto(
    IN p_urlImagen VARCHAR(300),
    IN p_publicID VARCHAR(100),
    IN p_idProducto INT
)
BEGIN
    START TRANSACTION;

    INSERT INTO imagenesProductos (urlImagen, publicID, idProducto)
    VALUES (p_urlImagen, p_publicID, p_idProducto);

    COMMIT;

    SELECT 'Imagen registrada correctamente' AS mensaje;
END //

CREATE PROCEDURE registrarCantidadInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT,
    IN p_cantidadUso DECIMAL(10,2)
)
BEGIN
    START TRANSACTION;

    INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso)
    VALUES (p_idProducto, p_idInsumo, p_cantidadUso)
    ON DUPLICATE KEY UPDATE cantidadUso = VALUES(cantidadUso);

    COMMIT;

    SELECT 'Relación producto-insumo registrada correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarProducto(
    IN p_idProducto INT,
    IN p_nombreProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_precio DECIMAL(10,2)
)
BEGIN
    START TRANSACTION;

    UPDATE productos
    SET 
        nombreProducto = p_nombreProducto,
        descripcionProducto = p_descripcionProducto,
        precio = p_precio
    WHERE idProducto = p_idProducto;

    COMMIT;

    SELECT 'Producto actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarImagenProducto(
    IN p_idProducto INT,
    IN p_nuevaUrlImagen VARCHAR(300),
    IN p_nuevoPublicID VARCHAR(100)
)
BEGIN
    START TRANSACTION;

    UPDATE imagenesProductos
    SET 
        urlImagen = p_nuevaUrlImagen,
        publicID = p_nuevoPublicID
    WHERE idProducto = p_idProducto;

    COMMIT;

    SELECT 'Imagen actualizada correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarCantidadUsoInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT,
    IN p_nuevaCantidad DECIMAL(10,2)
)
BEGIN
    START TRANSACTION;

    UPDATE cantidadInsumoProducto
    SET cantidadUso = p_nuevaCantidad
    WHERE idProducto = p_idProducto AND idInsumo = p_idInsumo;

    COMMIT;

    SELECT 'Cantidad de uso actualizada correctamente' AS mensaje;
END //

CREATE PROCEDURE actualizarUsaInsumosProducto(
    IN p_idProducto INT,
    IN p_usaInsumo INT
)
BEGIN
    START TRANSACTION;

    UPDATE productos
    SET usaInsumos = p_usaInsumo
    WHERE idProducto = p_idProducto;

    COMMIT;

    SELECT 'Campo usaInsumos actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE eliminarCantidadInsumoProducto(
    IN p_idProducto INT,
    IN p_idInsumo INT
)
BEGIN
    START TRANSACTION;

    DELETE FROM cantidadInsumoProducto
    WHERE idProducto = p_idProducto AND idInsumo = p_idInsumo;

    COMMIT;

    SELECT 'Relación producto-insumo eliminada correctamente' AS mensaje;
END //

CREATE PROCEDURE eliminarProducto(
    IN p_idProducto INT
)
BEGIN
    START TRANSACTION;

    UPDATE productos
    SET estadoProducto = 0
    WHERE idProducto = p_idProducto;

    COMMIT;

    SELECT 'Producto eliminado correctamente' AS mensaje;
END //

-- Procedimientos para obtener productos 
CREATE PROCEDURE obtenerProductos(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcionProducto,
        p.precio,
        p.usaInsumos,
        p.estadoProducto,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    WHERE p.estadoProducto = 1
    ORDER BY p.idProducto DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE obtenerProductoPorId(
    IN p_idProducto INT
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcionProducto,
        p.precio,
        p.usaInsumos,
        p.estadoProducto,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    WHERE p.idProducto = p_idProducto
      AND p.estadoProducto = 1;
END //

CREATE PROCEDURE buscarProductosPorNombre(
    IN p_nombre VARCHAR(100)
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcionProducto,
        p.precio,
        p.usaInsumos,
        p.estadoProducto,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    WHERE p.nombreProducto LIKE CONCAT('%', p_nombre, '%')
      AND p.estadoProducto = 1;
END //

-- Procedimiento para obtener el insumo y su cantidad de un producto
CREATE PROCEDURE obtenerInsumosPorProducto(
    IN p_idProducto INT
)
BEGIN
    SELECT 
        i.idInsumo,
        i.nombreInsumo,
        cip.cantidadUso
    FROM cantidadInsumoProducto cip
    INNER JOIN insumos i 
        ON cip.idInsumo = i.idInsumo
    WHERE cip.idProducto = p_idProducto;
END //

DELIMITER ;