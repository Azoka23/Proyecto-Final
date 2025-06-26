package com.techlab.clientes;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

/**
 * Representa un cliente con nombre, email y DNI.
 * Incluye validación básica de email.
 */
@Entity
public class Cliente {

    @Id
    private String dni;  // Cambié esto para que el DNI sea la clave primaria.

    private String nombre;

    private String email;

    // ✅ Constructor vacío requerido por JPA
    public Cliente() {
    }

    // Constructor
    public Cliente(String dni, String nombre, String email) {
        this.dni = dni;
        this.nombre = nombre;
        setEmail(email); // Usa el setter para aprovechar la validación
    }

    // Getters y Setters
    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email.contains("@")) {
            this.email = email;
        } else {
            System.out.println("Email inválido.");
        }
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "DNI='" + dni + '\'' +
                ", Nombre='" + nombre + '\'' +
                ", Email='" + email + '\'' +
                '}';
    }
}
