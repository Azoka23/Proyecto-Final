
package com.techlab.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile; // ✅ Importar @Profile
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * DataLoader se encarga de ejecutar el script data.sql
 * después de que Spring Boot y Hibernate hayan inicializado la base de datos H2.
 * Esto asegura que las tablas existan antes de intentar insertar datos.
 *
 * ✅ La anotación @Profile("h2") asegura que este componente SOLO se active
 * cuando el perfil 'h2' esté activo.
 */
@Component
@Profile("h2") // ✅ Añadir esta anotación para activar solo con el perfil 'h2'
public class DataLoader implements CommandLineRunner {

    private final DataSource dataSource;

    @Autowired
    public DataLoader(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        // La verificación de H2 dentro del método ya no es estrictamente necesaria
        // debido a @Profile("h2"), pero se puede mantener como una doble seguridad.
        // if (dataSource.getConnection().getMetaData().getURL().contains("jdbc:h2:mem:")) {
        try {
            // Carga el script data.sql desde el classpath
            ClassPathResource resource = new ClassPathResource("data.sql");
            if (resource.exists()) {
                // Ejecuta el script SQL
                ScriptUtils.executeSqlScript(dataSource.getConnection(), resource);
                System.out.println("✅ data.sql ejecutado exitosamente en H2 (Perfil 'h2' activo).");
            } else {
                System.out.println("⚠️ data.sql no encontrado en el classpath.");
            }
        } catch (Exception e) {
            System.err.println("❌ Error al ejecutar data.sql: " + e.getMessage());
            // Puedes lanzar la excepción si quieres que la aplicación falle al no cargar los datos
            // throw new RuntimeException("Fallo la carga de datos iniciales.", e);
        }
        // }
    }
}
