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
DROP PROCEDURE IF EXISTS obtenerProductosPaginacion;
DROP PROCEDURE IF EXISTS buscarProductosPorNombre;
DROP PROCEDURE IF EXISTS obtenerInsumosPorProducto;
DROP PROCEDURE IF EXISTS insertarCategoriaProducto;
DROP PROCEDURE IF EXISTS actualizarCategoriaProducto;
DROP PROCEDURE IF EXISTS obtenerCategoriaPorNombre;
DROP PROCEDURE IF EXISTS obtenerCategoriaPorId;

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
    IN p_usaInsumos TINYINT(1),
    in p_idCategoria INT
)
BEGIN
    DECLARE v_idProducto INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar producto.';
    END;
    
    START TRANSACTION;
    
    INSERT INTO productos (
        nombreProducto,
        descripcionProducto,
        precio,
        usaInsumos,
        idCategoria
    ) VALUES (
        p_nombreProducto,
        p_descripcionProducto,
        p_precio,
        p_usaInsumos,
        p_idCategoria
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registar imagen.';
    END;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar cantidades de insumos del producto.';
    END;
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
    IN p_precio DECIMAL(10,2),
    IN p_idCategoria INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar datos del producto.';
    END;
    START TRANSACTION;

    UPDATE productos
    SET 
        nombreProducto = p_nombreProducto,
        descripcionProducto = p_descripcionProducto,
        precio = p_precio,
        idCategoria = p_idCategoria
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar imagen.';
    END;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar cantidades de insumos del producto.';
    END;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar si el producto usa insumos.';
    END;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al elimar relacion de insumo al producto.';
    END;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar producto.';
    END;
    START TRANSACTION;

    UPDATE productos
    SET estadoProducto = 0
    WHERE idProducto = p_idProducto;

    COMMIT;

    SELECT 'Producto eliminado correctamente' AS mensaje;
END //

CREATE PROCEDURE obtenerProductos()
BEGIN
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcionProducto,
        p.precio,
        p.usaInsumos,
        c.nombreCategoria,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasProducto c
        ON p.idCategoria = c.idCategoria
    WHERE p.estadoProducto = 1
    ORDER BY p.idProducto DESC;
END //

-- Procedimientos para obtener productos 
CREATE PROCEDURE obtenerProductosPaginacion(
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
        c.nombreCategoria,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasProducto c
        ON p.idCategoria = c.idCategoria
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
        c.nombreCategoria,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasProducto c
        ON p.idCategoria = c.idCategoria
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
        c.nombreCategoria,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasProducto c
        ON p.idCategoria = c.idCategoria
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

-- PROCEDIMIENTOS PARA CATEGORIAS DE PRODUCTO

CREATE PROCEDURE insertarCategoriaProducto(
    IN p_nombreCategoria VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar categoria de producto.';
    END;

    START TRANSACTION;

    INSERT INTO categoriasProducto(nombreCategoria)
    VALUES(p_nombreCategoria);

    COMMIT;

    SELECT 'Categoría registrada correctamente.' AS mensaje;
END // 


CREATE PROCEDURE actualizarCategoriaProducto(
    IN p_idCategoria INT,
    IN p_nombreCategoria VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al actualizar categoría de producto.';
    END;

    START TRANSACTION;

    UPDATE categoriasProducto
    SET nombreCategoria = p_nombreCategoria
    WHERE idCategoria = p_idCategoria;

    COMMIT;

    SELECT 'Categoría actualizada correctamente.' AS mensaje;
END //

CREATE PROCEDURE obtenerCategoriaPorNombre(
    IN p_nombreCategoria VARCHAR(100)
)
BEGIN
    SELECT 
        idCategoria,
        nombreCategoria
    FROM categoriasProducto
    WHERE nombreCategoria = p_nombreCategoria;
END //

CREATE PROCEDURE obtenerCategoriaPorId(
    IN p_idCategoria INT
)
BEGIN
    SELECT 
        idCategoria,
        nombreCategoria
    FROM categoriasProducto
    WHERE idCategoria = p_idCategoria;
END //

DELIMITER ;