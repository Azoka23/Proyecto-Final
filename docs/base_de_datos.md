# Esquema de Base de Datos del Sistema de Gestión para Cafeterías
Este documento describe el esquema de la base de datos del Sistema de Gestión para Cafeterías, detallando la estructura de sus tablas y las relaciones clave.

---

## 1. Diagrama de Entidad-Relación (ERD)
El siguiente diagrama muestra las entidades principales y cómo se relacionan en la base de datos:

```mermaid
erDiagram
    cliente ||--o{ compra_realizada : "realiza"
    producto ||--o{ item_compra : "contiene"
    compra_realizada ||--o{ item_compra : "incluye"

    cliente {
        VARCHAR dni PK "DNI del cliente"
        VARCHAR nombre "Nombre del cliente"
        VARCHAR email "Email del cliente"
    }

    producto {
        BIGINT id PK "ID único del producto"
        VARCHAR dtype "Tipo de producto (CAFETERIA, TE, ACCESORIO)"
        VARCHAR nombre "Nombre del producto"
        VARCHAR categoria "Categoría"
        DOUBLE precio "Precio de venta"
        INT cantidad_en_stock "Stock disponible"
    }

    compra_realizada {
        BIGINT id PK "ID único de la compra"
        VARCHAR cliente_dni FK "DNI del cliente (FK)"
        DATETIME fecha "Fecha y hora de la compra"
        DOUBLE total "Monto total"
        LONGTEXT detalle "Detalle adicional de la compra"
    }

    item_compra {
        BIGINT id PK "ID único del ítem de compra"
        BIGINT compra_id FK "ID de la compra (FK)"
        BIGINT producto_id FK "ID del producto (FK)"
        INT cantidad "Cantidad del producto"
        DOUBLE precio_unitario "Precio unitario al momento de la compra"
    }
2. Descripción de Tablas Principales
cliente
Almacena la información de los clientes.

dni (PK): Identificador único del cliente.

nombre: Nombre completo del cliente.

email: Correo electrónico del cliente.

producto
Almacena los productos disponibles, con un campo dtype para diferenciar entre tipos de productos (café, té, accesorios).

id (PK): Identificador único del producto.

dtype: Discriminador para tipo de producto.

nombre: Nombre del producto.

categoria: Categoría del producto.

precio: Precio de venta.

cantidad_en_stock: Cantidad disponible en inventario.

compra_realizada
Registra cada transacción de compra.

id (PK): Identificador único de la compra.

cliente_dni (FK): DNI del cliente asociado a la compra.

fecha: Fecha y hora de la compra.

total: Monto total de la compra.

detalle: Información adicional de la compra (ej. formato JSON).

item_compra
Representa cada línea de una compra, detallando los productos y sus cantidades.

id (PK): Identificador único del ítem.

compra_id (FK): ID de la compra a la que pertenece.

producto_id (FK): ID del producto específico.

cantidad: Cantidad de este producto en el ítem.

precio_unitario: Precio del producto al momento de la compra.
```
3. Relaciones Clave
Cliente - Compra: Un cliente puede realizar múltiples compras (1:N).

Compra - Ítem de Compra: Una compra puede incluir múltiples ítems (1:N).

Producto - Ítem de Compra: Un producto puede aparecer en múltiples ítems de compra (1:N).

[Volver al README principal.](../README.md)


---