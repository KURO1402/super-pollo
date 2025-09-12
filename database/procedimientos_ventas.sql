USE super_pollo;

/*MODIFICACION PROCEDIMIENTO INSERTAR USUARIOS YA NO PIDE idRol*/
DROP PROCEDURE IF EXISTS insertarUsuario;

DELIMITER //

CREATE PROCEDURE insertarUsuario (
    IN p_nombresUsuario VARCHAR(50),
    IN p_apellidosUsuario VARCHAR(50),
    IN p_correoUsuario VARCHAR(50),
    IN p_clave CHAR(60),
    IN p_numeroDocumentoUsuario VARCHAR(12),
    IN p_telefonoUsuario VARCHAR(15),
    IN p_idTipoDocumento INT
)
BEGIN 
    INSERT INTO usuarios(
           nombresUsuario, apellidosUsuario, correoUsuario, clave, 
           numeroDocumentoUsuario, telefonoUsuario, idTipoDocumento
    )
    VALUES (
           p_nombresUsuario, p_apellidosUsuario, p_correoUsuario, p_clave, 
           p_numeroDocumentoUsuario, p_telefonoUsuario, p_idTipoDocumento
    );
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
    IN p_urlCombrobantePDF VARCHAR(100),
    IN p_urlCombrobanteXML VARCHAR(100),
    IN p_idMedioPago INT,
    IN p_idTipoComprobante INT
)
BEGIN
    INSERT INTO ventas(
        numeroDocumentoCliente, serie, numeroCorrelativo, sunatTransaccion,
        fechaEmision, fechaVencimiento, porcentajeIGV, totalGravada,
        totalIGV, totalVenta, aceptadaPorSunat, fechaRegistro,
        urlCombrobantePDF, urlCombrobanteXML, idMedioPago, idTipoComprobante
    )
    VALUES (
        p_numeroDocumentoCliente, p_serie, p_numeroCorrelativo, p_sunatTransaccion,
        p_fechaEmision, p_fechaVencimiento, p_porcentajeIGV, p_totalGravada,
        p_totalIGV, p_totalVenta, p_aceptadaPorSunat, p_fechaRegistro,
        p_urlCombrobantePDF, p_urlCombrobanteXML, p_idMedioPago, p_idTipoComprobante
    );
END //

/* PROCEDIMIENTO ALMACENADO listarVentas (20 en 20) */
CREATE PROCEDURE listarVentas(
    IN p_pagina INT # Parámetro de entrada que indica el número de página que solicita el cliente
)
BEGIN
    DECLARE v_offset INT; # Declaras una variable para calcular cuántas filas saltar
    SET v_offset = (p_pagina - 1) * 20; # Calcula cuántas filas saltar por pagina

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
        v.*,
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
