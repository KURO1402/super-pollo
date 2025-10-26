INSERT INTO insumos (nombreInsumo, unidadMedida, stockInsumo, categoriaInsumo)
VALUES
('Pollo', 'unidad', 50, 'insumo'),
('Arroz', 'kg', 20, 'insumo'),
('Aceite', 'litro', 10, 'insumo'),
('Papa', 'kg', 30, 'insumo'),
('Cebolla', 'kg', 15, 'insumo');

INSERT INTO productos ( nombreProducto, descripcionProducto, precio, usaInsumos, estadoProducto)
VALUES
('Pollo a la brasa', 'Pollo entero al carbón', 25.00, 1, 1),
('Arroz chaufa', 'Arroz frito con pollo y verduras', 15.00, 1, 1),
('Papas fritas', 'Papas doradas al aceite', 5.00, 1, 1);

INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso)
VALUES
(1, 1, 1.00),   -- Pollo a la brasa usa 1 pollo
(1, 3, 0.25),   -- y 0.25 litros de aceite
(2, 2, 0.20),   -- Arroz chaufa usa 0.20 kg de arroz
(2, 1, 0.10),   -- y un poco de pollo
(2, 5, 0.05),   -- y algo de cebolla
(3, 4, 0.30),   -- Papas fritas usa 0.3 kg de papa
(3, 3, 0.10);   -- y 0.1 litros de aceite
