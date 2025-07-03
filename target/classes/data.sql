-- Insertar Clientes de prueba (más de 15 para paginación, nombre y apellido combinados en 'nombre')
INSERT INTO cliente (dni, nombre, email) VALUES ('11223344', 'Ana García', 'ana.garcia@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('22334455', 'Carlos Rodríguez', 'carlos.rodriguez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('33445566', 'Marta López', 'marta.lopez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('44556677', 'Pedro Martínez', 'pedro.martinez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('55667788', 'Laura Fernández', 'laura.fernandez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('66778899', 'Javier González', 'javier.gonzalez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('77889900', 'Sofía Pérez', 'sofia.perez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('88990011', 'Diego Sánchez', 'diego.sanchez@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('99001122', 'Elena Díaz', 'elena.diaz@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('10112233', 'Pablo Ruiz', 'pablo.ruiz@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('11223345', 'Gabriela Castro', 'gabriela.castro@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('12345679', 'Ricardo Soto', 'ricardo.soto@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('13456780', 'Valeria Herrera', 'valeria.herrera@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('14567891', 'Andrés Vargas', 'andres.vargas@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('15678902', 'Florencia Morales', 'florencia.morales@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('16789013', 'Sebastián Guzmán', 'sebastian.guzman@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('17890124', 'Camila Rojas', 'camila.rojas@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('18901235', 'Nicolás Silva', 'nicolas.silva@example.com');
-- ✅ CORRECCIÓN: Estas dos líneas estaban intentando insertar columnas de producto en la tabla cliente
INSERT INTO cliente (dni, nombre, email) VALUES ('19012346', 'Isabel Torres', 'isabel.torres@example.com');
INSERT INTO cliente (dni, nombre, email) VALUES ('20123457', 'Alejandro Núñez', 'alejandro.nunez@example.com');


-- Insertar Productos de prueba (más de 15 de cada tipo para paginación)
-- Asegúrate de que los valores de 'dtype' coincidan con los 'name' en @JsonSubTypes en Producto.java

-- Cafés (más de 15)
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Arábica Clásico', 800.00, 50, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Torrado Premium', 750.00, 40, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Descafeinado Suave', 700.00, 35, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Colombiano Selecto', 900.00, 60, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Leche Cremoso', 850.00, 45, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Crema Especial', 920.00, 38, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Chocolate Intenso', 980.00, 30, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Vainilla Aromático', 890.00, 42, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Helado Refrescante', 780.00, 25, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Caramelo Dulce', 930.00, 33, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe de Origen Etiopía', 1100.00, 20, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe de Origen Brasil', 1050.00, 22, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Orgánico', 990.00, 28, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Gourmet Mezcla', 1200.00, 18, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe en Grano Tostado', 880.00, 30, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe Molido Fino', 870.00, 32, 'Cafe');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Cafe', 'Cafe con Canela Especiado', 910.00, 25, 'Cafe');


-- Tés (más de 15)
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Verde Matcha Ceremonial', 500.00, 30, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Negro Earl Grey Clásico', 450.00, 25, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Frutos Rojos Vibrante', 550.00, 28, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Blanco Pai Mu Tan Delicado', 600.00, 20, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Jazmín Floral', 480.00, 32, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Menta Refrescante', 400.00, 27, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Jengibre Picante', 520.00, 22, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Canela Cálido', 470.00, 29, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Helado de Limón Natural', 510.00, 30, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Arándanos Silvestres', 580.00, 26, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Rooibos Orgánico', 490.00, 35, 'Te');
INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Oolong Premium', 650.00, 15, 'Te');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Hierbas Relajante', 380.00, 40, 'Te');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te Chai Especiado', 530.00, 24, 'Te');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Manzana y Canela', 460.00, 31, 'Te');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Durazno', 500.00, 28, 'Te');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Te', 'Te de Fresa', 540.00, 27, 'Te');


    -- Accesorios (más de 15)
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Taza de Cerámica Artesanal', 1200.00, 15, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Cuchara Medidora de Acero', 300.00, 20, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Prensa Francesa de Vidrio', 2500.00, 10, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Molino de Café Manual Vintage', 1800.00, 12, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Termo para Café de Viaje', 2000.00, 8, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Balanza Digital de Precisión', 24500.00, 20, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Cafetera de Goteo Eléctrica', 3000.00, 7, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Balanza Digital para Café Barista', 42.00, 12, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Jarra de Leche para Latte Art', 950.00, 18, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Tazas de Café Set de 4', 1800.00, 10, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Filtros de Papel para Cafetera', 200.00, 50, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Hervidor de Agua Eléctrico', 1500.00, 15, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Vaso Térmico Reutilizable', 1100.00, 25, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Kit de Limpieza para Cafeteras', 700.00, 30, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Bandeja para Servir Café', 850.00, 14, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Porta Cápsulas de Café', 600.00, 22, 'Accesorio');
    INSERT INTO producto (dtype, nombre, precio, cantidad_en_stock, categoria) VALUES ('Accesorio', 'Espumador de Leche Manual', 400.00, 35, 'Accesorio');
