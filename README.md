Proyecto  Final  :  Cafetienda

Este repositorio contiene el código fuente del proyecto "Cafetienda", una aplicación web para la gestión de productos, clientes y compras, desarrollada con Spring Boot.

🚀 Ramas del Proyecto
El proyecto cuenta con dos ramas principales:

main: Contiene la versión estable y original de la aplicación, configurada para interactuar con una base de datos MySQL (requiere configuración manual de credenciales si se ejecuta localmente).

demo-h2: Esta rama es la versión de demostración y la que debe ser evaluada para la corrección. Incluye la configuración necesaria para utilizar una base de datos H2 en memoria, facilitando su ejecución inmediata sin necesidad de una instalación de MySQL.

🚨 ¡ATENCIÓN ! 🚨 Para la evaluación de la integración con H2 y la funcionalidad de paginación/filtrado/compra sin una base de datos externa, por favor, asegúrese de cambiar a la rama demo-h2 antes de ejecutar el proyecto.

git checkout demo-h2

✨ Características Principales (Rama demo-h2 )
La rama demo-h2 implementa las siguientes funcionalidades clave:

Gestión de Productos:

Visualización de todo el stock de productos (Café, Té, Accesorios).

Filtrado de productos por categoría (Cafe, Te, Accesorio).

Paginación en la lista de productos para una navegación eficiente.

Indicadores visuales de stock bajo.

Funcionalidad de CRUD (Crear, Leer, Actualizar, Eliminar) para productos.

Gestión de Clientes:

Búsqueda de clientes por DNI.

Permite agregar nuevos clientes si no se encuentran en la base de datos.

Proceso de Compra:

Formulario de compra interactivo que lista productos con stock y precios.

Funcionalidad de añadir productos al carrito, ajustar cantidades y eliminar ítems.

Actualización dinámica del stock visual y del total de la compra.

Finalización de la compra con generación de factura (guarda datos de la compra en localStorage).

Base de Datos H2 en Memoria:

Configurada para cargarse automáticamente con datos de prueba (data.sql) al iniciar la aplicación.

No requiere instalación de una base de datos externa.

🛠️ Tecnologías Utilizadas
Backend:

Java 21

Spring Boot 3.x: Framework para el desarrollo de la aplicación.

Spring Data JPA / Hibernate: Para la persistencia de datos.

H2 Database (en memoria): Base de datos ligera para el entorno de demostración.

Maven: Gestor de dependencias del proyecto.

Frontend:

HTML5

CSS3 (con estilos para tablas, paginación, mensajes flotantes, etc.)

JavaScript (Vanilla JS): Para la lógica interactiva del lado del cliente.

Thymeleaf: Motor de plantillas para renderizar las vistas HTML.

⚙️ Configuración y Ejecución (Rama demo-h2)
Siga estos pasos para levantar y probar la aplicación en la rama demo-h2:

Clonar el Repositorio:

git clone https://github.com/[Azoka23]/[cafetienda].git
cd [cafetienda]

Cambiar a la Rama demo-h2:
git checkout demo-h2

Requisitos Previos:

Tener Java Development Kit (JDK) 21 o superior instalado.

Tener Maven instalado (o usar el mvnw wrapper incluido en el proyecto).

Construir el Proyecto:
Abre tu terminal en la raíz del proyecto y ejecuta el siguiente comando:

./mvnw clean install -U

Este comando limpiará, compilará e instalará las dependencias del proyecto. Deberías ver un mensaje BUILD SUCCESS al finalizar.

Ejecutar la Aplicación Spring Boot:
Puedes ejecutar la aplicación desde tu IDE (IntelliJ IDEA, Eclipse, etc.), buscando la clase principal com.techlab.CafetiendaApplication y ejecutando su método main().

Alternativamente, puedes ejecutar desde la terminal (después del mvnw clean install):

java -jar target/cafetienda-0.0.1-SNAPSHOT.jar

Acceder a la Aplicación:
Una vez que la aplicación se inicie (verás un mensaje en la consola como Tomcat started on port 8080), abre tu navegador web y visita:

http://localhost:8080/

Acceder a la Consola H2 (Opcional):
Puedes verificar la base de datos H2 en memoria visitando la consola:

http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:cafetienda_db

User Name: sa

Password: (dejar vacío)

Haz clic en "Connect" y podrás ver las tablas y datos.

🧪 Datos de Prueba y Verificación
Clientes: Para probar la sección de pedidos, puedes usar los siguientes DNIs de prueba: 11223344, 22334455, 33445566, 44556677.

Productos: Al filtrar por categoría, utiliza Cafe, Te o Accesorio (la aplicación debería manejar correctamente las mayúsculas/minúsculas). Hay suficientes productos cargados para observar la paginación.

👤 Autora
[Marcela Arroyo]

[marcela68.ma@gmail.com]

📜 Licencia
Este proyecto está bajo la licencia [Tu Licencia, ej. MIT License] - ver el archivo LICENSE.md para más detalles (si aplicable).
