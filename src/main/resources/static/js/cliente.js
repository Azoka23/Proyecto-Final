document.addEventListener("DOMContentLoaded", function () {
    const respuestaDiv = document.getElementById("respuesta");
    const formularioRegistroDiv = document.getElementById("formulario-registro");
    const clienteForm = document.getElementById("clienteForm");
    const dniRegistroInput = document.getElementById("dni-registro");

    function buscarCliente() {
        const dni = document.getElementById("dni").value.trim();
        if (dni) {
            fetch(`/clientes/${dni}`) // Ajusta la URL de tu backend
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 404) {
                        respuestaDiv.textContent = "Cliente no encontrado. ¿Desea registrarse?";
                        formularioRegistroDiv.style.display = "block";
                        dniRegistroInput.value = dni; // Prellenar el DNI en el formulario
                        throw new Error("Cliente no encontrado");
                    } else {
                        throw new Error(`Error al buscar cliente: ${response.status}`);
                    }
                })
                .then(data => {
                    console.log("Cliente encontrado:", data);
                    // Redirigir a compra.html pasando el ID del cliente
                    window.location.href = `/compra.html?clienteId=${data.dni}`; // Ruta ajustada
                })
                .catch(error => {
                    console.error(error);
                    if (error.message !== "Cliente no encontrado") {
                        respuestaDiv.textContent = error.message;
                    }
                });
        } else {
            alert("Por favor, ingresa un DNI.");
        }
    }

    function mostrarFormularioRegistro() {
        formularioRegistroDiv.style.display = "block";
    }

    if (clienteForm) {
        clienteForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const dni = dniRegistroInput.value.trim();
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();

            if (!dni || !nombre || !email) {
                alert("Por favor, complete todos los campos del registro.");
                return;
            }

            fetch('/clientes', { // Ajusta la URL de tu backend para registrar clientes
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dni, nombre, email }),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Error al registrar cliente: ${response.status}`);
                }
            })
            .then(data => {
                console.log("Cliente registrado exitosamente:", data);
                alert("Cliente registrado exitosamente.");
                window.location.href = `/compra.html?clienteId=${data.dni}`; // Ruta ajustada
            })
            .catch(error => {
                console.error(error);
                respuestaDiv.textContent = error.message;
            });
        });
    }

    // Lógica para el botón Volver
    const botonVolver = document.querySelector('.boton-volver');
    if (botonVolver) {
        botonVolver.addEventListener('click', function() {
            window.location.href = '/'; // Ruta ajustada
        });
    }

    // Exponemos las funciones al scope global para que el onclick del HTML funcione
    window.buscarCliente = buscarCliente;
    window.mostrarFormularioRegistro = mostrarFormularioRegistro;
});