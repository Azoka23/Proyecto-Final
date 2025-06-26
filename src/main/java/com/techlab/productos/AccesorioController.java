package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accesorios")
public class AccesorioController {

    @Autowired
    private AccesorioRepository accesorioRepository;

    @GetMapping
    public List<Accesorio> getAccesorios() {
        return accesorioRepository.findAll();
    }

    @GetMapping("/{nombre}")
    public Accesorio getAccesorio(@PathVariable String nombre) {
        return accesorioRepository.findByNombre(nombre);
    }

    @PostMapping
    public Accesorio crearAccesorio(@RequestBody Accesorio accesorio) {
        return accesorioRepository.save(accesorio);
    }

    @PutMapping("/{id}")
    public Accesorio actualizarAccesorio(@PathVariable Long id, @RequestBody Accesorio accesorio) {
        accesorio.setId(id);
        return accesorioRepository.save(accesorio);
    }

    @DeleteMapping("/{id}")
    public void eliminarAccesorio(@PathVariable Long id) {
        accesorioRepository.deleteById(id);
    }
}

