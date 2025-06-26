package com.techlab.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Mantén este import si otros métodos que no estamos modificando lo usan

import org.springframework.data.domain.Page;    // ¡IMPORTANTE: Nuevo import para paginación!
import org.springframework.data.domain.Pageable; // ¡IMPORTANTE: Nuevo import para paginación!
// import org.springframework.data.domain.Sort; // Puedes eliminar este import si ya no usas Sort directamente en este archivo

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Método para buscar producto por nombre (no se usa para paginación, se mantiene)
    Producto findByNombre(String nombre);

    // Método para buscar producto que contenga xyz
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // ✅ MÉTODO CLAVE PARA PAGINACIÓN POR CATEGORÍA
    // Devuelve un objeto Page<Producto> y acepta un Pageable
    Page<Producto> findByCategoria(String categoria, Pageable pageable); // ¡Esta es la firma correcta para paginación!

    // ✅ MÉTODO PARA PAGINACIÓN DE TODOS LOS PRODUCTOS
    // Este método ya está proporcionado por JpaRepository, no necesitas escribirlo.
    // Simplemente al extender JpaRepository, ya tienes acceso a:
    // Page<Producto> findAll(Pageable pageable);

    // --- Métodos ANTERIORES (comentados o eliminados, ya no son para paginación) ---
    // Estos métodos devuelven List<Producto> (todos los resultados) y solo aplican ordenamiento.
    // Ya no se usarán desde el ProductoService para la funcionalidad de paginación.
    // Puedes comentarlos o eliminarlos si solo vas a usar los métodos paginados.
    // List<Producto> findByCategoria(String categoria);
    // List<Producto> findByCategoria(String categoria, Sort sort);
    // List<Producto> findAll(Sort sort);
}
