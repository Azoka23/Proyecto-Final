package com.techlab.pedidos;

import com.techlab.clientes.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compras")
public class CompraRealizadaController {

    @Autowired
    private CompraRealizadaService compraService;

    @PostMapping("/finalizar")
    public String finalizarCompra(@RequestBody CompraRequestDTO request) {
        compraService.registrarCompra(request.getCarrito(), request.getCliente());
        return "✅ Compra registrada correctamente.";
    }
}

