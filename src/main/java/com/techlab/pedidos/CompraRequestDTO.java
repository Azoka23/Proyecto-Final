
package com.techlab.pedidos;

import com.techlab.clientes.Cliente;
import java.util.List; // Importa List

public class CompraRequestDTO {
    private List<ItemCarrito> carrito; // Cambiado a List<ItemCarrito>
    private Cliente cliente;

    // Getters y Setters
    public List<ItemCarrito> getCarrito() {
        return carrito;
    }

    public void setCarrito(List<ItemCarrito> carrito) {
        this.carrito = carrito;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
