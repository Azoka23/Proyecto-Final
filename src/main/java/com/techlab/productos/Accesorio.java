package com.techlab.productos;

import jakarta.persistence.Entity;

@Entity
public class Accesorio extends Producto {

    //public Accesorio() {} // o Te


   // public Accesorio(String nombre, double precio, int cantidadEnStock) {
      //  super(nombre, precio, cantidadEnStock);  // Llama al constructor de Producto
    //}
   public Accesorio() {
       super(); // Llama al constructor vacío de Producto
       this.setCategoria("accesorio"); // ✅ Establece la categoría correcta
   }

    public Accesorio(String nombre, double precio, int cantidadEnStock) {
        super(nombre, precio, cantidadEnStock); // Llama al constructor de Producto que inicializa categoria a ""
        this.setCategoria("accesorio"); // ✅ ¡MUY IMPORTANTE! Sobrescribe la categoría a "accesorio"
    }

    @Override
    public double calcularPrecioFinal() {
        return getPrecio();  // Usa el precio de Producto
    }

    @Override
    public void aplicarDescuento(double porcentaje) {
        double nuevoPrecio = getPrecio() - (getPrecio() * porcentaje / 100);
        setPrecio(nuevoPrecio);  // Aplica el descuento modificando el precio base
    }

    @Override
    public String toString() {
        return "Accesorio{nombre='" + getNombre() +
                "', precio=$" + String.format("%.2f", getPrecio()) +
                ", stock=" + getCantidadEnStock() + "}";
    }
}
