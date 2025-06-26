package com.techlab.clientes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.techlab.excepciones.ClienteNoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Se mantiene si otros métodos lo usan, pero el principal será Page

// ✅ Importaciones para paginación
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // ✅ MODIFICADO: Ahora este método lista clientes con paginación
    /**
     * Obtiene una lista paginada de clientes.
     * Los parámetros de paginación (page, size, sort) son inyectados automáticamente por Spring.
     * @param pageable Objeto Pageable con la información de la página, tamaño y ordenamiento.
     * @return Un objeto Page que contiene los clientes para la página solicitada.
     */
    @GetMapping
    public Page<Cliente> listarClientesPaginados(Pageable pageable) {
        return clienteService.listarClientesPaginados(pageable);
    }

    // Obtener un cliente por su DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable String dni) {
        try {
            Cliente cliente = clienteService.buscarClientePorDni(dni);
            return new ResponseEntity<>(cliente, HttpStatus.OK);
        } catch (ClienteNoEncontradoException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Crear un nuevo cliente
    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.agregarCliente(cliente);
    }

    // Actualizar los datos de un cliente
    @PutMapping("/{dni}")
    public Cliente actualizarCliente(@PathVariable String dni, @RequestBody Cliente cliente) throws ClienteNoEncontradoException {
        cliente.setDni(dni);
        return clienteService.actualizarCliente(cliente);
    }
}
