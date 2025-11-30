USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS listarMesasDisponibles;
DROP PROCEDURE IF EXISTS registrarReservacion;
DROP PROCEDURE IF EXISTS registrarReservacionMesa;

DELIMITER //

CREATE PROCEDURE listarMesasDisponibles (
    IN p_fecha DATE,
    IN p_horaInicio TIME
)
BEGIN
    SET @horaFin = ADDTIME(p_horaInicio, '01:30:00');

    SELECT m.*
    FROM mesas m
    WHERE m.idMesa NOT IN (
        SELECT rm.idMesa
        FROM reservaciones r
        INNER JOIN reservacion_mesas rm 
            ON r.idReservacion = rm.idReservacion
        WHERE r.fechaReservacion = p_fecha
        AND r.estadoReservacion IN ('pendiente','pagado')
        AND (
            p_horaInicio < r.horaFin
            AND @horaFin > r.horaInicio
        )
    );
END //

/* PROCEDIMIENTO ALMACENADO registrarReservacion */
CREATE PROCEDURE registrarReservacion(
    IN p_fechaReservacion DATE,
    IN p_horaInicio TIME,
    IN p_horaFin TIME,
    IN p_cantidadPersonas INT,
    IN p_codigoAcceso VARCHAR(10),
    IN p_fechaExpiracionPago DATETIME,
    IN p_idUsuario INT
)
BEGIN
    DECLARE v_idReserva INT; 
    INSERT INTO reservaciones (
        fechaReservacion,
        horaInicio,
        horaFin,
        cantidadPersonas,
        codigoAcceso,
        fechaExpiracionPago,
        idUsuario
    ) VALUES (
        p_fechaReservacion,
        p_horaInicio,
        p_horaFin,
        p_cantidadPersonas,
        p_codigoAcceso,
        p_fechaExpiracionPago,
        p_idUsuario
    );
    SET v_idReserva = LAST_INSERT_ID();
    SELECT v_idReserva AS idReserva;
END // 

CREATE PROCEDURE registrarReservacionMesa(
    IN p_idReservacion INT,
    IN p_idMesa INT
)
BEGIN
    INSERT INTO reservacion_mesas (
        idReservacion,
        idMesa
    ) VALUES (
        p_idReservacion,
        p_idMesa
    );
END //

DELIMITER ;