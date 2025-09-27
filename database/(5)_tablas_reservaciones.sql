USE super_pollo;

/* ELIMINAR PROCEDIMIENTOS SI YA EXISTEN */
DROP TABLE IF EXISTS detalleReservaciones;
DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS reservaciones;
DROP TABLE IF EXISTS mesas;

CREATE TABLE mesas(
    idMesa INT PRIMARY KEY AUTO_INCREMENT,
    numeroMesa INT NOT NULL,
    capacidad INT NOT NULL,
    estadoMesa ENUM('disponible','reservada') NOT NULL DEFAULT 'disponible'
);

CREATE TABLE reservaciones(
    idReservacion INT PRIMARY KEY AUTO_INCREMENT,
    fechaReservacion DATE NOT NULL,
    horaReservacion TIME NOT NULL,
    cantidadPersonas INT NOT NULL,
    estadoReservacion ENUM('pendiente','pagado','cancelado') NOT NULL DEFAULT 'pendiente',
    fechaCreacion DATETIME NOT NULL,
    idUsuario INT,
    idMesa INT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idMesa) REFERENCES mesas(idMesa)
);

CREATE TABLE pago(
    idPago INT PRIMARY KEY AUTO_INCREMENT,
    montoTotal DECIMAL(10,2) NOT NULL,
    montoPagado DECIMAL(10,2) NOT NULL,
    porcentajePago INT NOT NULL,
    idTransaccion VARCHAR(100),
    fechaPago DATETIME NOT NULL,
    estadoPago ENUM('pendiente','confirmado','fallido') NOT NULL DEFAULT 'pendiente',
    idReservacion INT,
    FOREIGN KEY (idReservacion) REFERENCES reservaciones(idReservacion)
);

CREATE TABLE detalleReservaciones(
    idDetalleReservacion INT PRIMARY KEY AUTO_INCREMENT,
    cantidadProductoReservacion INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    idReservacion INT,
    idProducto INT,
    FOREIGN KEY (idReservacion) REFERENCES reservaciones(idReservacion),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);
