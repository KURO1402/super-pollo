USE super_pollo;

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS eliminar_verificados_7dias
ON SCHEDULE
  EVERY 1 DAY
  STARTS TIMESTAMP(CURRENT_DATE, '02:00:00')  
DO
  DELETE FROM verificacionCorreos
  WHERE verificado = 1
    AND registroVerificacion < NOW() - INTERVAL 7 DAY;