USE super_pollo;
DROP PROCEDURE IF EXISTS topProductosMasVendidos;
DROP PROCEDURE IF EXISTS obtenerResumenVentasEgresosMensual;
DROP PROCEDURE IF EXISTS obtenerVentasHoyComparacion;
DROP PROCEDURE IF EXISTS obtenerCantidadVentasHoyComparacion;
DROP PROCEDURE IF EXISTS obtenerReservasHoyComparacion;
DROP PROCEDURE IF EXISTS obtenerBalanceGeneralAnual;
DROP PROCEDURE IF EXISTS obtenerPorcentajeMediosPago;
DROP PROCEDURE IF EXISTS obtenerVentasPorMes;

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

CREATE PROCEDURE obtenerResumenVentasEgresosMensual(
    IN p_cantidadMeses INT
)
BEGIN
    SELECT 
        DATE_FORMAT(m.fecha, '%b') AS mes,
        COALESCE(i.totalIngresos, 0) AS ingresos,
        COALESCE(e.totalEgresos, 0) AS egresos
    FROM (
        -- Generar los últimos p_cantidadMeses meses
        SELECT LAST_DAY(DATE_SUB(CURDATE(), INTERVAL n.n MONTH)) AS fecha
        FROM (
            SELECT 0 AS n
            UNION ALL SELECT 1
            UNION ALL SELECT 2
            UNION ALL SELECT 3
            UNION ALL SELECT 4
            UNION ALL SELECT 5
            UNION ALL SELECT 6
            UNION ALL SELECT 7
            UNION ALL SELECT 8
            UNION ALL SELECT 9
            UNION ALL SELECT 10
            UNION ALL SELECT 11
        ) n
        WHERE n.n < p_cantidadMeses
    ) m
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fechaMovimiento, '%Y-%m') AS mes, 
            SUM(montoMovimiento) AS totalIngresos
        FROM movimientosCaja
        WHERE tipoMovimiento = 'Ingreso'
        GROUP BY DATE_FORMAT(fechaMovimiento, '%Y-%m')
    ) i ON DATE_FORMAT(m.fecha, '%Y-%m') = i.mes
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fechaMovimiento, '%Y-%m') AS mes, 
            SUM(montoMovimiento) AS totalEgresos
        FROM movimientosCaja
        WHERE tipoMovimiento = 'Egreso'
        GROUP BY DATE_FORMAT(fechaMovimiento, '%Y-%m')
    ) e ON DATE_FORMAT(m.fecha, '%Y-%m') = e.mes
    ORDER BY m.fecha;
END //

CREATE PROCEDURE obtenerVentasHoyComparacion()
BEGIN
    DECLARE totalHoy DECIMAL(10,2);
    DECLARE totalAyer DECIMAL(10,2);
    DECLARE porcentajeCambio DECIMAL(10,2);

    -- Total ventas de hoy
    SELECT COALESCE(SUM(totalVenta),0) 
    INTO totalHoy
    FROM ventas
    WHERE fechaEmision = CURDATE();

    -- Total ventas de ayer
    SELECT COALESCE(SUM(totalVenta),0) 
    INTO totalAyer
    FROM ventas
    WHERE fechaEmision = CURDATE() - INTERVAL 1 DAY;

    -- Calcular porcentaje de cambio
    IF totalAyer = 0 THEN
        SET porcentajeCambio = NULL; -- O puedes poner 100 si quieres mostrar "100% más"
    ELSE
        SET porcentajeCambio = ((totalHoy - totalAyer) / totalAyer) * 100;
    END IF;

    -- Devolver resultados
    SELECT totalHoy AS totalVentasHoy,
           totalAyer AS totalVentasAyer,
           porcentajeCambio AS porcentajeComparacion;
END //

CREATE PROCEDURE obtenerCantidadVentasHoyComparacion()
BEGIN
    DECLARE totalHoy INT;
    DECLARE totalAyer INT;
    DECLARE porcentajeCambio DECIMAL(10,2);

    -- Cantidad de ventas hoy
    SELECT COUNT(*) 
    INTO totalHoy
    FROM ventas
    WHERE fechaEmision = CURDATE();

    -- Cantidad de ventas ayer
    SELECT COUNT(*) 
    INTO totalAyer
    FROM ventas
    WHERE fechaEmision = CURDATE() - INTERVAL 1 DAY;

    -- Calcular porcentaje de cambio
    IF totalAyer = 0 THEN
        SET porcentajeCambio = NULL; -- o 100 si quieres mostrar “100% más”
    ELSE
        SET porcentajeCambio = ((totalHoy - totalAyer) / totalAyer) * 100;
    END IF;

    -- Devolver resultados
    SELECT totalHoy AS totalVentasHoy,
           totalAyer AS totalVentasAyer,
           porcentajeCambio AS porcentajeComparacion;
