USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP TABLE IF EXISTS reservacion_mesas;
DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS reservaciones;
DROP TABLE IF EXISTS mesas;

CREATE TABLE mesas (
    idMesa INT PRIMARY KEY AUTO_INCREMENT,
    numeroMesa INT NOT NULL,
    capacidad INT NOT NULL DEFAULT 4,
    estadoMesa ENUM('disponible','ocupada') NOT NULL DEFAULT 'disponible'
);

CREATE TABLE reservaciones (
    idReservacion INT PRIMARY KEY AUTO_INCREMENT,
    fechaReservacion DATE NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    cantidadPersonas INT NOT NULL,
    mesasNecesarias INT NOT NULL,
    estadoReservacion ENUM('pendiente','pagado','cancelado','expirado') NOT NULL DEFAULT 'pendiente',
    codigoAcceso VARCHAR(10) NOT NULL,
    fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracionPago DATETIME NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE reservacion_mesas (
    idReservacion INT NOT NULL,
    idMesa INT NOT NULL,
    PRIMARY KEY (idReservacion, idMesa),
    FOREIGN KEY (idReservacion) REFERENCES reservaciones(idReservacion),
    FOREIGN KEY (idMesa) REFERENCES mesas(idMesa)
);

CREATE TABLE pagos (
    idPago INT PRIMARY KEY AUTO_INCREMENT,
    idReservacion INT NOT NULL,
    montoTotal DECIMAL(10,2) NOT NULL,
    montoPagado DECIMAL(10,2) DEFAULT 0,
    porcentajePago INT NOT NULL,
    idTransaccion VARCHAR(150),
    fechaPago DATETIME,
    estadoPago ENUM('pendiente','confirmado','fallido') NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (idReservacion) REFERENCES reservaciones(idReservacion)
);

