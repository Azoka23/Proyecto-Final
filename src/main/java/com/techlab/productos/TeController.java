package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tes")
public class TeController {

    @Autowired
    private TeRepository teRepository;

    @GetMapping
    public List<Te> getTes() {
        return teRepository.findAll();
    }

    @GetMapping("/{nombre}")
    public Te getTe(@PathVariable String nombre) {
        return teRepository.findByNombre(nombre);
    }

    @PostMapping
    public Te crearTe(@RequestBody Te te) {
        return teRepository.save(te);
    }

    @PutMapping("/{id}")
    public Te actualizarTe(@PathVariable Long id, @RequestBody Te te) {
        te.setId(id);
        return teRepository.save(te);
    }

    @DeleteMapping("/{id}")
    public void eliminarTe(@PathVariable Long id) {
        teRepository.deleteById(id);
    }
}

