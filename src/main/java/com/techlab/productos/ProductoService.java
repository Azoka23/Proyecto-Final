package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.techlab.excepciones.ProductoNoEncontradoException;
import org.springframework.data.domain.Page; // ¡Nuevo import necesario!
import org.springframework.data.domain.Pageable; // ¡Nuevo import necesario!
// import org.springframework.data.domain.Sort; // Este import ya no es necesario si Sort se gestiona con Pageable
import java.util.List; // Este import es para los otros métodos que devuelven List

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    // Inyección de dependencias mediante el constructor
    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Método para buscar producto por nombre
    public Producto buscarProductoPorNombre(String nombre) {
        return productoRepository.findByNombre(nombre);
    }

    // ✅ NUEVO MÉTODO: listarProductosPaginados para la paginación
    // Este método es llamado desde ProductoController
    public Page<Producto> listarProductosPaginados(String categoria, Pageable pageable) {
        if (categoria != null && !categoria.isBlank()) {
            // Si se proporciona una categoría, busca productos por categoría con paginación
            return productoRepository.findByCategoria(categoria, pageable);
        } else {
            // Si no se proporciona categoría, busca todos los productos con paginación
            return productoRepository.findAll(pageable);
        }
    }

    // Métodos CRUD (el método listarProductos original ya no se usa directamente para la paginación)
    // Puedes mantener el método 'listarProductos' si aún tienes otras partes de tu aplicación
    // que lo llaman para obtener una lista sin paginar, pero para la paginación usaremos el nuevo.
    // public List<Producto> listarProductos(String sortBy, String order, String categoria) { /* ... */ }


    public void agregarProducto(Producto producto) {
        productoRepository.save(producto); // Guarda el producto en la base de datos
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id); // Elimina el producto por id
    }

    public void editarProducto(Long id, String nuevoNombre, Double nuevoPrecio, Integer nuevoStock) {
        Producto producto = productoRepository.findById(id).orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado"));
        if (nuevoNombre != null && !nuevoNombre.isBlank()) {
            producto.setNombre(nuevoNombre);
        }
        if (nuevoPrecio != null && nuevoPrecio >= 0) {
            producto.setPrecio(nuevoPrecio);
        }
        if (nuevoStock != null && nuevoStock >= 0) {
            producto.setCantidadEnStock(nuevoStock);
        }

        productoRepository.save(producto); // Guarda las modificaciones
    }
}
