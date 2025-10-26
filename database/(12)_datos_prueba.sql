INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida, categoriaInsumo)
VALUES
('Pechuga de Pollo', 50.00, 'kg', 'insumo'),
('Pierna de Pollo', 40.00, 'kg', 'insumo'),
('Aceite Vegetal', 100.00, 'L', 'insumo'),
('Sal', 25.00, 'kg', 'insumo'),
('Papas', 200.00, 'kg', 'insumo'),
('Arroz', 150.00, 'kg', 'insumo'),
('Cebolla', 80.00, 'kg', 'insumo'),
('Ajo', 20.00, 'kg', 'insumo'),
('Pan de Hamburguesa', 300.00, 'unidad', 'insumo'),
('Lechuga', 60.00, 'kg', 'insumo');

INSERT INTO productos (nombreProducto, descripcionProducto, precio, usaInsumos)
VALUES
('Pollo a la Brasa', 'Pollo entero con papas y ensalada', 45.00, 1),
('1/4 de Pollo con Papas', 'Porción de pollo con papas fritas y ensalada', 15.00, 1),
('1/2 Pollo con Papas', 'Media porción de pollo con papas fritas y ensalada', 25.00, 1),
('Hamburguesa de Pollo', 'Hamburguesa con lechuga y salsa especial', 12.00, 1),
('Arroz Chaufa de Pollo', 'Chaufa preparado con pollo y verduras', 18.00, 1),
('Papas Fritas', 'Porción de papas fritas', 6.00, 1),
('Inca Kola 500ml', 'Bebida gaseosa amarilla tradicional peruana', 5.00, 0),
('Coca Cola 500ml', 'Bebida gaseosa cola', 5.00, 0),
('Agua San Luis 600ml', 'Agua sin gas embotellada', 3.00, 0),
('Combo Familiar', 'Pollo entero + papas + ensalada + gaseosa 1.5L', 65.00, 1);

INSERT INTO imagenesProductos (urlImagen, publicID, idProducto)
VALUES
('https://example.com/imagenes/pollo_brasa.jpg', 'pollo_brasa_01', 1),
('https://example.com/imagenes/cuarto_pollo.jpg', 'cuarto_pollo_01', 2),
('https://example.com/imagenes/medio_pollo.jpg', 'medio_pollo_01', 3),
('https://example.com/imagenes/hamburguesa_pollo.jpg', 'hamburguesa_pollo_01', 4),
('https://example.com/imagenes/chaufa_pollo.jpg', 'chaufa_pollo_01', 5),
('https://example.com/imagenes/papas_fritas.jpg', 'papas_fritas_01', 6),
('https://example.com/imagenes/inca_kola.jpg', 'inca_kola_01', 7),
('https://example.com/imagenes/coca_cola.jpg', 'coca_cola_01', 8),
('https://example.com/imagenes/agua_sanluis.jpg', 'agua_sanluis_01', 9),
('https://example.com/imagenes/combo_familiar.jpg', 'combo_familiar_01', 10);

INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso)
VALUES
(1, 1, 1.20),  -- Pollo a la Brasa usa 1.2kg de Pechuga
(1, 5, 0.50),  -- Papas
(1, 4, 0.05),  -- Sal
(2, 2, 0.35),
(2, 5, 0.30),
(2, 4, 0.02),
(3, 2, 0.60),
(3, 5, 0.40),
(3, 4, 0.03),
(4, 9, 1.00),
(4, 1, 0.25),
(4, 10, 0.10),
(5, 6, 0.20),
(5, 1, 0.30),
(5, 7, 0.10),
(6, 5, 0.25),
(6, 4, 0.02),
(10, 1, 1.20),
(10, 5, 0.50),
(10, 4, 0.05);
