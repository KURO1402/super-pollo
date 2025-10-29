USE super_pollo;

DROP PROCEDURE IF EXISTS obtenerProductosPorCategoria;

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
    LEFT JOIN imagenesProductos i 
        ON p.idProducto = i.idProducto
    LEFT JOIN categoriasProducto c
        ON p.idCategoria = c.idCategoria
    WHERE p.idCategoria = p_idCategoria
      AND p.estadoProducto = 1;
END //