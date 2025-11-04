USE super_pollo;
DROP PROCEDURE IF EXISTS topProductosMasVendidos;

DELIMITER //

CREATE PROCEDURE topProductosMasVendidos(
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE
)
BEGIN
    IF p_fechaInicio IS NULL THEN
        SET p_fechaInicio = DATE_SUB(CURDATE(), INTERVAL 30 DAY);
    END IF;

    IF p_fechaFin IS NULL THEN
        SET p_fechaFin = CURDATE();
    END IF;

    SELECT 
        p.nombreProducto,
        SUM(dv.cantidadProducto) AS totalVendido
    FROM detalleVentas dv
    INNER JOIN ventas v ON dv.idVenta = v.idVenta
    INNER JOIN productos p ON p.idProducto = dv.idProducto
    WHERE v.fechaEmision BETWEEN p_fechaInicio AND p_fechaFin
    GROUP BY p.idProducto
    ORDER BY totalVendido DESC
    LIMIT 5;
END //

DELIMITER ;
