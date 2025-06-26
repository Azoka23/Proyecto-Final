package com.techlab.pedidos;

import com.techlab.productos.Producto;

//representa un detalle del pedido en proceso
public class ItemCarrito {
    private Producto producto;
    private int cantidad;

    public ItemCarrito(Producto producto, int cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }

    public Producto getProducto() {
        return producto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void agregarCantidad(int extra) {
        this.cantidad += extra;
    }

    public double getSubtotal() {
        return producto.calcularPrecioFinal() * cantidad;
    }

    @Override
    public String toString() {
        return "Producto: " + producto.getNombre() +
                "\nCantidad: " + cantidad +
                "\nPrecio unitario: $" + producto.calcularPrecioFinal() +
                "\nSubtotal: $" + getSubtotal() +
                "\n------";
    }
}
