package com.techlab.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Método para buscar producto por nombre
    Producto findByNombre(String nombre);

    // Método para buscar producto que contenga xyz
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // ✅ MÉTODO CLAVE: Este método le indica a Spring Data JPA que genere una consulta SQL
    // que no distinga entre mayúsculas y minúsculas para el campo 'categoria'.
    // Ahora devuelve un objeto Page<Producto> y acepta un Pageable.
    Page<Producto> findByCategoriaIgnoreCase(String categoria, Pageable pageable);

    // Método para encontrar productos con stock bajo
    List<Producto> findByCantidadEnStockLessThanEqual(int cantidadEnStock);
}
