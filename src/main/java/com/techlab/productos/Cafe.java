package com.techlab.productos;

import jakarta.persistence.Entity;

@Entity
public class Cafe extends Producto {

    //public Cafe() {} // o Te / Accesorio


    //public Cafe(String nombre, double precio, int cantidadEnStock) {
       // super(nombre, precio, cantidadEnStock);  // Llama al constructor de Producto
   // }

    public Cafe() {
        super();
        this.setCategoria("cafe"); // ✅ Establece la categoría
    }

    public Cafe(String nombre, double precio, int cantidadEnStock) {
        super(nombre, precio, cantidadEnStock);
        this.setCategoria("cafe"); // ✅ Establece la categoría
    }
    @Override
    public double calcularPrecioFinal() {
        return getPrecio() * 1.21;  // Aplica un IVA del 21%
    }

    @Override
    public void aplicarDescuento(double porcentaje) {
        double nuevoPrecio = getPrecio() - (getPrecio() * porcentaje / 100);
        setPrecio(nuevoPrecio);  // Aplica el descuento modificando el precio base
    }

    @Override
    public String toString() {
        return "Cafe{nombre='" + getNombre() +
                "', precio base=$" + String.format("%.2f", getPrecio()) +
                ", stock=" + getCantidadEnStock() +
                ", precio final con IVA=$" + String.format("%.2f", calcularPrecioFinal()) + "}";
    }
}
