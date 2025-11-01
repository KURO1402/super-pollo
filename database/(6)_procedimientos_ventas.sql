USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS obtenerTiposComprobante;
DROP PROCEDURE IF EXISTS obtenerUltimoCorrelativo;
DROP PROCEDURE IF EXISTS registrarVentaYComprobante;
DROP PROCEDURE IF EXISTS insertarDetalleVenta;
DROP PROCEDURE IF EXISTS listarVentas;
DROP PROCEDURE IF EXISTS obtenerVenta;
DROP PROCEDURE IF EXISTS obtenerDetalleVenta;
DROP PROCEDURE IF EXISTS obtenerSeriePorTipoComprobante;
DROP PROCEDURE IF EXISTS actualizarCorrelativoSolo;
DROP PROCEDURE IF EXISTS contarMedioPagoPorId;

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

/* Procedimiento para actualizar el correlativo en la base de datos */
CREATE PROCEDURE actualizarCorrelativoSolo(
    IN p_idTipoComprobante INT,
    IN p_nuevoCorrelativo INT
)
BEGIN
    START TRANSACTION;

    -- Actualizar el correlativo con el nuevo valor recibido
    UPDATE correlativos
    SET ultimoNumero = p_nuevoCorrelativo
    WHERE idTipoComprobante = p_idTipoComprobante;

    COMMIT;
END //


CREATE PROCEDURE registrarVentaYComprobante(
    -- Parámetros venta
    IN p_numeroDocumentoCliente VARCHAR(12),
    IN p_fechaEmision DATE,
    IN p_fechaVencimiento DATE,
    IN p_porcentajeIGV DECIMAL(10,2),
    IN p_totalGravada DECIMAL(10,2),
    IN p_totalIGV DECIMAL(10,2),
    IN p_totalVenta DECIMAL(10,2),
    IN p_idMedioPago INT,
    IN p_idTipoComprobante INT,
    IN P_idUsuario INT,
    -- Parámetros comprobante
    IN p_numeroCorrelativo INT,
    IN p_enlaceNubefact VARCHAR(255),
    IN p_urlComprobantePDF VARCHAR(255),
    IN p_urlComprobanteXML VARCHAR(255),
    IN p_codigoHash VARCHAR(200),
    IN p_keyNubefact VARCHAR(100),
    IN p_aceptadaPorSunat TINYINT,
    IN p_estadoSunat VARCHAR(50),
    IN p_sunatResponseCode VARCHAR(10)
)
BEGIN
    DECLARE v_idVentaGenerada INT;
    DECLARE v_idComprobanteGenerado INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar venta y comprobante.';
    END;

    START TRANSACTION;

    -- Registrar venta
    INSERT INTO ventas (
        numeroDocumentoCliente,
        fechaEmision,
        fechaVencimiento,
        porcentajeIGV,
        totalGravada,
        totalIGV,
        totalVenta,
        idMedioPago,
        idTipoComprobante,
        idUsuario
    ) VALUES (
        p_numeroDocumentoCliente,
        p_fechaEmision,
        p_fechaVencimiento,
        p_porcentajeIGV,
        p_totalGravada,
        p_totalIGV,
        p_totalVenta,
        p_idMedioPago,
        p_idTipoComprobante,
        P_idUsuario
    );

    SET v_idVentaGenerada = LAST_INSERT_ID();

    -- Registrar comprobante
    INSERT INTO comprobantes (
        idVenta,
        idTipoComprobante,
        numeroCorrelativo,
        enlaceNubefact,
        urlComprobantePDF,
        urlComprobanteXML,
        codigoHash,
        keyNubefact,
        aceptadaPorSunat,
        estadoSunat,
        sunatResponseCode
    ) VALUES (
        v_idVentaGenerada,
        p_idTipoComprobante,
        p_numeroCorrelativo,
        p_enlaceNubefact,
        p_urlComprobantePDF,
        p_urlComprobanteXML,
        p_codigoHash,
        p_keyNubefact,
        p_aceptadaPorSunat,
        p_estadoSunat,
        p_sunatResponseCode
    );

    SET v_idComprobanteGenerado = LAST_INSERT_ID();

    COMMIT;

    -- Devolver mensaje y ambos IDs
    SELECT 
        'Venta y comprobante registrados generados correctamente' AS mensaje,
        v_idVentaGenerada AS idVenta,
        v_idComprobanteGenerado AS idComprobante;
END //

CREATE PROCEDURE insertarDetalleVenta(
    IN p_cantidadProducto INT,
    IN p_valorUnitario DECIMAL(10,2),
    IN p_precioUnitario DECIMAL(10,2),
    IN p_subtotal DECIMAL(10,2),
    IN p_igv DECIMAL(10,2),
    IN p_totalProducto DECIMAL(10,2),
    IN p_idVenta INT,
    IN p_idProducto INT
)
BEGIN
    -- Manejador ante error SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar detalle de la venta.';
    END;

    START TRANSACTION;

    INSERT INTO detalleVentas(
        cantidadProducto,
        valorUnitario,
        precioUnitario,
        subtotal,
        igv,
        totalProducto,
        idVenta,
        idProducto
    )
    VALUES(
        p_cantidadProducto,
        p_valorUnitario,
        p_precioUnitario,
        p_subtotal,
        p_igv,
        p_totalProducto,
        p_idVenta,
        p_idProducto
    );

    COMMIT;
    
    SELECT 'Detalle de venta insertado correctamente' AS filasAfectadas;
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

CREATE PROCEDURE contarMedioPagoPorId(
    IN p_idMedioPago INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM medioPago
    WHERE idMedioPago = p_idMedioPago;
END //

DELIMITER ;
