// src/main/java/com/techlab/productos/ProductoController.java
package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; // ¡Nuevo import necesario!
import org.springframework.data.domain.Pageable; // ¡Nuevo import necesario!
import org.springframework.http.ResponseEntity; // ¡Nuevo import necesario para devolver una respuesta con metadatos!
import org.springframework.web.bind.annotation.*;

import java.util.List; // Este import podría no ser necesario si todos los métodos devuelven Page o ResponseEntity

@RestController
@RequestMapping("/productos")
// ✅ OPCIONAL: Puedes añadir @CrossOrigin aquí si no lo tienes globalmente en WebConfig
// @CrossOrigin(origins = "http://localhost:8080")
public class ProductoController {

    @Autowired
    private ProductoService productoService;
    @Autowired
    private ProductoRepository productoRepository;

    // ✅ MÉTODO MODIFICADO PARA PAGINACIÓN Y ORDENAMIENTO VIA PAGEABLE
    @GetMapping // Este endpoint maneja /productos
    public ResponseEntity<Page<Producto>> getProductos( // ✅ Cambio de List<Producto> a ResponseEntity<Page<Producto>>
                                                        @RequestParam(required = false) String categoria,
                                                        Pageable pageable) { // ✅ Nuevo parámetro clave: Pageable

        Page<Producto> productosPage;

        if (categoria != null && !categoria.isEmpty()) {
            // Si hay categoría, el servicio buscará por categoría y aplicará la paginación/ordenamiento del Pageable
            productosPage = productoService.listarProductosPaginados(categoria, pageable);
        } else {
            // Si no hay categoría, el servicio listará todos los productos aplicando la paginación/ordenamiento del Pageable
            productosPage = productoService.listarProductosPaginados(null, pageable); // Pasamos null para que el servicio sepa que no hay filtro de categoría
        }

        return ResponseEntity.ok(productosPage); // ✅ Devolvemos la página de productos con metadatos
    }

    @GetMapping("/{nombre}") // Este endpoint para buscar por nombre NO NECESITA PAGINACIÓN
    public Producto getProducto(@PathVariable String nombre) {
        return productoService.buscarProductoPorNombre(nombre);
    }

    @GetMapping("/buscar")
    public List<Producto> buscarProductosPorNombreParcial(@RequestParam String nombre) {
        // ✅ CORRECCIÓN: Llama al método desde la INSTANCIA inyectada del repositorio
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        productoService.agregarProducto(producto);
        return producto;
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        productoService.editarProducto(id, producto.getNombre(), producto.getPrecio(), producto.getCantidadEnStock());
        return productoService.buscarProductoPorNombre(producto.getNombre());
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }
}