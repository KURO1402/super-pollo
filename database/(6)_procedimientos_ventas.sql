USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS obtenerTiposComprobante;
DROP PROCEDURE IF EXISTS obtenerUltimoCorrelativo;
DROP PROCEDURE IF EXISTS registrarVentaYComprobante;
DROP PROCEDURE IF EXISTS insertarDetalleVenta;
DROP PROCEDURE IF EXISTS obtenerResumenVentas;
DROP PROCEDURE IF EXISTS obtenerDetalleVenta;
DROP PROCEDURE IF EXISTS obtenerSeriePorTipoComprobante;
DROP PROCEDURE IF EXISTS actualizarCorrelativoSolo;
DROP PROCEDURE IF EXISTS contarMedioPagoPorId;
DROP PROCEDURE IF EXISTS actualizarComprobanteAnulado;
DROP PROCEDURE IF EXISTS obtenerComprobantePorId;
DROP PROCEDURE IF EXISTS obtenerResumenVentasPorAceptacionSunat;
DROP PROCEDURE IF EXISTS obtenerVentasPorComprobante;
DROP PROCEDURE IF EXISTS obtenerResumenVentasPorNombreUsuario;
DROP PROCEDURE IF EXISTS obtenerResumenVentasPorRangoFecha;
DROP PROCEDURE IF EXISTS obtenerResumenVentaPorId;
DROP PROCEDURE IF EXISTS obtenerResumenVentas;
DROP PROCEDURE IF EXISTS obtenerEstadosSunat;
DROP PROCEDURE IF EXISTS obtenerMediosPago;

DELIMITER //

    /*Obtener todos los tipos de comprobante*/
    CREATE PROCEDURE obtenerTiposComprobante()
    BEGIN
        SELECT idTipoComprobante, nombreTipoComprobante, serie
        FROM tipocomprobantes;
    END //

    /* PROCEDIMIENTO ALMACENADO para obtener la serie segun el id del tipo de comprobante */
    CREATE PROCEDURE obtenerSeriePorTipoComprobante(
        IN p_idTipoComprobante INT
    )
    BEGIN
        SELECT serie
        FROM tipocomprobantes
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
        IN p_nombreCliente VARCHAR(100),
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
            nombreCliente,
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
            p_nombreCliente,
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

        INSERT INTO detalleventas(
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
        FROM detalleventas dv
        INNER JOIN productos p ON dv.idProducto = p.idProducto
        WHERE dv.idVenta = p_idVenta;
    END //

    CREATE PROCEDURE contarMedioPagoPorId(
        IN p_idMedioPago INT
    )
    BEGIN
        SELECT COUNT(*) AS total
        FROM mediopago
        WHERE idMedioPago = p_idMedioPago;
    END //

    CREATE PROCEDURE obtenerComprobantePorId(
        IN p_idComprobante INT
    )
    BEGIN
        SELECT 
            c.idComprobante,
            c.idVenta,
            c.idTipoComprobante,
            tc.nombreTipoComprobante,
            tc.serie,
            c.numeroCorrelativo,
            c.enlaceNubefact,
            c.urlComprobantePDF,
            c.urlComprobanteXML,
            c.codigoHash,
            c.keyNubefact,
            c.aceptadaPorSunat,
            c.estadoSunat,
            c.sunatResponseCode,
            c.fechaEnvio
        FROM comprobantes c
        INNER JOIN tipocomprobantes tc 
            ON c.idTipoComprobante = tc.idTipoComprobante
        WHERE c.idComprobante = p_idComprobante;
    END //

    CREATE PROCEDURE actualizarComprobanteAnulado(
        IN p_idComprobante INT,
        IN p_enlaceNubefact VARCHAR(255),
        IN p_urlComprobanteXML VARCHAR(255),
        IN p_keyNubefact VARCHAR(100),
        IN p_aceptadaPorSunat TINYINT,
        IN p_estadoSunat VARCHAR(50),
        IN p_sunatResponseCode VARCHAR(10)
    )
    BEGIN
        -- Handler para cualquier excepción
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar el comprobante anulado.';
        END;

        START TRANSACTION;

        UPDATE comprobantes
        SET
            enlaceNubefact = p_enlaceNubefact,
            urlComprobanteXML = p_urlComprobanteXML,
            keyNubefact = p_keyNubefact,
            aceptadaPorSunat = p_aceptadaPorSunat,
            estadoSunat = p_estadoSunat,
            sunatResponseCode = p_sunatResponseCode
        WHERE idComprobante = p_idComprobante;

        COMMIT;
        SELECT 'Comprobante actualizado correctamente.' AS mensaje;

    END //

    CREATE PROCEDURE obtenerResumenVentas(
        IN p_limit INT,
        IN p_offset INT
    )
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipoComprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        ORDER BY v.idVenta DESC
        LIMIT p_limit OFFSET p_offset;
    END //

    CREATE PROCEDURE obtenerResumenVentaPorId(IN p_idVenta INT)
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipocomprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        WHERE v.idVenta = p_idVenta;
    END //

    CREATE PROCEDURE obtenerResumenVentasPorRangoFecha(
        IN p_fechaInicio DATE,
        IN p_fechaFin DATE,
        IN p_limit INT,
        IN p_offset INT
    )
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipocomprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        WHERE v.fechaEmision BETWEEN p_fechaInicio AND p_fechaFin
        ORDER BY v.idVenta DESC
        LIMIT p_limit OFFSET p_offset;
    END //

    CREATE PROCEDURE obtenerResumenVentasPorNombreUsuario(
        IN p_busqueda VARCHAR(100),
        IN p_limit INT,
        IN p_offset INT
    )
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipocomprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        WHERE u.nombresUsuario LIKE CONCAT('%', p_busqueda, '%')
        OR u.apellidosUsuario LIKE CONCAT('%', p_busqueda, '%')
        ORDER BY v.idVenta DESC
        LIMIT p_limit OFFSET p_offset;
    END //

    CREATE PROCEDURE obtenerVentasPorComprobante(
        IN p_busqueda VARCHAR(50),
        IN p_limit INT,
        IN p_offset INT
    )
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipocomprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        WHERE CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) LIKE CONCAT('%', p_busqueda, '%')
        ORDER BY v.idVenta DESC
        LIMIT p_limit OFFSET p_offset;
    END //

    CREATE PROCEDURE obtenerResumenVentasPorAceptacionSunat(
        IN p_aceptadaSunat TINYINT,
        IN p_limit INT,
        IN p_offset INT
    )
    BEGIN
        SELECT
            v.idVenta,
            CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
            v.nombreCliente,
            DATE_FORMAT(v.fechaEmision, '%d-%m-%Y') AS fechaEmision,
            DATE_FORMAT(v.fechaVencimiento, '%d-%m-%Y') AS fechaVencimiento,
            v.totalVenta,
            mp.nombreMedioPago,
            tc.nombreTipoComprobante,
            CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS usuarioRegistro,
            c.aceptadaPorSunat,
            CASE 
                WHEN c.aceptadaPorSunat = 1 THEN 'ACEPTADO'
                WHEN c.aceptadaPorSunat = 0 THEN 'DENEGADO'
                ELSE 'DESCONOCIDO'
            END AS estadoSunat
        FROM ventas v
        LEFT JOIN comprobantes c ON c.idVenta = v.idVenta
        LEFT JOIN tipocomprobantes tc ON tc.idTipoComprobante = v.idTipoComprobante
        LEFT JOIN mediopago mp ON mp.idMedioPago = v.idMedioPago
        LEFT JOIN usuarios u ON u.idUsuario = v.idUsuario
        WHERE c.aceptadaPorSunat = p_aceptadaSunat
        ORDER BY v.idVenta DESC
        LIMIT p_limit OFFSET p_offset;
    END //

