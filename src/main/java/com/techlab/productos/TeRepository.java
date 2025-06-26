package com.techlab.productos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeRepository extends JpaRepository<Te, Long> {
    Te findByNombre(String nombre);
}
