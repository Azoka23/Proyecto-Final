package com.techlab.productos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cafes")
public class CafeController {

    @Autowired
    private CafeRepository cafeRepository;

    @GetMapping
    public List<Cafe> getCafes() {
        return cafeRepository.findAll();
    }

    @GetMapping("/{nombre}")
    public Cafe getCafe(@PathVariable String nombre) {
        return cafeRepository.findByNombre(nombre);
    }

    @PostMapping
    public Cafe crearCafe(@RequestBody Cafe cafe) {
        return cafeRepository.save(cafe);
    }

    @PutMapping("/{id}")
    public Cafe actualizarCafe(@PathVariable Long id, @RequestBody Cafe cafe) {
        cafe.setId(id);
        return cafeRepository.save(cafe);
    }

    @DeleteMapping("/{id}")
    public void eliminarCafe(@PathVariable Long id) {
        cafeRepository.deleteById(id);
    }
}
