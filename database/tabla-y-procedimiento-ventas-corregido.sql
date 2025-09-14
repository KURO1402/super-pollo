USE super_pollo;

/* MODIFICACION TABLA VENTAS POR ERROR DE ESCRITURA */
ALTER TABLE ventas 
CHANGE COLUMN urlCombrobantePDF urlComprobantePDF VARCHAR(100);

ALTER TABLE ventas 
CHANGE COLUMN urlCombrobanteXML urlComprobanteXML VARCHAR(100);

/* MODIFICACION PROCEDIMIENTO insertarVenta POR ERROR DE ESCRITURA */
DROP PROCEDURE IF EXISTS insertarVenta;

DELIMITER //

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
END //

DELIMITER ;