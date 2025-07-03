package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.techlab.excepciones.ProductoNoEncontradoException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

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

    // ✅ MÉTODO CORREGIDO: listarProductosPaginados ahora llama a findByCategoriaIgnoreCase
    // Este método es llamado desde ProductoController
    public Page<Producto> listarProductosPaginados(String categoria, Pageable pageable) {
        if (categoria != null && !categoria.isBlank()) {
            // Si se proporciona una categoría, busca productos por categoría con paginación
            // ✅ CAMBIO CLAVE: Usar findByCategoriaIgnoreCase para que no distinga mayúsculas/minúsculas
            return productoRepository.findByCategoriaIgnoreCase(categoria, pageable);
        } else {
            // Si no se proporciona categoría, busca todos los productos con paginación
            return productoRepository.findAll(pageable);
        }
    }

    // Métodos CRUD
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
