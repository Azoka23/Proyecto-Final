package com.techlab.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccesorioRepository extends JpaRepository<Accesorio, Long> {
    Accesorio findByNombre(String nombre);
}

