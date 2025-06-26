package com.techlab.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Indica a Spring que esta es una clase de configuración
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configuración CORS para toda la aplicación
        registry.addMapping("/**") // Aplica esta configuración CORS a todos los endpoints de tu API (ej. /productos, /cafes, etc.)
                .allowedOrigins("http://localhost:8080") // ✅ MUY IMPORTANTE: Permite solicitudes desde tu propio origen de desarrollo.
                // Si tu frontend se ejecuta en otro puerto (ej. 3000) o dominio,
                // lo añadirías aquí, separado por comas:
                // .allowedOrigins("http://localhost:8080", "http://localhost:3000", "https://tu-dominio-frontend.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Define los métodos HTTP que tu API acepta
                .allowedHeaders("*") // Permite todos los encabezados HTTP en las solicitudes (ej. Content-Type, Authorization)
                .allowCredentials(true) // Permite el envío de credenciales (como cookies, encabezados de autorización)
                // si tu aplicación los usa. Si no, puedes ponerlo en 'false'.
                .maxAge(3600); // Define por cuánto tiempo (en segundos) el navegador puede cachear la respuesta
        // de la solicitud de pre-verificación (OPTIONS). Esto reduce el número de solicitudes.
    }
}

