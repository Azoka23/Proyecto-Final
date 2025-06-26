package com.techlab.pedidos;
import java.util.List;
import java.util.ArrayList;

import com.techlab.clientes.Cliente;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class CompraRealizada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;

    private double total;

    @Lob
    private String detalle;

    private LocalDateTime fecha;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL)
    private List<ItemCompra> items = new ArrayList<>();

    // Constructor vacío (necesario para JPA)
    public CompraRealizada() {
    }

    public void agregarItem(ItemCompra item) {
        items.add(item);
        item.setCompra(this); // Relación bidireccional
    }


    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}

