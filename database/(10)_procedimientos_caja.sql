use super_pollo;

/* ELIMINAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA SI YA EXISTEN */
DROP PROCEDURE IF EXISTS crearCajaConEvento;
DROP PROCEDURE IF EXISTS cerrarCajaConEvento;
DROP PROCEDURE IF EXISTS consultarCajaAbierta;
DROP PROCEDURE IF EXISTS registrarIngresoCaja;
DROP PROCEDURE IF EXISTS registrarEgresoCaja;
DROP PROCEDURE IF EXISTS registrarArqueoCaja;
DROP PROCEDURE IF EXISTS obtenerMovimientosPorCaja;
DROP PROCEDURE IF EXISTS obtenerUltimosMovimientosCaja;
DROP PROCEDURE IF EXISTS obtenerCajasCerradas;
DROP PROCEDURE IF EXISTS obtenerArqueosCaja;
DROP PROCEDURE IF EXISTS obtenerArqueosPorCaja;

/* CREAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA */
DELIMITER //

-- Procedimiento de apertura de caja con evento de apertura
CREATE PROCEDURE crearCajaConEvento(
    IN p_saldoInicial DECIMAL(10,2),
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;

    -- Manejo de errores: rollback automático si algo falla
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al crear la caja o registrar el evento de apertura';
    END;

    -- Validar que no exista una caja abierta antes de iniciar transacción
    IF EXISTS (SELECT 1 FROM caja WHERE estadoCaja = 'abierta') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una caja abierta. No se puede crear otra.';
    END IF;

    -- Iniciar transacción
    START TRANSACTION;

    -- Crear la caja (saldo inicial = monto actual al inicio)
    INSERT INTO caja (saldoInicial, montoActual, saldoFinal, estadoCaja)
    VALUES (p_saldoInicial, p_saldoInicial, p_saldoInicial, 'abierta');

    SET v_idCaja = LAST_INSERT_ID();

    -- Registrar evento de apertura
    INSERT INTO eventosCaja (tipoEvento, saldoEvento, idCaja, idUsuario)
    VALUES ('Apertura', p_saldoInicial, v_idCaja, p_idUsuario);

    -- Confirmar cambios
    COMMIT;

    -- Devolver el id generado
    SELECT v_idCaja AS idCaja;
END //

-- Procedimiento de cierre de caja con evento de cierre
CREATE PROCEDURE cerrarCajaConEvento(
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;
    DECLARE v_saldoFinal DECIMAL(10,2);

    -- Manejo de errores: rollback automático si algo falla
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al cerrar la caja o registrar el evento de cierre';
    END;

    -- Buscar la caja abierta
    SELECT idCaja, montoActual INTO v_idCaja, v_saldoFinal
    FROM caja
    WHERE estadoCaja = 'abierta'
    LIMIT 1;

    -- Validar si existe caja abierta
    IF v_idCaja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No existe una caja abierta. No se puede cerrar ninguna.';
    END IF;

    -- Iniciar transacción
    START TRANSACTION;

    -- Cerrar la caja
    UPDATE caja
    SET estadoCaja = 'cerrada'
    WHERE idCaja = v_idCaja;

    -- Registrar el evento de cierre con el saldo actual
    INSERT INTO eventosCaja (tipoEvento, saldoEvento, idCaja, idUsuario)
    VALUES ('Cierre', v_saldoFinal, v_idCaja, p_idUsuario);

    -- Confirmar transacción
    COMMIT;
END //

-- Procedimiento de consultar caja abierta
CREATE PROCEDURE consultarCajaAbierta()
BEGIN
    -- Buscar caja con estado "abierta"
    SELECT 
        idCaja,
        saldoInicial,
        montoActual,
        fechaCaja,
        estadoCaja
    FROM caja
    WHERE estadoCaja = 'abierta'
    ORDER BY fechaCaja DESC
    LIMIT 1;
END //


-- Procedimiento para registrar un ingreso en caja
CREATE PROCEDURE registrarIngresoCaja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion VARCHAR(255),
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;
    DECLARE v_montoActual DECIMAL(10,2);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar el ingreso en caja';
    END;

    START TRANSACTION;

    -- Verificar que exista una caja abierta
    SELECT idCaja, montoActual
    INTO v_idCaja, v_montoActual
    FROM caja
    WHERE estadoCaja = 'abierta'
    ORDER BY fechaCaja DESC
    LIMIT 1
    FOR UPDATE; -- bloquea la fila hasta finalizar

    IF v_idCaja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el ingreso';
    END IF;

    -- Insertar el movimiento
    INSERT INTO movimientosCaja (
        tipoMovimiento,
        montoMovimiento,
        descripcionMovCaja,
        idCaja,
        idUsuario
    )
    VALUES (
        'Ingreso',
        p_monto,
        p_descripcion,
        v_idCaja,
        p_idUsuario
    );

    -- Actualizar la caja
    UPDATE caja
    SET 
        montoActual = v_montoActual + p_monto,
        saldoFinal = v_montoActual + p_monto
    WHERE idCaja = v_idCaja;

    COMMIT;
END //

-- Procedimiento para registrar un egreso en caja
CREATE PROCEDURE registrarEgresoCaja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion VARCHAR(255),
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;
    DECLARE v_montoActual DECIMAL(10,2);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar el egreso en caja';
    END;

    START TRANSACTION;

    -- Verificar que exista una caja abierta
    SELECT idCaja, montoActual
    INTO v_idCaja, v_montoActual
    FROM caja
    WHERE estadoCaja = 'abierta'
    ORDER BY fechaCaja DESC
    LIMIT 1
    FOR UPDATE; -- bloquea la fila para evitar condiciones de carrera

    IF v_idCaja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el egreso';
    END IF;

    -- Validar saldo suficiente
    IF v_montoActual < p_monto THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en caja para realizar el egreso';
    END IF;

    -- Insertar el movimiento
    INSERT INTO movimientosCaja (
        tipoMovimiento,
        montoMovimiento,
        descripcionMovCaja,
        idCaja,
        idUsuario
    )
    VALUES (
        'Egreso',
        p_monto,
        p_descripcion,
        v_idCaja,
        p_idUsuario
    );

    -- Actualizar caja
    UPDATE caja
    SET 
        montoActual = v_montoActual - p_monto,
        saldoFinal = v_montoActual - p_monto
    WHERE idCaja = v_idCaja;

    COMMIT;
END //

-- Procedimiento para registrar un arqueo de caja
CREATE PROCEDURE registrarArqueoCaja(
    IN p_idUsuario INT,
    IN p_montoFisico DECIMAL(10,2),
    IN p_montoTarjeta DECIMAL(10,2),
    IN p_montoBilletera DECIMAL(10,2),
    IN p_montoOtros DECIMAL(10,2),
    IN p_diferencia DECIMAL(10,2),
    IN p_estadoArqueo VARCHAR(10)
)
BEGIN
    DECLARE v_idCaja INT;

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar el arqueo de caja';
    END;

    START TRANSACTION;

    -- 1️⃣ Buscar la caja abierta
    SELECT idCaja INTO v_idCaja
    FROM caja
    WHERE estadoCaja = 'abierta'
    LIMIT 1;

    -- 2️⃣ Validar si existe una caja abierta
    IF v_idCaja IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay una caja abierta actualmente';
    END IF;

    -- 3️⃣ Insertar el arqueo
    INSERT INTO arqueosCaja (
        montoFisico,
        montoTarjeta,
        montoBilleteraDigital,
        otros,
        diferencia,
        estadoCaja,
        idCaja,
        idUsuario
    )
    VALUES (
        p_montoFisico,
        p_montoTarjeta,
        p_montoBilletera,
        p_montoOtros,
        p_diferencia,
        p_estadoArqueo,
        v_idCaja,
        p_idUsuario
    );

    COMMIT;
END //

-- Procedimiento para obtener los movimientos de una caja específica
CREATE PROCEDURE obtenerMovimientosPorCaja(
    IN p_idCaja INT
)
BEGIN
    SELECT 
        mc.idMovimientoCaja,
        mc.tipoMovimiento,
        mc.descripcionMovCaja,
        mc.montoMovimiento,
        DATE_FORMAT(mc.fechaMovimiento, '%d/%m/%Y') AS fecha,
        DATE_FORMAT(mc.fechaMovimiento, '%H:%i') AS hora,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosCaja mc
    INNER JOIN usuarios u ON mc.idUsuario = u.idUsuario
    WHERE mc.idCaja = p_idCaja
    ORDER BY mc.fechaMovimiento DESC;
END //

-- Procedimiento para obtener los movimientos de la caja abierta por partes
CREATE PROCEDURE obtenerUltimosMovimientosCaja(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        mc.idMovimientoCaja,
        mc.tipoMovimiento,
        mc.descripcionMovCaja,
        mc.montoMovimiento,
        DATE_FORMAT(mc.fechaMovimiento, '%d/%m/%Y') AS fecha,
        DATE_FORMAT(mc.fechaMovimiento, '%H:%i') AS hora,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM movimientosCaja mc
    INNER JOIN usuarios u ON mc.idUsuario = u.idUsuario
    ORDER BY mc.fechaMovimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedimiento para obtener detalles de las cajas cerradas por partes
CREATE PROCEDURE obtenerCajasCerradas(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        c.idCaja,
        DATE_FORMAT(c.fechaCaja, '%d/%m/%Y') AS fecha,
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario,
        c.montoActual,
        ac.montoContado,
        ac.diferencia,
        ac.estadoCaja
    FROM caja c
    INNER JOIN (
        SELECT idCaja, MAX(idArqueoCaja) AS ultimoArqueo
        FROM arqueosCaja
        GROUP BY idCaja
    ) ult ON c.idCaja = ult.idCaja
    INNER JOIN arqueosCaja ac ON ac.idArqueoCaja = ult.ultimoArqueo
    INNER JOIN usuarios u ON ac.idUsuario = u.idUsuario
    WHERE c.estadoCaja = 'cerrada'
    ORDER BY c.fechaCaja DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedimiento para obtener los arqueos de cajas anteriores
CREATE PROCEDURE obtenerArqueosCaja(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        ac.idArqueoCaja,
        DATE_FORMAT(ac.fechaArqueo, '%H:%i') AS horaArqueo,     -- Hora en formato hh:mm
        ac.montoFisico,
        ac.montoTarjeta,
        ac.montoBilleteraDigital,
        ac.otros,
        ac.diferencia,
        ac.estadoCaja,
        DATE_FORMAT(c.fechaCaja, '%d/%m/%Y') AS fechaCaja,      -- Fecha en formato dd/mm/yyyy
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM arqueosCaja ac
    INNER JOIN caja c ON ac.idCaja = c.idCaja
    INNER JOIN usuarios u ON ac.idUsuario = u.idUsuario
    ORDER BY ac.fechaArqueo DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedimiento para obtener los arqueos de la caja abierta
CREATE PROCEDURE obtenerArqueosPorCaja(
    IN p_idCaja INT
)
BEGIN
    -- Retornar los arqueos asociados a esa caja
    SELECT 
        ac.idArqueoCaja,
        DATE_FORMAT(ac.fechaArqueo, '%H:%i') AS horaArqueo,     -- Hora en formato hh:mm
        ac.montoFisico,
        ac.montoTarjeta,
        ac.montoBilleteraDigital,
        ac.otros,
        ac.diferencia,
        ac.estadoCaja,
        DATE_FORMAT(c.fechaCaja, '%d/%m/%Y') AS fechaCaja,      -- Fecha en formato dd/mm/yyyy
        CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) AS nombreUsuario
    FROM arqueosCaja ac
    INNER JOIN caja c ON ac.idCaja = c.idCaja
    INNER JOIN usuarios u ON ac.idUsuario = u.idUsuario
    WHERE ac.idCaja = p_idCaja
    ORDER BY ac.fechaArqueo DESC;
END //

DELIMITER ;