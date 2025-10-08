USE super_pollo;

/* ELIMINAR TABLAS DE CAJA SI YA EXISTEN*/
DROP TABLE IF EXISTS eventosCaja;
DROP TABLE IF EXISTS caja;

/* CREAR TABLAS DEL MODULO DE CAJA */
CREATE TABLE caja (
    idCaja INT AUTO_INCREMENT PRIMARY KEY,
    saldoInicial DECIMAL(10,2) NOT NULL,
    montoActual DECIMAL(10,2) NOT NULL,
    saldoFinal DECIMAL(10,2),
    fechaCaja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estadoCaja ENUM('abierta','cerrada') NOT NULL DEFAULT 'abierta'
);

CREATE TABLE eventosCaja (
    idEventoCaja INT AUTO_INCREMENT PRIMARY KEY,
    tipoEvento ENUM('Apertura','Cierre') NOT NULL,
    fechaEvento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saldoEvento DECIMAL(10,2) NOT NULL,
    idCaja INT,
    idUsuario INT,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
)