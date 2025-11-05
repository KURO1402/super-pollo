USE super_pollo;

DROP PROCEDURE IF EXISTS obtenerProductosPorCategoria;
DROP PROCEDURE IF EXISTS ObtenerCategoriasProducto;

DELIMITER //

CREATE PROCEDURE obtenerProductosPorCategoria(
    IN p_idCategoria INT
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcionProducto,
        p.precio,
        c.nombreCategoria,
        i.urlImagen
    FROM productos p
    LEFT JOIN imagenesproductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasproducto c
        ON p.idCategoria = c.idCategoria
    WHERE p.idCategoria = p_idCategoria
      AND p.estadoProducto = 1;
END //


CREATE PROCEDURE ObtenerCategoriasProducto()
BEGIN
    SELECT idCategoria, nombreCategoria FROM categoriasproducto;
END //

DELIMITER ;