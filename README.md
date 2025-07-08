# ☕ Sistema de Gestión para Cafeterías - Backend y Frontend Administrativo

Este repositorio contiene la implementación de un **sistema web integral diseñado exclusivamente para la gestión interna de una cafetería**. Su propósito es empoderar al **administrador o dueño del negocio** con herramientas eficientes para la administración de productos, clientes y el control total del proceso de compra. Desarrollado con **Spring Boot**, este proyecto combina una robusta lógica de backend con una interfaz de usuario interactiva (generada con Thymeleaf), **no concebida como una plataforma de compra para usuarios finales en internet**.

## ✨ Puntos Destacados del Proyecto

### 🚀 Funcionalidades Clave para la Administración del Negocio
* **Gestión Completa de Inventario (CRUD):** Control total sobre el catálogo de productos (Café, Té, Accesorios). Permite crear, leer, actualizar y eliminar ítems, con indicadores visuales de stock bajo para una gestión proactiva.
* **Administración de Clientes :** Mantiene un registro detallado de la cartera de clientes, con funcionalidades de búsqueda rápida por DNI y ordenamiento dinámico por múltiples criterios.
* **Proceso de Compra Asistido y Controlado:**
    * **Interfaz de Venta Interactiva:** Permite al administrador construir pedidos de forma dinámica, visualizando stock y precios en tiempo real.
    * **Gestión de Carrito Flexible:** Añade, ajusta cantidades y elimina productos del carrito, con sincronización de stock en el frontend. El estado del carrito se persiste localmente (`localStorage`) para una experiencia fluida.
    * **Movimiento de Stock Inteligente:** El stock se descuenta del inventario **solo en el momento de la confirmación final de la compra** (al "Imprimir Factura"). Esto permite al administrador ajustar el pedido o "arrepentirse" antes de la finalización, garantizando la integridad del inventario.
    * **Generación de Factura Detallada:** Emite facturas completas con desglose de ítems, subtotal, total, y permite la **selección de métodos de pago y aplicación de descuentos**, optimizando el proceso de cierre de venta.

### 💡 Conceptos Técnicos Avanzados
* **Herencia en el Modelo de Datos:** Implementación de herencia en la entidad `Producto` para modelar de forma extensible diferentes categorías (Café, Té, Accesorio), facilitando la gestión polimórfica y la escalabilidad del catálogo.
* **Perfiles de Spring Boot para Entornos Flexibles:** Configuración dinámica de la base de datos (MySQL o H2 en memoria) mediante perfiles de ejecución. Esto permite cambiar entre entornos de desarrollo/pruebas (H2 con carga de datos inicial) y producción (MySQL) con un simple ajuste, sin modificar el código o gestionar múltiples ramas de Git por configuración.
* **Paginación y Ordenamiento Optimizado:** Implementación eficiente de paginación y ordenamiento en el backend (`Spring Data JPA`) para manejar grandes volúmenes de datos sin comprometer el rendimiento.
* **Manejo de Excepciones Personalizadas:** Gestión robusta de errores y validaciones a través de excepciones personalizadas, mejorando la estabilidad y la experiencia de depuración.

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido construido utilizando una combinación de tecnologías modernas para garantizar robustez y escalabilidad:

### Backend
* **Java 21:** Lenguaje de programación principal.
* **Spring Boot 3.x:** Framework líder para el desarrollo rápido de aplicaciones Java empresariales.
* **Spring Data JPA / Hibernate:** Para una gestión de persistencia de datos eficiente y abstracta.
* **MySQL:** Base de datos relacional para el almacenamiento persistente de la información.
* **H2 Database:** Base de datos en memoria para desarrollo y pruebas rápidas.
* **Maven:** Herramienta para la gestión de dependencias y el ciclo de vida del proyecto.

### Frontend
* **HTML5:** Estructura semántica de las páginas web.
* **CSS3:** Estilos personalizados, incluyendo un diseño responsivo para adaptarse a diferentes dispositivos, estilos específicos para tablas, paginación y mensajes flotantes.
* **JavaScript (Vanilla JS):** Lógica interactiva del lado del cliente, manipulación del DOM y comunicación con el backend (Fetch API).
* **Thymeleaf:** Motor de plantillas del lado del servidor para la renderización dinámica de las vistas HTML.
* **Font Awesome:** Para íconos escalables y personalizables.

