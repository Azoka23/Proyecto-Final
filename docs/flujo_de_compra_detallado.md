Flujo Detallado del Proceso de Compra
Este documento describe el flujo completo del proceso de compra dentro del Sistema de Gestión para Cafeterías, desde la selección de productos por parte del administrador hasta la generación de la factura final. Se enfatiza el control y la flexibilidad que el sistema ofrece al administrador del negocio.

1. Visión General del Flujo
   El proceso de compra está diseñado para ser intuitivo y controlado, permitiendo al administrador gestionar los pedidos de los clientes de manera eficiente y con validaciones en tiempo real.

graph TD
A[Inicio de Venta / Página de Productos] --> B{Administrador selecciona productos};
B --> C{Producto añadido al Carrito (Frontend)};
C --> D[Actualización visual de Stock y Total en Frontend];
D -- (Opcional) --> E{Administrador ajusta cantidades o elimina productos};
E --> D;
C --> F{Stock en Frontend se ajusta (no en DB)};
F --> G[Revisión del Carrito y Selección de Pago/Descuento];
G --> H{Administrador confirma la compra};
H --> I[Llamada al Backend para Finalizar Compra];
I --> J{Backend: Valida Stock y Descuenta de DB};
J -- (Si hay error de stock) --> K[Backend: Retorna error al Frontend];
J -- (Si es exitoso) --> L{Backend: Registra Compra y Items en DB};
L --> M[Backend: Genera Factura];
M --> N[Frontend: Muestra Factura y Limpia Carrito];
K --> O[Frontend: Muestra mensaje de error];

2. Pasos Detallados del Proceso
   2.1. Inicio de una Nueva Venta
   El administrador accede a la interfaz de venta, que muestra el catálogo de productos disponibles.

2.2. Selección y Gestión de Productos en el Carrito
Selección de Productos: El administrador selecciona los productos deseados para la compra.

Añadir al Carrito: Al seleccionar un producto, este se añade a un "carrito de compras" que se gestiona en el frontend (utilizando localStorage).

Actualización de Stock (Frontend): Inmediatamente después de añadir un producto al carrito, el stock mostrado en la interfaz de usuario se ajusta visualmente. Es importante destacar que este ajuste es solo visual en el frontend y no afecta el stock real en la base de datos en este punto.

Flexibilidad del Carrito: El administrador puede:

Aumentar o disminuir la cantidad de un producto en el carrito.

Eliminar productos del carrito.

Cada ajuste en el carrito actualiza el total de la compra en tiempo real en el frontend.

2.3. Revisión y Finalización de la Compra
Revisión del Pedido: Antes de finalizar, el administrador revisa el contenido del carrito, el total y puede seleccionar la forma de pago y aplicar descuentos si corresponde.

Confirmación de Compra: El administrador pulsa el botón para "Finalizar Compra" o "Imprimir Factura".

Llamada al Backend: En este punto, el frontend envía una solicitud al backend con los detalles finales del pedido.

2.4. Procesamiento en el Backend
Validación y Descuento de Stock (Transaccional):

El backend recibe la solicitud de compra.

Se realiza una validación final del stock para cada producto en el carrito contra el inventario real en la base de datos.

Si el stock es suficiente, el backend procede a descontar permanentemente la cantidad de productos del inventario en la base de datos. Esta operación se realiza dentro de una transacción para asegurar la atomicidad (o todo se guarda, o nada).

Si el stock es insuficiente para algún producto, el backend retorna un mensaje de error al frontend, y la transacción de compra se revierte (no se descuenta stock ni se registra la compra).

Registro de la Compra y sus Ítems:

Si la validación de stock es exitosa, la compra se registra en la tabla compra_realizada.

Cada producto del carrito se registra como un item_compra asociado a la compra_realizada, guardando el precio unitario del producto en el momento de la transacción para fines de auditoría.

Generación de Factura: El backend prepara los datos necesarios para la factura, incluyendo el total final, descuentos aplicados y forma de pago.

2.5. Presentación de la Factura y Limpieza del Carrito
Visualización de Factura: El frontend recibe la confirmación exitosa del backend y muestra la factura al administrador.

Limpieza del Carrito: El carrito en localStorage se vacía, preparando el sistema para la siguiente venta.

Manejo de Errores: En caso de un error (ej. stock insuficiente), el frontend muestra un mensaje claro al administrador sin que la compra se finalice.

Volver al README principa