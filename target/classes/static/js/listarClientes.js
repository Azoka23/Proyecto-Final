// Ubicación: src/main/resources/static/js/listarClientes.js
document.addEventListener("DOMContentLoaded", () => {
    const clientesTablaContainer = document.getElementById("clientes-tabla-container");

    // Función para capitalizar la primera letra de cada palabra
    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    // Función para mostrar mensajes temporales (reemplaza alerts) - Usada para info/error
    function mostrarMensajeTemporal(message, type) {
        const tempMessageDiv = document.createElement('div');
        tempMessageDiv.textContent = message;
        tempMessageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-weight: bold;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            color: white;
        `;

        if (type === "error") {
            tempMessageDiv.style.backgroundColor = 'rgba(220, 53, 69, 0.9)'; // Rojo para error
        } else { // Éxito o información
            tempMessageDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.9)'; // Verde para éxito/info
        }

        document.body.appendChild(tempMessageDiv);

        setTimeout(() => { tempMessageDiv.style.opacity = 1; }, 10);
        setTimeout(() => {
            tempMessageDiv.style.opacity = 0;
            tempMessageDiv.addEventListener('transitionend', () => tempMessageDiv.remove());
        }, 3000);
    }

    // Puedes usar window.alert = (message) => mostrarMensajeTemporal(message, "error"); si lo deseas


    // Función para crear la estructura básica de la tabla (thead y tbody)
    function crearEstructuraTabla(columnas) {
        clientesTablaContainer.innerHTML = ''; // Limpiar resultados anteriores

        const tabla = document.createElement("table");
        tabla.className = "productos-table clientes-list-table";

        const thead = tabla.createTHead();
        const headerRow = thead.insertRow();
        columnas.forEach(col => {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        });

        const tbody = tabla.createTBody();
        clientesTablaContainer.appendChild(tabla);
        return tbody; // Devolver el tbody para llenarlo con datos
    }


    // Función para listar clientes
    async function listarClientes() {
        clientesTablaContainer.innerHTML = '<p class="mensaje-info">Cargando clientes...</p>';

        try {
            const response = await fetch("/clientes");

            console.log(`DEBUG: Solicitud a: /clientes`);
            console.log(`DEBUG: Respuesta recibida - Status: ${response.status}, StatusText: ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("DEBUG: Clientes recibidos:", data);

            // ✅ MODIFICACIÓN: La primera columna ahora se llama "DNI"
            const columnas = ["DNI", "Nombre", "Email"]; // Eliminando ID, usando DNI
            const tbody = crearEstructuraTabla(columnas);

            if (data.length === 0) {
                const filaMensaje = tbody.insertRow();
                const celdaMensaje = filaMensaje.insertCell();
                celdaMensaje.colSpan = columnas.length;
                celdaMensaje.className = "mensaje-info";
                celdaMensaje.textContent = "No se encontraron clientes.";
                return;
            }

            data.forEach(cliente => {
                const fila = tbody.insertRow();
                // ✅ MODIFICACIÓN: Mostrar cliente.dni en la primera columna
                fila.insertCell().textContent = cliente.dni || 'N/A';

                // Combina nombre y apellido en una sola celda 'Nombre'
                const nombreCompleto = (cliente.nombre ? capitalizeWords(cliente.nombre) : '') +
                                     (cliente.apellido ? ' ' + capitalizeWords(cliente.apellido) : '');
                fila.insertCell().textContent = nombreCompleto.trim() || 'N/A';

                fila.insertCell().textContent = cliente.email || 'N/A';
            });

        } catch (error) {
            console.error("Error al listar clientes:", error);
            // Si hay un error, aún creamos la tabla con encabezados y mostramos el mensaje de error
            const columnas = ["DNI", "Nombre", "Email"]; // Actualiza las columnas aquí también para el mensaje de error
            const tbody = crearEstructuraTabla(columnas);
            const filaError = tbody.insertCell(); // Este era un error, debe ser insertRow() y luego insertCell()
            const celdaError = filaError.insertCell();
            celdaError.colSpan = columnas.length;
            celdaError.className = "mensaje-error";
            celdaError.textContent = `Error al cargar los clientes: ${error.message}.`;
        }
    }

    // Llama a la función para listar clientes cuando la página haya cargado
    listarClientes();
});
