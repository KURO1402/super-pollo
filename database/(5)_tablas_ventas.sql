USE super_pollo;

DROP TABLE IF EXISTS detalleVentas;
DROP TABLE IF EXISTS comprobantes;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS correlativos;
DROP TABLE IF EXISTS medioPago;
DROP TABLE IF EXISTS tipoComprobantes;

CREATE TABLE tipoComprobantes(
    idTipoComprobante INT PRIMARY KEY AUTO_INCREMENT,
    nombreTipoComprobante VARCHAR(50) NOT NULL,
    serie VARCHAR(5) NOT NULL -- Ejemplo: F001, B001, NC01, ND01
);

-- Tabla correlativos (una fila por tipo comprobante)
CREATE TABLE correlativos(
    idCorrelativo INT PRIMARY KEY AUTO_INCREMENT,
    idTipoComprobante INT NOT NULL,
    ultimoNumero INT NOT NULL DEFAULT 0,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idTipoComprobante) REFERENCES tipoComprobantes(idTipoComprobante),
    UNIQUE KEY (idTipoComprobante) -- solo un correlativo por tipo
);

CREATE TABLE medioPago(
    idMedioPago INT PRIMARY KEY AUTO_INCREMENT,
    nombreMedioPago VARCHAR(50) NOT NULL
);

CREATE TABLE ventas(
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

CREATE TABLE comprobantes (
    idComprobante INT PRIMARY KEY AUTO_INCREMENT,
    idVenta INT NOT NULL,
    idTipoComprobante INT NOT NULL,          -- FK a tipoComprobantes
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

CREATE TABLE detalleVentas(
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

/* INSERTAR TIPOS COMPROBANTES */
INSERT INTO tipoComprobantes (nombreTipoComprobante, serie) VALUES
('Factura', 'FFF1'),
('Boleta', 'BBB1');

/*Insertar correlativos*/
INSERT INTO correlativos (idTipoComprobante, ultimoNumero) VALUES
(1, 2),  -- Factura
(2, 15),  -- Boleta
(3, 0),  -- Nota de Crédito
(4, 0);  -- Nota de Débito

/* INSERTAR MEDIOS PAGOS */
INSERT INTO medioPago (nombreMedioPago) 
VALUES ('Efectivo'), ('Tarjeta'), ('Billetera digital');