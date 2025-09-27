USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS listarTipoDocumento;
DROP PROCEDURE IF EXISTS insertarReservacion;
DROP PROCEDURE IF EXISTS listarReservaciones;
DROP PROCEDURE IF EXISTS obtenerReservacion;
DROP PROCEDURE IF EXISTS actualizarReservacion;
DROP PROCEDURE IF EXISTS insertarPago;
DROP PROCEDURE IF EXISTS obtenerPago;
DROP PROCEDURE IF EXISTS insertarDetalleReservacion;
DROP PROCEDURE IF EXISTS obtenerDetalleReservacion;

DELIMITER //

/* PROCEDIMIENTO ALMACENADO listarTipoDocumento */
CREATE PROCEDURE listarTipoDocumento()
BEGIN
    SELECT idTipoDocumento, nombreTipoDocumento
    FROM tipoDocumento;    
END //

/* PROCEDIMIENTO ALMACENADO insertarReservacion */
CREATE PROCEDURE insertarReservacion(
    IN p_fechaReservacion DATE,
    IN p_horaReservacion TIME,
    IN p_cantidadPersonas INT,
    IN p_idUsuario INT,
    IN p_idMesa INT
)
BEGIN
    INSERT INTO reservaciones(
        fechaReservacion, horaReservacion, cantidadPersonas,
        estadoReservacion, fechaCreacion, idUsuario, idMesa
    )
    VALUES (
        p_fechaReservacion, p_horaReservacion, p_cantidadPersonas,
        'pendiente', NOW(), p_idUsuario, p_idMesa
    );
END //

/* PROCEDIMIENTO ALMACENADO listarReservaciones (20 en 20) */
CREATE PROCEDURE listarReservaciones(
    IN p_pagina INT /* Parámetro de entrada que indica el número de página que solicita el cliente */
)
BEGIN
    DECLARE v_offset INT; /* Declaras una variable para calcular cuántas filas saltar */
    SET v_offset = (p_pagina - 1) * 20; /* Calcula cuántas filas saltar por pagina */

    SELECT 
        r.idReservacion, r.fechaReservacion, r.horaReservacion,
        r.cantidadPersonas, r.estadoReservacion, r.fechaCreacion,
        u.nombresUsuario, m.numeroMesa
    FROM reservaciones r
    INNER JOIN usuarios u ON r.idUsuario = u.idUsuario
    INNER JOIN mesas m ON r.idMesa = m.idMesa
    ORDER BY r.fechaCreacion DESC
    LIMIT 20 OFFSET v_offset;
END //

/* PROCEDIMIENTO ALMACENADO obtenerReservacion (por ID) */
CREATE PROCEDURE obtenerReservacion(
    IN p_idReservacion INT
)
BEGIN
    SELECT 
        r.idReservacion,
        r.fechaReservacion,
        r.horaReservacion,
        r.cantidadPersonas,
        r.estadoReservacion,
        r.fechaCreacion,
        r.idUsuario,
        r.idMesa,
        u.nombresUsuario,
        m.numeroMesa
    FROM reservaciones r
    INNER JOIN usuarios u ON r.idUsuario = u.idUsuario
    INNER JOIN mesas m ON r.idMesa = m.idMesa
    WHERE r.idReservacion = p_idReservacion;
END //

/* PROCEDIMIENTO ALMACENADO actualizarReservacion */
CREATE PROCEDURE actualizarReservacion(
    IN p_idReservacion INT,
    IN p_fechaReservacion DATE,
    IN p_horaReservacion TIME,
    IN p_cantidadPersonas INT,
    IN p_estadoReservacion ENUM('pendiente','pagado','cancelado'),
    IN p_idMesa INT
)
BEGIN
    UPDATE reservaciones
    SET 
        fechaReservacion = p_fechaReservacion,
        horaReservacion = p_horaReservacion,
        cantidadPersonas = p_cantidadPersonas,
        estadoReservacion = p_estadoReservacion,
        idMesa = p_idMesa
    WHERE idReservacion = p_idReservacion;
END //

/* PROCEDIMIENTO ALMACENADO insertarPago (de Reservacion)*/
CREATE PROCEDURE insertarPago(
    IN p_montoTotal DECIMAL(10,2),
    IN p_montoPagado DECIMAL(10,2),
    IN p_porcentajePago INT,
    IN p_idTransaccion VARCHAR(100),
    IN p_estadoPago ENUM('pendiente','confirmado','fallido'),
    IN p_idReservacion INT
)
BEGIN
    INSERT INTO pago(
        montoTotal, montoPagado, porcentajePago,
        idTransaccion, fechaPago, estadoPago, idReservacion
    )
    VALUES (
        p_montoTotal, p_montoPagado, p_porcentajePago,
        p_idTransaccion, NOW(), p_estadoPago, p_idReservacion
    );
END //

/* PROCEDIMIENTO ALMACENADO obtenerPago (por ID de Reservacion) */
CREATE PROCEDURE obtenerPago(
    IN p_idReservacion INT
)
BEGIN
    SELECT 
        idPago, montoTotal, montoPagado, porcentajePago,
        idTransaccion, fechaPago, estadoPago, idReservacion
    FROM pago
    WHERE idReservacion = p_idReservacion;
END //

/* PROCEDIMIENTO ALMACENADO insertarDetalleReservacion */
CREATE PROCEDURE insertarDetalleReservacion(
    IN p_cantidadProductoReservacion INT,
    IN p_precioUnitario DECIMAL(10,2),
    IN p_idReservacion INT,
    IN p_idProducto INT
)
BEGIN
    INSERT INTO detalleReservaciones(
        cantidadProductoReservacion, precioUnitario,
        idReservacion, idProducto
    )
    VALUES (
        p_cantidadProductoReservacion, p_precioUnitario,
        p_idReservacion, p_idProducto
    );
END //

/* PROCEDIMIENTO ALMACENADO obtenerDetalleReservacion (por ID de Reservacion) */
CREATE PROCEDURE obtenerDetalleReservacion(
    IN p_idReservacion INT
)
BEGIN
    SELECT 
        dr.idDetalleReservacion, dr.cantidadProductoReservacion,
        dr.precioUnitario, p.nombreProducto
    FROM detalleReservaciones dr
    INNER JOIN productos p ON dr.idProducto = p.idProducto
    WHERE dr.idReservacion = p_idReservacion;
END //

DELIMITER ;