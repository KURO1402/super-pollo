USE super_pollo;

/* ELIMINAR TABLAS DE CAJA SI YA EXISTEN*/
DROP TABLE IF EXISTS eventosCaja;
DROP TABLE IF EXISTS movimientosCaja;
DROP TABLE IF EXISTS arqueosCaja;
DROP TABLE IF EXISTS caja;

-- Tabla principal de caja
CREATE TABLE caja (
    idCaja INT AUTO_INCREMENT PRIMARY KEY,
    saldoInicial DECIMAL(10,2) NOT NULL,
    montoActual DECIMAL(10,2) NOT NULL,
    saldoFinal DECIMAL(10,2),
    fechaCaja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estadoCaja ENUM('abierta','cerrada') NOT NULL DEFAULT 'abierta'
);

-- Tabla para registrar eventos de caja (apertura y cierre)
CREATE TABLE eventosCaja (
    idEventoCaja INT AUTO_INCREMENT PRIMARY KEY,
    tipoEvento ENUM('Apertura','Cierre') NOT NULL,
    fechaEvento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saldoEvento DECIMAL(10,2) NOT NULL,
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Tabla para registrar movimientos de caja
CREATE TABLE movimientosCaja (
    idMovimientoCaja INT AUTO_INCREMENT PRIMARY KEY,
    tipoMovimiento ENUM('Ingreso','Egreso') NOT NULL,
    fechaMovimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    montoMovimiento DECIMAL(10,2) NOT NULL,
    descripcionMovCaja VARCHAR(255),
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Tabla para registrar arqueos de caja
CREATE TABLE arqueosCaja(
    idArqueoCaja INT AUTO_INCREMENT PRIMARY KEY,
    fechaArqueo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    montoContado DECIMAL(10,2) NOT NULL,
    diferencia DECIMAL(10,2),
    estadoCaja ENUM('cuadra','falta', 'sobra') NOT NULL,
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
)