package com.techlab.pedidos;

import java.util.List;
import java.util.ArrayList;

public class Carrito {
    private List<ItemCarrito> items;

    public Carrito() {
        this.items = new ArrayList<>();
    }
    public Carrito(List<ItemCarrito> items) {
        this.items = items;
    }

    public List<ItemCarrito> getItems() {
        return items;
    }

    public void setItems(List<ItemCarrito> items) {
        this.items = items;
    }

    // Otros métodos (agregarProducto, mostrarProductos, etc.)
}
