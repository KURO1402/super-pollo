INSERT INTO insumos (nombreInsumo, stockInsumo, unidadMedida, estadoInsumo) VALUES
-- Carnes y pollos
('Pollo entero', 50.00, 'unidades', 1),
('Pierna de pollo', 100.00, 'unidades', 1),
('Pechuga de pollo', 80.00, 'unidades', 1),
('Alita de pollo', 120.00, 'unidades', 1),

-- Acompañamientos
('Papa blanca', 200.00, 'kg', 1),
('Camote', 50.00, 'kg', 1),
('Arroz', 100.00, 'kg', 1),
('Ensalada fresca', 30.00, 'kg', 1),

-- Aderezos y salsas
('Mayonesa', 20.00, 'litros', 1),
('Ketchup', 15.00, 'litros', 1),
('Salsa de ají', 10.00, 'litros', 1),
('Vinagre', 5.00, 'litros', 1),

-- Bebidas
('Gaseosa Coca Cola', 48.00, 'unidades', 1),
('Gaseosa Inca Kola', 48.00, 'unidades', 1),
('Gaseosa Sprite', 36.00, 'unidades', 1),
('Agua mineral', 24.00, 'unidades', 1),

-- Otros insumos
('Aceite vegetal', 50.00, 'litros', 1),
('Sal', 25.00, 'kg', 1),
('Pimienta', 5.00, 'kg', 1),
('Ajo molido', 8.00, 'kg', 1),
('Carbón', 100.00, 'kg', 1);

INSERT INTO categoriasProducto (nombreCategoria) VALUES
('Pollería'),
('Parrillas'),
('Acompañamientos'),
('Bebidas'),
('Combos Especiales'),
('Extras y Salsas');

INSERT INTO productos (nombreProducto, descripcionProducto, precio, usaInsumos, idCategoria, estadoProducto) VALUES
-- Pollería
('Pollo a la Brasa Entero', 'Pollo entero sazonado con especias especiales y cocido a la brasa', 35.00, 1, 1, 1),
('1/4 de Pollo', 'Cuarto de pollo a la brasa con papas fritas y ensalada', 12.00, 1, 1, 1),
('1/2 Pollo', 'Medio pollo a la brasa con papas fritas y ensalada', 20.00, 1, 1, 1),
('Pollo Broaster', 'Pollo crujiente broaster por piezas', 15.00, 1, 1, 1),

-- Parrillas
('Parrilla Familiar', 'Mixto de carnes para 4 personas con papas y ensalada', 65.00, 1, 2, 1),
('Anticuchos', 'Brochetas de corazón de res con papas y choclo', 18.00, 1, 2, 1),

-- Acompañamientos
('Papas Fritas Familiar', 'Porción grande de papas fritas crujientes', 10.00, 0, 3, 1),
('Ensalada Fresca', 'Ensalada de lechuga, tomate y cebolla', 6.00, 1, 3, 1),
('Arroz Chaufa', 'Arroz frito estilo chaufa con verduras', 8.00, 0, 3, 1),

-- Bebidas
('Gaseosa 500ml', 'Gaseosa personal de 500ml', 4.00, 1, 4, 1),
('Gaseosa 1L', 'Gaseosa familiar de 1 litro', 7.00, 1, 4, 1),
('Agua Mineral 500ml', 'Agua mineral sin gas', 3.00, 1, 4, 1),

-- Combos Especiales
('Combo Familiar', '1 pollo entero + papas familiares + 2 gaseosas 1L', 50.00, 1, 5, 1),
('Combo Personal', '1/4 pollo + papas personales + gaseosa 500ml', 18.00, 1, 5, 1),

-- Extras
('Salsa de Ají', 'Salsa picante tradicional', 1.00, 0, 6, 1),
('Mayonesa Casera', 'Mayonesa artesanal', 1.50, 1, 6, 1);

INSERT INTO cantidadInsumoProducto (idProducto, idInsumo, cantidadUso) VALUES
-- Pollo entero usa 1 pollo entero
(1, 1, 1.00),

-- 1/4 de Pollo usa 0.25 pollos enteros y otros ingredientes
(2, 1, 0.25),
(2, 5, 0.20), -- Papas
(2, 7, 0.10), -- Ensalada

-- Gaseosa 500ml
(10, 13, 1.00), -- 1 unidad de gaseosa

-- Combo Familiar
(14, 1, 1.00), -- 1 pollo entero
(14, 5, 0.60), -- Papas
(14, 13, 2.00); -- 2 gaseosas

INSERT INTO mesas (numeroMesa, capacidad, estadoMesa) VALUES
(1, 4, 'disponible'),
(2, 4, 'disponible'),
(3, 6, 'disponible'),
(4, 6, 'disponible'),
(5, 2, 'disponible'),
(6, 8, 'disponible'),
(7, 4, 'disponible'),
(8, 4, 'disponible');