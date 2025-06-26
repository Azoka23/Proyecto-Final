package com.techlab.clientes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.techlab.excepciones.ClienteNoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Obtener todos los clientes
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

    // Obtener un cliente por su DNI
    //@GetMapping("/{dni}")
    //public Cliente obtenerCliente(@PathVariable String dni) throws ClienteNoEncontradoException {
      //  return clienteService.buscarClientePorDni(dni);
    //}

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

