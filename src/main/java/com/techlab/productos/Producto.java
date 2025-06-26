package com.techlab.productos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
// ✅ Importaciones de Jackson
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonCreator; // Aunque no siempre necesario aquí, es bueno tenerlo


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// ✅ ANOTACIONES CLAVE PARA LA DESERIALIZACIÓN DE CLASES ABSTRACTAS
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME, // Usa el nombre de la subclase como identificador
        include = JsonTypeInfo.As.PROPERTY, // El identificador será una propiedad en el JSON
        property = "categoria" // ✅ La propiedad en el JSON que contendrá el tipo (ej. "Cafe", "Te")
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Cafe.class, name = "Cafe"), // Mapea "Cafe" en el JSON a la clase Cafe
        @JsonSubTypes.Type(value = Te.class, name = "Te"),     // Mapea "Te" en el JSON a la clase Te
        @JsonSubTypes.Type(value = Accesorio.class, name = "Accesorio") // Mapea "Accesorio" en el JSON a la clase Accesorio
})
public abstract class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private double precio;
    private int cantidadEnStock;

    private String categoria; // ✅ Este campo es el "discriminador" que usaremos

    // ✅ Constructor vacío obligatorio.
    // También puedes añadir @JsonCreator al constructor que uses para la deserialización
    // si no es el constructor por defecto. Para clases abstractas es más complejo,
    // por eso JsonTypeInfo es la mejor opción.
    public Producto() {}

    public Producto(String nombre, double precio, int cantidadEnStock) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidadEnStock = cantidadEnStock;
        this.categoria = ""; // o null
    }

    // Constructor incluye categoria
    public Producto(String nombre, double precio, int cantidadEnStock, String categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidadEnStock = cantidadEnStock;
        this.categoria = categoria;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getCantidadEnStock() {
        return cantidadEnStock;
    }

    public void setCantidadEnStock(int cantidadEnStock) {
        this.cantidadEnStock = cantidadEnStock;
    }

    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    // Métodos abstractos para ser implementados por las clases hijas
    public abstract double calcularPrecioFinal();

    public abstract void aplicarDescuento(double porcentaje);
}