END //

CREATE PROCEDURE obtenerReservasHoyComparacion()
BEGIN
    DECLARE totalHoy INT;
    DECLARE totalAyer INT;
    DECLARE porcentajeCambio DECIMAL(10,2);

    -- Reservas concretadas hoy
    SELECT COUNT(*) 
    INTO totalHoy
    FROM reservaciones
    WHERE fechaReservacion = CURDATE() AND estadoReservacion = 'pagado';

    -- Reservas concretadas ayer
    SELECT COUNT(*) 
    INTO totalAyer
    FROM reservaciones
    WHERE fechaReservacion = CURDATE() - INTERVAL 1 DAY AND estadoReservacion = 'pagado';

    -- Calcular porcentaje de cambio
    IF totalAyer = 0 THEN
        SET porcentajeCambio = NULL; -- o 100 si quieres mostrar “100% más”
    ELSE
        SET porcentajeCambio = ((totalHoy - totalAyer) / totalAyer) * 100;
    END IF;

    -- Devolver resultados
    SELECT totalHoy AS totalReservasHoy,
           totalAyer AS totalReservasAyer,
           porcentajeCambio AS porcentajeComparacion;
END //

CREATE PROCEDURE obtenerBalanceGeneralAnual()
BEGIN
    DECLARE inicioAnio DATE;
    DECLARE finAnio DATE;
    DECLARE hoy DATE;

    SET hoy = CURDATE();
    SET inicioAnio = MAKEDATE(YEAR(hoy), 1);  -- 1ro de enero
    SET finAnio = LAST_DAY(MAKEDATE(YEAR(hoy), 1) + INTERVAL 11 MONTH); -- 31 de diciembre

    SELECT 
        IFNULL(SUM(CASE WHEN m.tipoMovimiento='Ingreso' THEN m.montoMovimiento ELSE 0 END),0) AS ingresosTotales,
        IFNULL(SUM(CASE WHEN m.tipoMovimiento='Egreso' THEN m.montoMovimiento ELSE 0 END),0) AS egresosTotales,
        (IFNULL(SUM(CASE WHEN m.tipoMovimiento='Ingreso' THEN m.montoMovimiento ELSE 0 END),0)
         - IFNULL(SUM(CASE WHEN m.tipoMovimiento='Egreso' THEN m.montoMovimiento ELSE 0 END),0)) AS gananciaNeta
    FROM movimientosCaja m
    WHERE m.fechaMovimiento BETWEEN inicioAnio AND finAnio;
END //

CREATE PROCEDURE obtenerPorcentajeMediosPago()
BEGIN
    DECLARE total DECIMAL(10,2);

    -- Obtener el total de ventas
    SELECT SUM(totalVenta) INTO total FROM ventas;

    -- Obtener ventas por medio de pago y porcentaje
    SELECT 
        mp.nombreMedioPago,
        IFNULL(SUM(v.totalVenta), 0) AS totalPorMedio,
        IFNULL(SUM(v.totalVenta)/total*100,0) AS porcentaje
    FROM medioPago mp
    LEFT JOIN ventas v ON v.idMedioPago = mp.idMedioPago
    GROUP BY mp.idMedioPago, mp.nombreMedioPago;
END //

CREATE PROCEDURE obtenerVentasPorMes(IN p_meses INT)
BEGIN
    -- Variable para la fecha inicial
    DECLARE fechaInicio DATE;
    SET fechaInicio = DATE_SUB(CURDATE(), INTERVAL p_meses-1 MONTH);

    -- Generar lista de meses usando una tabla derivada
    SELECT 
        DATE_FORMAT(meses.mes, '%b') AS mes,
        IFNULL(SUM(v.totalVenta), 0) AS totalVentas
    FROM (
        SELECT DATE_ADD(fechaInicio, INTERVAL seq MONTH) AS mes
        FROM (
            SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
            UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
        ) AS numeros
        WHERE DATE_ADD(fechaInicio, INTERVAL seq MONTH) <= CURDATE()
    ) AS meses
    LEFT JOIN ventas v 
        ON YEAR(v.fechaEmision) = YEAR(meses.mes) 
       AND MONTH(v.fechaEmision) = MONTH(meses.mes)
    GROUP BY meses.mes
    ORDER BY meses.mes;
END //

DELIMITER ;
