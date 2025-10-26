USE super_pollo;

-- Eliminar si existen
DROP TABLE IF EXISTS cantidadInsumoProducto;
DROP TABLE IF EXISTS movimientosStock;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS imagenesProductos;



-- Tabla de insumos
CREATE TABLE insumos(
    idInsumo INT PRIMARY KEY AUTO_INCREMENT,
    nombreInsumo VARCHAR(50) NOT NULL,
    stockInsumo DECIMAL(10,2) NOT NULL,
    unidadMedida VARCHAR(20) NOT NULL,
    categoriaInsumo ENUM('insumo','producto') NOT NULL,
    estadoInsumo TINYINT(1) NOT NULL DEFAULT 1
);

-- Tabla de movimientos de stock
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

-- Tabla de productos
CREATE TABLE productos(
    idProducto INT PRIMARY KEY AUTO_INCREMENT,
    nombreProducto VARCHAR(50) NOT NULL,
    descripcionProducto TEXT,
    precio DECIMAL(10,2) NOT NULL,
    usaInsumos TINYINT(1) NOT NULL DEFAULT 0,
    estadoProducto TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE imagenesProductos(
    idImagenProducto INT PRIMARY KEY AUTO_INCREMENT,
    urlImagen VARCHAR(300),
    publicID VARCHAR(100),
    idProducto INT,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

-- Relación insumo - producto
CREATE TABLE cantidadInsumoProducto(
    idProducto INT,
    idInsumo INT,
    cantidadUso DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (idProducto, idInsumo),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    FOREIGN KEY (idInsumo) REFERENCES insumos(idInsumo)
);
