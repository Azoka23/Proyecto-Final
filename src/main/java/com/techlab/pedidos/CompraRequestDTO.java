
package com.techlab.pedidos;

import com.techlab.clientes.Cliente;
import java.util.List;

public class CompraRequestDTO {
    private List<ItemCarrito> carrito;
    private Cliente cliente;
    // ✅ NUEVOS CAMPOS: Para la forma de pago y el descuento
    private String formaPago;
    private double descuentoAplicado; // Representa el porcentaje de descuento

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

    // ✅ Getters y Setters para los nuevos campos
    public String getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(String formaPago) {
        this.formaPago = formaPago;
    }

    public double getDescuentoAplicado() {
        return descuentoAplicado;
    }

    public void setDescuentoAplicado(double descuentoAplicado) {
        this.descuentoAplicado = descuentoAplicado;
    }
}
