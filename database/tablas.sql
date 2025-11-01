-- Base de datos
DROP DATABASE IF EXISTS super_pollo;
CREATE DATABASE super_pollo;
USE super_pollo;

CREATE TABLE rolUsuarios (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    nombreRol VARCHAR(50) NOT NULL
);

CREATE TABLE tipoDocumento (
    idTipoDocumento INT PRIMARY KEY AUTO_INCREMENT,
    nombreTipoDocumento VARCHAR(50) NOT NULL
);

CREATE TABLE medioPago (
    idMedioPago INT PRIMARY KEY AUTO_INCREMENT,
    nombreMedioPago VARCHAR(50) NOT NULL
);

CREATE TABLE tipoComprobantes (
    idTipoComprobante INT PRIMARY KEY AUTO_INCREMENT,
    nombreTipoComprobante VARCHAR(50) NOT NULL,
    serie VARCHAR(5) NOT NULL
);
CREATE TABLE correlativos (
    idCorrelativo INT PRIMARY KEY AUTO_INCREMENT,
    idTipoComprobante INT NOT NULL,
    ultimoNumero INT NOT NULL DEFAULT 0,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idTipoComprobante) REFERENCES tipoComprobantes(idTipoComprobante),
    UNIQUE KEY (idTipoComprobante)
);
CREATE TABLE usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombresUsuario VARCHAR(50) NOT NULL,
    apellidosUsuario VARCHAR(50) NOT NULL,
    correoUsuario VARCHAR(50) NOT NULL UNIQUE,
    clave CHAR(60) NOT NULL,
    numeroDocumentoUsuario VARCHAR(12) NOT NULL,
    telefonoUsuario VARCHAR(15) NOT NULL,
    estadoUsuario TINYINT(1) NOT NULL DEFAULT 1,
    idRol INT DEFAULT 3,
    idTipoDocumento INT,
    FOREIGN KEY (idRol) REFERENCES rolUsuarios(idRol),
    FOREIGN KEY (idTipoDocumento) REFERENCES tipoDocumento(idTipoDocumento)
);

