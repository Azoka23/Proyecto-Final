Esquema de Base de Datos del Sistema de Gestión para Cafeterías
Este documento detalla el esquema de la base de datos utilizado por el Sistema de Gestión para Cafeterías. Se describe la estructura de las tablas, sus relaciones y las consideraciones clave en el diseño de la persistencia de datos.

1. Visión General del Esquema
   El diseño de la base de datos se centra en la eficiencia y la integridad de los datos para la gestión de productos, clientes y el registro de compras. Se utiliza un enfoque relacional, mapeado a entidades Java mediante Spring Data JPA y Hibernate.

erDiagram
cliente ||--o{ compra_realizada : "realiza"
producto ||--o{ item_compra : "contiene"
compra_realizada ||--o{ item_compra : "incluye"

    cliente {
        VARCHAR dni PK "DNI del cliente (clave primaria)"
        VARCHAR nombre "Nombre completo del cliente"
        VARCHAR email
    }

    producto {
        BIGINT id PK "Identificador único (auto-incremento)"
        VARCHAR dtype "Tipo de producto (CAFETERIA, TE, ACCESORIO)"
        VARCHAR nombre
        VARCHAR categoria
        DOUBLE precio
        INT cantidad_en_stock
    }

    compra_realizada {
        BIGINT id PK "Identificador único (auto-incremento)"
        VARCHAR cliente_dni FK "DNI del cliente que realizó la compra"
        DATETIME fecha
        DOUBLE total
        LONGTEXT detalle "Detalle de la compra (ej. JSON de ítems)"
    }

    item_compra {
        BIGINT id PK "Identificador único (auto-incremento)"
        BIGINT compra_id FK
        BIGINT producto_id FK
        INT cantidad
        DOUBLE precio_unitario "Precio del producto en el momento de la compra"
    }

2. Descripción de Tablas y Entidades
   cliente
   Almacena la información de los clientes del negocio.

dni: VARCHAR(255). Número de DNI del cliente. Actúa como clave primaria (PK).

nombre: VARCHAR(255). Nombre completo del cliente. Puede ser nulo.

email: VARCHAR(255). Correo electrónico del cliente. Puede ser nulo.

producto
Almacena la información de los productos disponibles en la cafetería. Esta tabla utiliza un enfoque de herencia (dtype - Discriminator Column) para diferenciar entre tipos de productos.

id: BIGINT(20). Identificador único del producto. Clave primaria (PK) y auto-incremental.

dtype: VARCHAR(31). Columna discriminadora que indica el tipo de producto (ej. 'CAFETERIA', 'TE', 'ACCESORIO'). No nulo.

nombre: VARCHAR(255). Nombre del producto. Puede ser nulo.

categoria: VARCHAR(255). Categoría del producto. Puede ser nulo.

precio: DOUBLE. Precio de venta del producto. No nulo.

cantidad_en_stock: INT(11). Cantidad disponible del producto en inventario. No nulo.

compra_realizada
Registra cada transacción de compra.

id: BIGINT(20). Identificador único de la compra. Clave primaria (PK) y auto-incremental.

cliente_dni: VARCHAR(255). Clave foránea que referencia al DNI del cliente que realizó la compra. Puede ser nulo (si la compra no está asociada a un cliente registrado).

fecha: DATETIME(6). Fecha y hora exacta en que se realizó la compra. Puede ser nulo.

total: DOUBLE. Monto total final de la compra. No nulo.

detalle: LONGTEXT. Campo para almacenar detalles adicionales de la compra, posiblemente un JSON con información de ítems o descuentos aplicados. Puede ser nulo.

item_compra
Representa cada línea de una compra, detallando los productos y sus cantidades.

id: BIGINT(20). Identificador único del ítem de compra. Clave primaria (PK) y auto-incremental.

cantidad: INT(11). Cantidad de este producto en el ítem de compra. No nulo.

precio_unitario: DOUBLE. Precio del producto en el momento exacto de la compra. No nulo.

compra_id: BIGINT(20). Clave foránea que referencia a la compra a la que pertenece este ítem. Puede ser nulo.

producto_id: BIGINT(20). Clave foránea que referencia al producto específico de este ítem. Puede ser nulo.

3. Relaciones Clave
   cliente 1 -- N compra_realizada: Un cliente puede realizar múltiples compras, pero cada compra está asociada a un único cliente (referenciado por su DNI).

compra_realizada 1 -- N item_compra: Una compra puede contener múltiples ítems de compra, pero cada ítem pertenece a una única compra.

producto 1 -- N item_compra: Un producto puede aparecer en múltiples ítems de compra (en diferentes compras), pero cada ítem de compra se refiere a un único producto.

4. Consideraciones de Persistencia y Perfiles de Base de Datos
   Spring Data JPA: Simplifica enormemente la implementación de la capa de persistencia, generando automáticamente gran parte del código boilerplate para las operaciones CRUD.

Herencia JPA (@Inheritance): La entidad Producto utiliza herencia para manejar diferentes tipos de productos de manera polimórfica, lo que permite un modelo de datos más limpio y extensible.

Gestión por Perfiles de Spring Boot: El proyecto está configurado para trabajar con diferentes bases de datos según el perfil activo, lo que proporciona flexibilidad para distintos entornos:

Perfil mysql: Utiliza MySQL como base de datos persistente. Ideal para entornos de producción o desarrollo con datos duraderos.

Perfil h2: Utiliza H2 Database (en memoria). Los datos iniciales se cargan automáticamente desde data.sql y el DataLoader al iniciar la aplicación, facilitando el desarrollo y las pruebas rápidas sin configuración externa.

Volver al README principal