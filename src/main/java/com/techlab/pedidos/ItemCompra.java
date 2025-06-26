package com.techlab.pedidos;

import com.techlab.productos.Producto;
import jakarta.persistence.*;

@Entity
public class ItemCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Producto producto;

    private int cantidad;

    private double precioUnitario;

    @ManyToOne
    @JoinColumn(name = "compra_id")
    private CompraRealizada compra;

    public ItemCompra() {
    }

    public ItemCompra(Producto producto, int cantidad, double precioUnitario, CompraRealizada compra) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.compra = compra;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public CompraRealizada getCompra() {
        return compra;
    }

    public void setCompra(CompraRealizada compra) {
        this.compra = compra;
    }

    public double getSubtotal() {
        return precioUnitario * cantidad;
    }
}

