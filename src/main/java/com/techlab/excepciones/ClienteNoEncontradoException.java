package com.techlab.excepciones;

public class ClienteNoEncontradoException extends Exception {
    public ClienteNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
