USE super_pollo;

-- Eliminar si existen
DROP TABLE IF EXISTS cantidadInsumoProducto;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS movimientosStock;
DROP TABLE IF EXISTS insumos;

-- Tabla de insumos
CREATE TABLE insumos(
    idInsumo INT PRIMARY KEY AUTO_INCREMENT,
    nombreInsumo VARCHAR(50) NOT NULL,
    stockInsumo DECIMAL(10,2) NOT NULL,
    unidadMedida VARCHAR(20) NOT NULL,
    categoriaProducto ENUM('insumo','bebida') NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
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
    imagen VARCHAR(300),
    unidad VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('eliminado','activo') NOT NULL DEFAULT 'activo'
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
