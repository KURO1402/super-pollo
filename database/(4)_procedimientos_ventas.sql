USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS insertarVenta;
DROP PROCEDURE IF EXISTS listarVentas;
DROP PROCEDURE IF EXISTS obtenerVenta;
DROP PROCEDURE IF EXISTS obtenerDetalleVenta;
DROP PROCEDURE IF EXISTS obtenerSeriePorTipoComprobante;

DELIMITER //

/*Obtener todos los tipos de comprobante*/
CREATE PROCEDURE obtenerTiposComprobante()
BEGIN
    SELECT idTipoComprobante, nombreTipoComprobante, serie
    FROM tipoComprobantes;
END //

/* PROCEDIMIENTO ALMACENADO para obtener la serie segun el id del tipo de comprobante */
CREATE PROCEDURE obtenerSeriePorTipoComprobante(
    IN p_idTipoComprobante INT
)
BEGIN
    SELECT serie
    FROM tipoComprobantes
    WHERE idTipoComprobante = p_idTipoComprobante;
END //

/*Procemiento para obtener el ultimo numero correlativo de cada tipo de comprobante*/
CREATE PROCEDURE obtenerUltimoCorrelativo(
    IN p_idTipoComprobante INT
)
BEGIN
    SELECT ultimoNumero
    FROM correlativos
    WHERE idTipoComprobante = p_idTipoComprobante;
END //

/*Procemiento para actualizar el correlativo en la base de datos*/
CREATE PROCEDURE actualizarCorrelativoSolo(
    IN p_idTipoComprobante INT
)
BEGIN
    START TRANSACTION;

    -- Incrementar correlativo en 1
    UPDATE correlativos
    SET ultimoNumero = ultimoNumero + 1
    WHERE idTipoComprobante = p_idTipoComprobante;

    COMMIT;
END //


/* PROCEDIMIENTO ALMACENADO insertarVenta */
CREATE PROCEDURE insertarVenta(
IN p_numeroDocumentoCliente VARCHAR(12),
IN p_serie VARCHAR(5),
IN p_numeroCorrelativo INT,
IN p_sunatTransaccion TINYINT,
IN p_fechaEmision DATE,
IN p_fechaVencimiento DATE,
IN p_porcentajeIGV DECIMAL(10,2),
IN p_totalGravada DECIMAL(10,2),
IN p_totalIGV DECIMAL(10,2),
IN p_totalVenta DECIMAL(10,2),
IN p_aceptadaPorSunat TINYINT,
IN p_fechaRegistro DATETIME,
IN p_urlComprobantePDF VARCHAR(100),
IN p_urlComprobanteXML VARCHAR(100),
IN p_idMedioPago INT,
IN p_idTipoComprobante INT
)
BEGIN
DECLARE exit HANDLER FOR SQLEXCEPTION
BEGIN
-- Si ocurre un error, hacemos rollback
ROLLBACK;
END;

START TRANSACTION;

INSERT INTO ventas(
    numeroDocumentoCliente, serie, numeroCorrelativo, sunatTransaccion,
    fechaEmision, fechaVencimiento, porcentajeIGV, totalGravada,
    totalIGV, totalVenta, aceptadaPorSunat, fechaRegistro,
    urlComprobantePDF, urlComprobanteXML, idMedioPago, idTipoComprobante
)
VALUES (
    p_numeroDocumentoCliente, p_serie, p_numeroCorrelativo, p_sunatTransaccion,
    p_fechaEmision, p_fechaVencimiento, p_porcentajeIGV, p_totalGravada,
    p_totalIGV, p_totalVenta, p_aceptadaPorSunat, p_fechaRegistro,
    p_urlComprobantePDF, p_urlComprobanteXML, p_idMedioPago, p_idTipoComprobante
);

COMMIT;


END //

/* PROCEDIMIENTO ALMACENADO listarVentas (20 en 20) */
CREATE PROCEDURE listarVentas(
    IN p_pagina INT /* Parámetro de entrada que indica el número de página que solicita el cliente */
)
BEGIN
    DECLARE v_offset INT; /* Declaras una variable para calcular cuántas filas saltar */
    SET v_offset = (p_pagina - 1) * 20; /* Calcula cuántas filas saltar por pagina */

    SELECT 
        v.idVenta,
        v.numeroDocumentoCliente,
        v.serie,
        v.numeroCorrelativo,
        v.fechaEmision,
        v.totalVenta,
        mp.nombreMedioPago,
        tc.nombreTipoComprobante
    FROM ventas v
    INNER JOIN medioPago mp ON v.idMedioPago = mp.idMedioPago
    INNER JOIN tipoComprobantes tc ON v.idTipoComprobante = tc.idTipoComprobante
    ORDER BY v.fechaRegistro DESC
    LIMIT 20 OFFSET v_offset; # Limite de resultados por pagina
END //

/* PROCEDIMIENTO ALMACENADO obtenerVenta (por ID) */
CREATE PROCEDURE obtenerVenta(
    IN p_idVenta INT
)
BEGIN
    SELECT 
        v.idVenta,
        v.numeroDocumentoCliente,
        v.serie,
        v.numeroCorrelativo,
        v.sunatTransaccion,
        v.fechaEmision,
        v.fechaVencimiento,
        v.porcentajeIGV,
        v.totalGravada,
        v.totalIGV,
        v.totalVenta,
        v.aceptadaPorSunat,
        v.fechaRegistro,
        v.urlComprobantePDF,
        v.urlComprobanteXML,
        v.idMedioPago,
        v.idTipoComprobante,
        mp.nombreMedioPago,
        tc.nombreTipoComprobante
    FROM ventas v
    INNER JOIN medioPago mp ON v.idMedioPago = mp.idMedioPago
    INNER JOIN tipoComprobantes tc ON v.idTipoComprobante = tc.idTipoComprobante
    WHERE v.idVenta = p_idVenta;
END //

/* PROCEDIMIENTO ALMACENADO obtenerDetalleVenta (por ID) */
CREATE PROCEDURE obtenerDetalleVenta(
    IN p_idVenta INT
)
BEGIN
    SELECT 
        dv.idDetalleVenta,
        dv.idVenta,
        dv.idProducto,
        p.nombreProducto,
        dv.cantidad,
        dv.precioUnitario,
        dv.subtotal
    FROM detalleVentas dv
    INNER JOIN productos p ON dv.idProducto = p.idProducto
    WHERE dv.idVenta = p_idVenta;
END //

DELIMITER ;
