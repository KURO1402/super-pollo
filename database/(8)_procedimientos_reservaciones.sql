USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP PROCEDURE IF EXISTS listarMesasDisponibles;
DROP PROCEDURE IF EXISTS registrarReservacion;

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
END//

/* PROCEDIMIENTO ALMACENADO registrarReservacion */
CREATE PROCEDURE registrarReservacion (
    IN p_fechaReservacion DATE,
    IN p_horaReservacion TIME,
    IN p_cantidadPersonas INT,
    IN p_idUsuario INT,
    IN p_idMesa INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN

        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error en la transacción de reserva. Se realizó un ROLLBACK.';
    END;

    START TRANSACTION;

    INSERT INTO reservaciones (
        fechaReservacion,
        horaReservacion,
        cantidadPersonas,
        idUsuario,
        idMesa
    )
    VALUES (
        p_fechaReservacion,
        p_horaReservacion,
        p_cantidadPersonas,
        p_idUsuario,
        p_idMesa
    );

    COMMIT;
    SELECT "Reserva registrada correctamente" AS mensaje;
END //
DELIMITER ;