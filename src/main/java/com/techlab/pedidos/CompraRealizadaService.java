package com.techlab.pedidos;

import com.techlab.clientes.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompraRealizadaService {

    @Autowired
    private CompraRealizadaRepository compraRealizadaRepository;

    public void registrarCompra(List<ItemCarrito> carritoItems, Cliente cliente) {
        CompraRealizada compra = new CompraRealizada();
        compra.setCliente(cliente);
        compra.setFecha(LocalDateTime.now());
        double total = 0;

        for (ItemCarrito itemCarrito : carritoItems) {
            ItemCompra itemCompra = new ItemCompra();
            itemCompra.setProducto(itemCarrito.getProducto());
            itemCompra.setCantidad(itemCarrito.getCantidad());
            itemCompra.setPrecioUnitario(itemCarrito.getSubtotal() / itemCarrito.getCantidad());
            compra.agregarItem(itemCompra);
            total += itemCompra.getSubtotal();
        }
        compra.setTotal(total);
        compraRealizadaRepository.save(compra);
    }
}
