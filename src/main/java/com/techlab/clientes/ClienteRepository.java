package com.techlab.clientes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, String> {
    // No es necesario escribir métodos adicionales, JpaRepository ya proporciona todos los CRUD básicos
}

