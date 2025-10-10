use super_pollo;

/* ELIMINAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA SI YA EXISTEN */
DROP PROCEDURE IF EXISTS crearCajaConEvento;
DROP PROCEDURE IF EXISTS cerrarCajaConEvento;
DROP PROCEDURE IF EXISTS consultarCajaAbierta;

/* CREAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA */
DELIMITER //

-- Procedimiento de apertura de caja con evento de apertura
CREATE PROCEDURE crearCajaConEvento(
    IN p_saldoInicial DECIMAL(10,2),
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;

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
END //

-- Procedimiento de cierre de caja con evento de cierre
CREATE PROCEDURE cerrarCajaConEvento(
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idCaja INT;
    DECLARE v_saldoFinal DECIMAL(10,2);

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

DELIMITER ;
