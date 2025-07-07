Arquitectura del Sistema de Gestión para Cafeterías
Este documento describe la arquitectura de alto nivel del Sistema de Gestión para Cafeterías, destacando sus componentes principales y el flujo de interacción. El diseño se enfoca en la modularidad, la escalabilidad y la facilidad de mantenimiento, siguiendo las mejores prácticas de desarrollo con Spring Boot.

1. Visión General de la Arquitectura
   El sistema sigue un modelo clásico de arquitectura de tres capas (o n-capas), donde el frontend y el backend están estrechamente integrados a través de un motor de plantillas del lado del servidor (Thymeleaf), y el backend interactúa con una capa de persistencia de datos.

graph TD
A[Navegador Web del Administrador] -->|Solicitudes HTTP| B(Capa de Presentación - Frontend Thymeleaf/JS)
B -->|Llamadas a Endpoints REST/HTML| C(Capa de Lógica de Negocio - Backend Spring Boot)
C -->|Operaciones JPA/Hibernate| D(Capa de Persistencia - Spring Data JPA)
D -->|Consultas SQL| E[Base de Datos - MySQL / H2]

2. Componentes Clave del Backend (Spring Boot)
   El backend está construido sobre el framework Spring Boot, organizando la lógica en capas bien definidas:

Controladores (@Controller / @RequestMapping):

Actúan como el punto de entrada para las solicitudes HTTP provenientes del frontend.

Gestionan el enrutamiento de las URLs y la preparación de los modelos de datos para las vistas de Thymeleaf.

Delegación de la lógica de negocio a la capa de servicios.

Servicios (@Service):

Contienen la lógica de negocio principal del sistema (ej. cálculo de descuentos, validación de stock, gestión de transacciones).

Orquestan las operaciones entre múltiples repositorios si es necesario.

Aseguran la coherencia y la integridad de los datos.

Repositorios (@Repository / Spring Data JPA):

Proporcionan una abstracción sobre la capa de persistencia de datos.

Definen interfaces para las operaciones CRUD y consultas personalizadas sobre las entidades de la base de datos.

Spring Data JPA genera automáticamente las implementaciones en tiempo de ejecución.

Modelos/Entidades (@Entity):

Representan las estructuras de datos del dominio del negocio (ej. Producto, Cliente, Pedido).

Mapeados a tablas en la base de datos mediante JPA/Hibernate.

Implementan herencia para modelar diferentes tipos de productos de manera extensible.

Configuración (@Configuration):

Clases para la configuración de la aplicación (ej. DataLoader para la carga inicial de datos, configuración de perfiles).

3. Interacción Frontend (Thymeleaf y JavaScript)
   El frontend se construye utilizando:

Thymeleaf: Un motor de plantillas del lado del servidor que permite renderizar dinámicamente las vistas HTML, inyectando datos del backend.

JavaScript (Vanilla JS): Se utiliza para añadir interactividad en el lado del cliente (ej. gestión del carrito en localStorage, actualización de stock en tiempo real en la interfaz de compra).

CSS3: Para el estilizado y el diseño responsivo de la interfaz de usuario.

4. Persistencia de Datos
   La capa de persistencia se gestiona a través de Spring Data JPA e Hibernate, permitiendo una interacción robusta con la base de datos.

Base de Datos Relacional:

MySQL: Utilizado para entornos de producción, garantizando la persistencia y durabilidad de los datos.

H2 Database (en memoria): Empleado para entornos de desarrollo y pruebas rápidas, con carga automática de datos iniciales para una puesta en marcha instantánea.

Perfiles de Spring Boot: La configuración de la base de datos se gestiona mediante perfiles (application-mysql.properties, application-h2.properties), lo que permite una flexibilidad total para cambiar el entorno de ejecución sin modificar el código.

5. Patrones de Diseño y Buenas Prácticas
   Arquitectura en Capas: Separa claramente las responsabilidades, mejorando la modularidad y la mantenibilidad.

Patrón DTO (Data Transfer Object): Utilizado para transferir datos entre las capas, desacoplando el modelo de dominio de la capa de presentación.

Inyección de Dependencias: Gestionada por Spring, facilita la construcción de componentes desacoplados y probables.

Manejo de Excepciones Centralizado: Mejora la robustez y la experiencia de usuario al gestionar errores de forma consistente.

Herencia JPA: Aplicada en el modelo Producto para una estructura de datos más organizada y extensible.

Volver al README principal