## 📂 Organización del Código
El proyecto sigue una estructura modular y organizada, facilitando la comprensión y el mantenimiento. Los paquetes principales del backend y los directorios de recursos del frontend están estructurados de la siguiente manera:
```
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/techlab/
│   │   │       ├── CafetiendaApplication.java  # Clase principal de la aplicación
│   │   │       ├── config/                   # Clases de configuración (ej. DataLoader)
│   │   │       ├── clientes/                 # Lógica para la gestión de clientes
│   │   │       ├── productos/                # Lógica para la gestión de productos
│   │   │       ├── pedidos/                  # Lógica para el proceso de compra/pedidos
│   │   │       ├── util/                     # Clases de utilidades generales
│   │   │       ├── view/                     # Clases relacionadas con la vista (ej. DTOs, controladores de vista)
│   │   │       └── excepciones/              # Clases de excepciones personalizadas
│   │   └── resources/
│   │       ├── static/                     # Archivos estáticos (CSS, JS, imágenes)
│   │       │   ├── css/
│   │       │   └── js/
│   │       ├── templates/                  # Plantillas HTML (Thymeleaf)
│   │       ├── application.properties      # Configuración de la aplicación y perfil por defecto
│   │       ├── application-mysql.properties # Configuración específica para MySQL
│   │       ├── application-h2.properties   # Configuración específica para H2
│   │       └── data.sql                    # Script para cargar datos iniciales (para H2)
│   └── test/
│       └── java/
│           └── com/techlab/
│               └── CafetiendaApplicationTests.java # Clases de pruebas
├── pom.xml                                 # Archivo de configuración de Maven
├── README.md                               # Este archivo
└── docs/                                   # Carpeta de documentación adicional
├── arquitectura.md
├── base_de_datos.md
└── flujo_de_compra_detallado.md

```

---

---

## 📚 Documentación Adicional
Para una evaluación más profunda y para mostrar un proyecto aún más profesional, se han creado documentos detallados en la carpeta `docs/`. Puedes acceder a ellos directamente desde aquí:

* **Arquitectura del Sistema:** [Ver arquitectura.md](https://github.com/Azoka23/Proyecto-Final/blob/main/docs/arquitectura.md)
  * Describe los componentes principales, las capas y el flujo de interacción del sistema.
* **Esquema de Base de Datos:** [Ver base_de_datos.md](https://github.com/Azoka23/Proyecto-Final/blob/main/docs/base_de_datos.md)
  * Detalla la estructura de las tablas, sus relaciones y las consideraciones de persistencia.
* **Flujo Detallado del Proceso de Compra:** [Ver flujo_de_compra_detallado.md](https://github.com/Azoka23/Proyecto-Final/blob/main/docs/flujo_de_compra_detallado.md)
  * Explica paso a paso el proceso de venta, desde la selección de productos hasta la generación de la factura.

---

## 🚀 Configuración y Ejecución Local
Siga estos pasos para levantar y probar la aplicación en su entorno local:

### 1. Clonar el Repositorio
Abra su terminal y clone el proyecto:

```bash
git clone [https://github.com/Azoka23/Proyecto-Final.git](https://github.com/Azoka23/Proyecto-Final.git)
cd Proyecto-Final
```
2. Configuración de la Base de Datos
La aplicación utiliza perfiles para la base de datos.

MySQL: Asegúrese de tener una instancia de MySQL en ejecución y una base de datos creada (ej. cafetienda_db). Actualice las credenciales en src/main/resources/application-mysql.properties.

H2 (en memoria): No requiere configuración externa. Los datos de prueba se cargan automáticamente al activar el perfil h2.

3. Requisitos Previos
Java Development Kit (JDK) 21 o superior.

Maven (o utilice el mvnw wrapper incluido).

4. Construir el Proyecto
Desde la raíz del proyecto, ejecute para limpiar, compilar e instalar dependencias:

./mvnw clean install -U

./mvnw clean install -U






👤 Autora
Marcela Alicia Arroyo

📜 Licencia
Este proyecto está bajo la Licencia MIT. Para más detalles, consulte el archivo LICENSE en la raíz del repositorio.