☕ Proyecto Final: Sistema de Gestión para Cafeterías
Este repositorio contiene la implementación final de un sistema web integral, diseñado para la gestión eficiente de productos, clientes y el proceso de compra en una cafetería. Desarrollado con Spring Boot, este proyecto fusiona una potente lógica de backend con una interfaz de usuario interactiva y fluida.

✨ Características Destacadas
Este sistema ha sido desarrollado con el objetivo de ofrecer una experiencia completa y optimizada para la administración de un negocio de cafetería, incluyendo las siguientes funcionalidades clave:

📦 Gestión de Productos
Visualización Detallada: Acceso a un listado completo del stock de productos (Café, Té, Accesorios).

Filtrado por Categoría: Permite filtrar productos de manera intuitiva por categorías específicas (Café, Té, Accesorios).

Paginación Eficiente: La visualización de productos está paginada, facilitando la navegación a través de grandes inventarios.

Indicadores de Stock: Alertas visuales para productos con stock bajo, permitiendo una gestión proactiva.

CRUD Completo: Funcionalidades de Crear, Leer, Actualizar y Eliminar productos para un control total del inventario.

👤 Gestión de Clientes
Listado Paginado: Visualización de clientes con paginación para una navegación cómoda.

Búsqueda por DNI: Permite localizar clientes rápidamente utilizando su número de DNI.

Ordenamiento Dinámico: Los listados de clientes pueden ordenarse por DNI, Nombre y Email (ascendente/descendente) con un simple clic en el encabezado de la tabla.

Registro de Clientes: Facilidad para agregar nuevos clientes a la base de datos si no se encuentran registrados.

🛒 Proceso de Compra Avanzado
Formulario Interactivo: Interfaz de compra dinámica que muestra productos con su stock y precios actualizados.

Gestión de Carrito: Funcionalidad para añadir productos al carrito, ajustar cantidades y eliminar ítems de forma flexible.

Sincronización de Stock en Frontend: El stock visible se actualiza en tiempo real en el frontend al agregar productos al carrito y se mantiene descontado incluso al navegar fuera y volver a la página de compra (utilizando localStorage para persistencia del carrito).

Registro de Compra Condicional: La compra se registra y el stock se descuenta permanentemente en la base de datos solo al presionar "Imprimir Factura" en la página de factura. Esto permite al usuario "arrepentirse" de la compra si vuelve desde la factura sin haberla finalizado.

Generación de Factura: Una vez finalizada, se genera una factura detallada para la impresión, con opciones de forma de pago y aplicación de descuentos.

🛠️ Tecnologías Utilizadas
Este proyecto ha sido construido utilizando una combinación de tecnologías modernas para garantizar robustez y escalabilidad:

Backend
Java 21: Lenguaje de programación principal.

Spring Boot 3.x: Framework líder para el desarrollo rápido de aplicaciones Java empresariales.

Spring Data JPA / Hibernate: Para una gestión de persistencia de datos eficiente y abstracta.

MySQL: Base de datos relacional para el almacenamiento persistente de la información.

Maven: Herramienta para la gestión de dependencias y el ciclo de vida del proyecto.

Frontend
HTML5: Estructura semántica de las páginas web.

CSS3: Estilos personalizados, incluyendo un diseño responsivo para adaptarse a diferentes dispositivos, estilos específicos para tablas, paginación y mensajes flotantes.

JavaScript (Vanilla JS): Lógica interactiva del lado del cliente, manipulación del DOM y comunicación con el backend (Fetch API).

Thymeleaf: Motor de plantillas del lado del servidor para la renderización dinámica de las vistas HTML.

Font Awesome: Para íconos escalables y personalizables.

📂 Organización del Código
El proyecto sigue una estructura modular y organizada, facilitando la comprensión y el mantenimiento. Los paquetes principales del backend y los directorios de recursos del frontend están estructurados de la siguiente manera:




⚙️ Configuración y Ejecución
Siga estos pasos para levantar y probar la aplicación en su entorno local:

1. Clonar el Repositorio
   Abra su terminal (o Git Bash) y clone el proyecto usando la URL de su repositorio de GitHub:

git clone https://github.com/Azoka23/Proyecto-Final.git
cd Proyecto-Final

2. Configuración de la Base de Datos (MySQL)
   Este proyecto está configurado para usar MySQL. Necesitará:

Una instancia de MySQL en ejecución (local o remota).

Crear una base de datos específica para este proyecto (ej. cafetienda_db).

Actualizar las credenciales de conexión en el archivo src/main/resources/application.properties (o application.yml):

# Ejemplo de configuración para application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/cafetienda_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=tu_usuario_mysql
spring.datasource.password=tu_contraseña_mysql
spring.jpa.hibernate.ddl-auto=update # o create o create-drop si quieres que Hibernate cree/actualice el esquema
spring.jpa.show-sql=true

Asegúrese de reemplazar localhost:3306, cafetienda_db, tu_usuario_mysql y tu_contraseña_mysql con sus propios datos.

3. Requisitos Previos
   Asegúrese de tener instalados:

Java Development Kit (JDK) 21 o superior.

Maven (o utilice el mvnw wrapper incluido en el proyecto, que es lo recomendado).

4. Construir el Proyecto
   Desde la raíz del directorio del proyecto (Proyecto-Final) en su terminal, ejecute el siguiente comando para limpiar, compilar e instalar las dependencias:

./mvnw clean install -U

Debería ver un mensaje BUILD SUCCESS al finalizar.

5. Ejecutar la Aplicación Spring Boot
   Puede iniciar la aplicación de dos maneras:

Desde su IDE (IntelliJ IDEA, Eclipse, VS Code): Abra el proyecto en su IDE, navegue a la clase principal com.techlab.CafetiendaApplication y ejecute su método main().

Desde la Terminal: (Después de mvnw clean install):

java -jar target/cafetienda-0.0.1-SNAPSHOT.jar

6. Acceder a la Aplicación
   Una vez que la aplicación se inicie (verá mensajes en la consola indicando que Tomcat ha iniciado en el puerto 8080), abra su navegador web y visite:

http://localhost:8080/

🧪 Datos de Prueba y Verificación
Para facilitar las pruebas de la aplicación:

Clientes: Para interactuar con la sección de pedidos, puede utilizar los siguientes DNIs de prueba: 11223344, 22334455, 33445566, 44556677.

Productos: Al filtrar por categoría, utilice Cafe, Te o Accesorio. La aplicación maneja correctamente las mayúsculas/minúsculas en el filtrado. Hay suficientes productos cargados para observar la paginación y los indicadores de stock.

👤 Autora
Marcela Arroyo

📜 Licencia
Este proyecto está bajo la Licencia MIT. Puede encontrar más detalles en el archivo LICENSE.md (si lo añade al repositorio).