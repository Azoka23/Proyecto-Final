package com.techlab.pedidos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // Importar ResponseEntity
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compras")
public class CompraRealizadaController {

    @Autowired
    private CompraRealizadaService compraService;

    @PostMapping("/finalizar")
    // ✅ MODIFICADO: Ahora recibe el CompraRequestDTO completo y devuelve ResponseEntity
    public ResponseEntity<String> finalizarCompra(@RequestBody CompraRequestDTO request) {
        try {
            compraService.registrarCompra(request); // Pasa el DTO completo al servicio
            return new ResponseEntity<>("✅ Compra registrada correctamente y stock actualizado.", HttpStatus.OK);
        } catch (RuntimeException e) {
            // Captura la excepción de stock insuficiente o producto no encontrado
            return new ResponseEntity<>("❌ Error al finalizar la compra: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