CREATE PROCEDURE obtenerEstadosSunat()
BEGIN
    SELECT DISTINCT 
        aceptadaPorSunat,
        CASE 
            WHEN aceptadaPorSunat = 1 THEN 'ACEPTADO'
            WHEN aceptadaPorSunat = 0 THEN 'DENEGADO'
            ELSE 'DESCONOCIDO'
        END AS estadoSunat
    FROM comprobantes;
END //

CREATE PROCEDURE obtenerMediosPago()
BEGIN
    SELECT 
        idMedioPago,
        nombreMedioPago
    FROM mediopago
    ORDER BY idMedioPago ASC;
END //

CREATE PROCEDURE obtenerDetalleVentaPorIdVenta(
    IN p_idVenta INT
)
BEGIN
    SELECT 
        dv.idDetalleVenta,
        dv.cantidadProducto,
        dv.valorUnitario,
        dv.precioUnitario,
        dv.subtotal,
        dv.igv,
        dv.totalProducto,
        p.nombreProducto
    FROM detalleventas dv
    INNER JOIN productos p ON p.idProducto = dv.idProducto
    WHERE dv.idVenta = p_idVenta
    ORDER BY dv.idDetalleVenta ASC;
END //

CREATE PROCEDURE obtenerComprobantePorIdVenta(
    IN p_idVenta INT
)
BEGIN
    SELECT 
        c.idComprobante,
        tc.nombreTipoComprobante,
        CONCAT(tc.serie, '-', LPAD(c.numeroCorrelativo, 8, '0')) AS comprobante,
        c.numeroCorrelativo,
        c.enlaceNubefact,
        c.urlComprobantePDF,
        c.aceptadaPorSunat,
        DATE_FORMAT(c.fechaEnvio, '%d-%m-%Y %H:%i:%s') AS fechaEnvio
    FROM comprobantes c
    INNER JOIN tipocomprobantes tc ON tc.idTipoComprobante = c.idTipoComprobante
    WHERE c.idVenta = 1
    ORDER BY c.idComprobante DESC;
END //

DELIMITER ;