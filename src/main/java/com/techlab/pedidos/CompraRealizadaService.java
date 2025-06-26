package com.techlab.pedidos;


import com.techlab.clientes.Cliente;
import com.techlab.productos.Producto; // Importa la entidad Producto
import com.techlab.productos.ProductoRepository; // Importa el ProductoRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importa Transactional
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompraRealizadaService {

    @Autowired
    private CompraRealizadaRepository compraRealizadaRepository;

    // ✅ NUEVO: Inyectar ProductoRepository para poder actualizar el stock
    @Autowired
    private ProductoRepository productoRepository;

    // ✅ NUEVO: El método ahora acepta el DTO completo
    @Transactional // ✅ IMPORTANTE: Para asegurar que la compra y el descuento de stock sean atómicos
    public void registrarCompra(CompraRequestDTO request) {
        CompraRealizada compra = new CompraRealizada();
        compra.setCliente(request.getCliente()); // Obtiene el cliente del DTO
        compra.setFecha(LocalDateTime.now());

        // Opcional: Si tu entidad CompraRealizada tiene campos para formaPago y descuento
        // compra.setFormaPago(request.getFormaPago());
        // compra.setDescuentoAplicado(request.getDescuentoAplicado());

        double total = 0;

        for (ItemCarrito itemCarrito : request.getCarrito()) { // Itera sobre el carrito del DTO
            ItemCompra itemCompra = new ItemCompra();

            // ✅ CLAVE: Recuperar el producto de la base de datos para actualizar su stock
            Producto productoEnBD = productoRepository.findById(itemCarrito.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado en BD con ID: " + itemCarrito.getProducto().getId()));

            // ✅ LÓGICA DE DESCUENTO DE STOCK
            if (productoEnBD.getCantidadEnStock() < itemCarrito.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + productoEnBD.getNombre());
            }
            productoEnBD.setCantidadEnStock(productoEnBD.getCantidadEnStock() - itemCarrito.getCantidad());
            productoRepository.save(productoEnBD); // Guardar el producto con el stock actualizado

            itemCompra.setProducto(productoEnBD); // Usar el producto actualizado de la BD
            itemCompra.setCantidad(itemCarrito.getCantidad());
            itemCompra.setPrecioUnitario(itemCarrito.getProducto().getPrecio()); // Usar el precio del producto original
            compra.agregarItem(itemCompra);
            total += (itemCarrito.getProducto().getPrecio() * itemCarrito.getCantidad()); // Calcular total sin descuento aquí
        }

        // Aplicar el descuento al total si es necesario
        // Asumiendo que descuentoAplicado es un porcentaje (ej. 10 para 10%)
        double totalFinalConDescuento = total - (total * (request.getDescuentoAplicado() / 100.0));
        compra.setTotal(totalFinalConDescuento); // El total ya incluye el descuento

        compraRealizadaRepository.save(compra); // Guardar la compra con el total final
    }
}
