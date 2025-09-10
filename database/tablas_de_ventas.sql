USE super_pollo;

/*MODIFICACION PARA QUE TELEFONO SEA NOT NULL*/
ALTER TABLE usuarios
MODIFY COLUMN telefonoUsuario VARCHAR(15) NOT NULL;

/*MODIFICACION PARA QUE idRol SEA DEFAULT*/
ALTER TABLE usuarios
ALTER COLUMN idRol SET DEFAULT 3;

/*CREACION DE TABLAS DE VENTAS*/
CREATE TABLE insumos(
idInsumo INT PRIMARY KEY AUTO_INCREMENT,
nombreInsumo VARCHAR(50) NOT NULL,
stockInsumo DECIMAL(10,2) NOT NULL,
unidadMedida VARCHAR(20) NOT NULL,
categoriaProducto ENUM('insumo','bebida') NOT NULL
);

CREATE TABLE movimientosStock(
idMovimientoStock INT PRIMARY KEY AUTO_INCREMENT,
cantidadMovimiento DECIMAL(10,2) NOT NULL,
tipoMovimiento ENUM('salida','entrada') NOT NULL,
fechaMovimiento DATETIME NOT NULL,
detallesMovimiento TEXT,
idInsumo INT,
idUsuario INT,
FOREIGN KEY (idInsumo) REFERENCES insumos(idInsumo),
FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE productos(
idProducto INT PRIMARY KEY AUTO_INCREMENT,
nombreProducto VARCHAR(50) NOT NULL,
descripcionProducto TEXT,
imagen VARCHAR(300),
unidad VARCHAR(50) NOT NULL,
precio DECIMAL(10,2) NOT NULL,
estado ENUM('eliminado','activo') NOT NULL DEFAULT 'activo'
);

CREATE TABLE cantidadInsumoProducto(
idProducto INT,
idInsumo INT,
cantidadUso DECIMAL(10,2) NOT NULL,
PRIMARY KEY (idProducto, idInsumo),
FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
FOREIGN KEY (idInsumo) REFERENCES insumos(idInsumo)
);

CREATE TABLE tipoComprobantes(
idTipoComprobante INT PRIMARY KEY AUTO_INCREMENT,
nombreTipoComprobante VARCHAR(50) NOT NULL
);

CREATE TABLE medioPago(
idMedioPago INT PRIMARY KEY AUTO_INCREMENT,
nombreMedioPago VARCHAR(50) NOT NULL
);

CREATE TABLE ventas(
idVenta INT PRIMARY KEY AUTO_INCREMENT,
numeroDocumentoCliente VARCHAR(12) NOT NULL,
serie VARCHAR(5) NOT NULL,
numeroCorrelativo INT NOT NULL,
sunatTransaccion TINYINT NOT NULL,
fechaEmision DATE NOT NULL,
fechaVencimiento DATE NULL,
porcentajeIGV DECIMAL(10,2) NOT NULL,
totalGravada DECIMAL(10,2) NOT NULL,
totalIGV DECIMAL(10,2) NOT NULL,
totalVenta DECIMAL(10,2) NOT NULL,
aceptadaPorSunat TINYINT NOT NULL,
fechaRegistro DATETIME NOT NULL,
urlCombrobantePDF VARCHAR(100),
urlCombrobanteXML VARCHAR(100),
idMedioPago INT,
idTipoComprobante INT,
FOREIGN KEY (idMedioPago) REFERENCES medioPago(idMedioPago),
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

/* INSERTAR SEED DATA */
INSERT INTO tipoComprobantes (nombreTipoComprobante) 
VALUES ('Boleta'), ('Factura');

INSERT INTO medioPago (nombreMedioPago) 
VALUES ('Efectivo'), ('Tarjeta'), ('Billetera Digital');