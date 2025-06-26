
package com.techlab.clientes;

import com.techlab.excepciones.ClienteNoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// ✅ Importaciones para paginación
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Método para buscar un cliente por su DNI
    public Cliente buscarClientePorDni(String dni) throws ClienteNoEncontradoException {
        Optional<Cliente> cliente = clienteRepository.findById(dni);
        if (cliente.isPresent()) {
            return cliente.get();
        } else {
            throw new ClienteNoEncontradoException("Cliente con DNI " + dni + " no encontrado.");
        }
    }

    // Método para agregar un cliente
    public Cliente agregarCliente(Cliente cliente) {
        // ✅ APLICAR FORMATO DE NOMBRE ANTES DE GUARDAR
        if (cliente.getNombre() != null && !cliente.getNombre().trim().isEmpty()) {
            cliente.setNombre(toTitleCase(cliente.getNombre()));
        }
        // Opcional: Podrías añadir lógica para el apellido si tu Cliente lo tuviera
        // if (cliente.getApellido() != null && !cliente.getApellido().trim().isEmpty()) {
        //     cliente.setApellido(toTitleCase(cliente.getApellido()));
        // }
        return clienteRepository.save(cliente);
    }

    // Método para actualizar los datos de un cliente
    public Cliente actualizarCliente(Cliente cliente) throws ClienteNoEncontradoException {
        if (!clienteRepository.existsById(cliente.getDni())) {
            throw new ClienteNoEncontradoException("Cliente con DNI " + cliente.getDni() + " no encontrado.");
        }
        // ✅ APLICAR FORMATO DE NOMBRE ANTES DE ACTUALIZAR
        if (cliente.getNombre() != null && !cliente.getNombre().trim().isEmpty()) {
            cliente.setNombre(toTitleCase(cliente.getNombre()));
        }
        // Opcional: Podrías añadir lógica para el apellido si tu Cliente lo tuviera
        // if (cliente.getApellido() != null && !cliente.getApellido().trim().isEmpty()) {
        //     cliente.setApellido(toTitleCase(cliente.getApellido()));
        // }
        return clienteRepository.save(cliente);
    }

    // Método para listar todos los clientes (se mantiene para compatibilidad si se usa en otros lados sin paginación)
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    // ✅ NUEVO MÉTODO: Listar clientes con paginación
    /**
     * Lista clientes de forma paginada.
     * @param pageable Objeto Pageable que contiene información de la paginación (número de página, tamaño, ordenamiento).
     * @return Un objeto Page que contiene la lista de clientes para la página solicitada,
     * junto con información de paginación (total de elementos, total de páginas, etc.).
     */
    public Page<Cliente> listarClientesPaginados(Pageable pageable) {
        return clienteRepository.findAll(pageable);
    }

    /**
     * Convierte una cadena a formato "Título de Libro" (Title Case).
     * La primera letra de cada palabra se convierte a mayúscula y el resto a minúscula.
     *
     * @param text La cadena a convertir.
     * @return La cadena convertida a Title Case.
     */
    private String toTitleCase(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        StringBuilder converted = new StringBuilder();
        boolean convertNext = true; // Indica si la siguiente letra debe ser mayúscula

        for (char ch : text.toCharArray()) {
            if (Character.isSpaceChar(ch)) { // Si es un espacio, la siguiente letra debe ser mayúscula
                convertNext = true;
            } else if (convertNext) { // Si la bandera es verdadera, convierte a mayúscula
                ch = Character.toUpperCase(ch);
                convertNext = false; // Y desactiva la bandera hasta el próximo espacio
            } else { // Si no es un espacio y la bandera es falsa, convierte a minúscula
                ch = Character.toLowerCase(ch);
            }
            converted.append(ch);
        }
        return converted.toString();
    }
}