CREATE TABLE verificacionCorreos (
    idVerificacion INT AUTO_INCREMENT PRIMARY KEY,
    correoVerificacion VARCHAR(100) NOT NULL,
    codigoVerificacion VARCHAR(6) NOT NULL,
    expiracionVerificacion DATETIME NOT NULL,
    verificado TINYINT(1) DEFAULT 0,
    registroVerificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categoriasProducto (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    nombreCategoria VARCHAR(100)
);

CREATE TABLE productos (
    idProducto INT PRIMARY KEY AUTO_INCREMENT,
    nombreProducto VARCHAR(50) NOT NULL,
    descripcionProducto TEXT,
    precio DECIMAL(10,2) NOT NULL,
    usaInsumos TINYINT(1) NOT NULL DEFAULT 0,
    idCategoria INT,
    estadoProducto TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (idCategoria) REFERENCES categoriasProducto(idCategoria)
);

CREATE TABLE imagenesProductos (
    idImagenProducto INT PRIMARY KEY AUTO_INCREMENT,
    urlImagen VARCHAR(300),
    publicID VARCHAR(100),
    idProducto INT,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);
CREATE TABLE insumos (
    idInsumo INT PRIMARY KEY AUTO_INCREMENT,
    nombreInsumo VARCHAR(100) NOT NULL,
    stockInsumo DECIMAL(10,2) NOT NULL,
    unidadMedida VARCHAR(30) NOT NULL,
    estadoInsumo TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE cantidadInsumoProducto (
    idProducto INT,
    idInsumo INT,
    cantidadUso DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (idProducto, idInsumo),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    FOREIGN KEY (idInsumo) REFERENCES insumos(idInsumo)
);

CREATE TABLE movimientosStock (
    idMovimientoStock INT PRIMARY KEY AUTO_INCREMENT,
    cantidadMovimiento DECIMAL(10,2) NOT NULL,
    tipoMovimiento ENUM('salida','entrada') NOT NULL,
    fechaMovimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detallesMovimiento TEXT,
    idVenta INT,
    idInsumo INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idInsumo) REFERENCES insumos(idInsumo),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);
CREATE TABLE ventas (
    idVenta INT PRIMARY KEY AUTO_INCREMENT,
    numeroDocumentoCliente VARCHAR(12) NOT NULL,
    fechaEmision DATE NOT NULL,
    fechaVencimiento DATE NULL,
    porcentajeIGV DECIMAL(10,2) NOT NULL,
    totalGravada DECIMAL(10,2) NOT NULL,
    totalIGV DECIMAL(10,2) NOT NULL,
    totalVenta DECIMAL(10,2) NOT NULL,
    idMedioPago INT,
    idTipoComprobante INT,
    fechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idUsuario INT,
    FOREIGN KEY (idMedioPago) REFERENCES medioPago(idMedioPago),
    FOREIGN KEY (idTipoComprobante) REFERENCES tipoComprobantes(idTipoComprobante),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE detalleVentas (
    idDetalleVenta INT PRIMARY KEY AUTO_INCREMENT,
    cantidadProducto INT NOT NULL,
    valorUnitario DECIMAL(10,2) NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    totalProducto DECIMAL(10,2) NOT NULL,
    idVenta INT,
    idProducto INT,
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

CREATE TABLE comprobantes (
    idComprobante INT PRIMARY KEY AUTO_INCREMENT,
    idVenta INT NOT NULL,
    idTipoComprobante INT NOT NULL,
    numeroCorrelativo INT NOT NULL,
    enlaceNubefact VARCHAR(255),
    urlComprobantePDF VARCHAR(255),
    urlComprobanteXML VARCHAR(255),
    codigoHash VARCHAR(200),
    keyNubefact VARCHAR(100),
    aceptadaPorSunat TINYINT DEFAULT 0,
    estadoSunat VARCHAR(50),
    sunatResponseCode VARCHAR(10),
    fechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta),
    FOREIGN KEY (idTipoComprobante) REFERENCES tipoComprobantes(idTipoComprobante)
);
CREATE TABLE mesas (
    idMesa INT PRIMARY KEY AUTO_INCREMENT,
    numeroMesa INT NOT NULL,
    capacidad INT NOT NULL,
    estadoMesa ENUM('disponible','reservada', 'ocupada') NOT NULL DEFAULT 'disponible'
);

CREATE TABLE reservaciones (
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

CREATE TABLE detalleReservaciones (
    idDetalleReservacion INT PRIMARY KEY AUTO_INCREMENT,
    cantidadProductoReservacion INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    idReservacion INT,
    idProducto INT,
    FOREIGN KEY (idReservacion) REFERENCES reservaciones(idReservacion),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

CREATE TABLE pago (
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
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE movimientosCaja (
    idMovimientoCaja INT AUTO_INCREMENT PRIMARY KEY,
    tipoMovimiento ENUM('Ingreso','Egreso') NOT NULL,
    fechaMovimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    montoMovimiento DECIMAL(10,2) NOT NULL,
    descripcionMovCaja VARCHAR(255),
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    idVenta INT,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta)
);

CREATE TABLE arqueosCaja (
    idArqueoCaja INT AUTO_INCREMENT PRIMARY KEY,
    fechaArqueo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    montoFisico DECIMAL(10,2) NOT NULL,
    montoTarjeta DECIMAL(10,2) NOT NULL,
    montoBilleteraDigital DECIMAL(10,2) NOT NULL,
    otros DECIMAL(10,2),
    diferencia DECIMAL(10,2) NOT NULL,
    estadoCaja ENUM('cuadra','falta', 'sobra') NOT NULL,
    idCaja INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idCaja) REFERENCES caja(idCaja),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar roles de usuarios
INSERT INTO rolUsuarios (nombreRol) VALUES 
('Superadministrador'), 
('Administrador'), 
('Usuario');

-- Insertar tipos de documento
INSERT INTO tipoDocumento (nombreTipoDocumento) VALUES 
('DNI'), 
('Carné de extranjería'), 
('RUC');

-- Insertar tipos de comprobantes
INSERT INTO tipoComprobantes (nombreTipoComprobante, serie) VALUES
('Factura', 'FFF1'),
('Boleta', 'BBB1');

-- Insertar correlativos
INSERT INTO correlativos (idTipoComprobante, ultimoNumero) VALUES
(1, 2),  -- Factura
(2, 15); -- Boleta;

-- Insertar medios de pago
INSERT INTO medioPago (nombreMedioPago) VALUES 
('Efectivo'), 
('Tarjeta'), 
('Billetera digital');