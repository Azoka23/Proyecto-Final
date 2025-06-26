document.addEventListener("DOMContentLoaded", () => {
    const botonesConsulta = document.querySelectorAll(".controles-consulta .boton");
    const filtroDniInput = document.getElementById("filtroDni");
    const resultadosTablaContainer = document.getElementById("resultadosTablaContainer");
    const resultadosTitulo = document.getElementById("resultadosTitulo");

    // Función para capitalizar la primera letra de cada palabra
    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    // Función para mostrar mensajes temporales (reemplaza alerts)
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

    window.alert = (message) => mostrarMensajeTemporal(message, "error");


    // Función para crear la estructura básica de la tabla (thead y tbody)
    function crearEstructuraTabla(columnas) {
        resultadosTablaContainer.innerHTML = ''; // Limpiar resultados anteriores

        const tabla = document.createElement("table");
        // Clase 'consulta-table' para anchos de columna específicos en estilosTablas.css
        tabla.className = "productos-table consulta-table";

        const thead = tabla.createTHead();
        const headerRow = thead.insertRow();
        columnas.forEach(col => {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        });

        const tbody = tabla.createTBody();
        resultadosTablaContainer.appendChild(tabla);
        return tbody; // Devolver el tbody para llenarlo con datos
    }

    // Función principal para ejecutar las consultas
    async function ejecutarConsulta(tipoConsulta) {
        resultadosTablaContainer.innerHTML = '<p class="mensaje-info">Cargando...</p>'; // Mensaje de carga
        resultadosTitulo.textContent = `Resultados: ${capitalizeWords(tipoConsulta.replace(/([A-Z])/g, ' $1').toLowerCase())}`; // Título más amigable

        let url = "";
        let columnas = [];
        let mensajeNoResultados = "";
        const dni = filtroDniInput.value.trim();

        // Determinar URL, columnas y mensaje según el tipo de consulta
        if (tipoConsulta === "listarClientes") {
            url = "/clientes/listar"; // Endpoint para listar todos los clientes
            columnas = ["ID", "DNI", "Nombre", "Apellido", "Email", "Teléfono"]; // Ajusta según tu entidad Cliente
            mensajeNoResultados = "No se encontraron clientes.";
        } else if (tipoConsulta === "top10MasVendidos") {
            url = "/api/consultas/top10MasVendidos"; // Asumiendo este endpoint en tu backend
            columnas = ["Posición", "Nombre Producto", "Categoría", "Cantidad Vendida"];
            mensajeNoResultados = "No se encontraron productos más vendidos.";
        } else if (tipoConsulta === "top10MenosVendidos") {
            url = "/api/consultas/top10MenosVendidos"; // Asumiendo este endpoint en tu backend
            columnas = ["Posición", "Nombre Producto", "Categoría", "Cantidad Vendida"];
            mensajeNoResultados = "No se encontraron productos menos vendidos.";
        } else if (tipoConsulta === "productosCompradosPorCliente") {
            if (!dni) {
                mostrarMensajeTemporal("Por favor, ingrese un DNI para ver los productos comprados.", "error");
                resultadosTablaContainer.innerHTML = "";
                return;
            }
            url = `/compras/listar/cliente/${dni}`; // Endpoint para compras de un cliente
            columnas = ["ID Compra", "Fecha Compra", "Producto", "Cantidad", "Precio Unitario"];
            mensajeNoResultados = `No se encontraron productos comprados por el cliente con DNI: ${dni}.`;
        } else if (tipoConsulta === "dineroGastadoPorCliente") {
            if (!dni) {
                mostrarMensajeTemporal("Por favor, ingrese un DNI para calcular el dinero gastado.", "error");
                resultadosTablaContainer.innerHTML = "";
                return;
            }
            url = `/compras/listar/cliente/${dni}`; // Usaremos este endpoint y calcularemos en frontend
            columnas = ["DNI Cliente", "Total Gastado"];
            mensajeNoResultados = `No se encontró dinero gastado por el cliente con DNI: ${dni}.`;
        } else {
            mostrarMensajeTemporal("Tipo de consulta no válido.", "error");
            resultadosTablaContainer.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            const data = await response.json();

            const tbody = crearEstructuraTabla(columnas); // Crea la tabla con thead y devuelve el tbody

            if (data.length === 0 && tipoConsulta !== "dineroGastadoPorCliente") { // Dinero gastado puede ser 0
                const filaMensaje = tbody.insertRow();
                const celdaMensaje = filaMensaje.insertCell();
                celdaMensaje.colSpan = columnas.length;
                celdaMensaje.className = "mensaje-info";
                celdaMensaje.textContent = mensajeNoResultados;
                return;
            }

            // Llenar la tabla según el tipo de consulta
            if (tipoConsulta === "listarClientes") {
                data.forEach(cliente => {
                    const fila = tbody.insertRow();
                    fila.insertCell().textContent = cliente.id || 'N/A';
                    fila.insertCell().textContent = cliente.dni || 'N/A';
                    fila.insertCell().textContent = cliente.nombre ? capitalizeWords(cliente.nombre) : 'N/A';
                    fila.insertCell().textContent = cliente.apellido ? capitalizeWords(cliente.apellido) : 'N/A';
                    fila.insertCell().textContent = cliente.email || 'N/A';
                    fila.insertCell().textContent = cliente.telefono || 'N/A';
                });
            } else if (tipoConsulta === "top10MasVendidos" || tipoConsulta === "top10MenosVendidos") {
                data.forEach((item, index) => {
                    const fila = tbody.insertRow();
                    fila.insertCell().textContent = index + 1; // Posición en el ranking
                    fila.insertCell().textContent = item.nombre || 'N/A'; // Nombre del producto
                    fila.insertCell().textContent = item.categoria || 'N/A'; // Categoría del producto
                    fila.insertCell().textContent = item.cantidadVendida || 'N/A'; // Campo que debería venir del backend
                });
            } else if (tipoConsulta === "productosCompradosPorCliente") {
                if (data.length === 0) {
                    const filaMensaje = tbody.insertRow();
                    const celdaMensaje = filaMensaje.insertCell();
                    celdaMensaje.colSpan = columnas.length;
                    celdaMensaje.className = "mensaje-info";
                    celdaMensaje.textContent = mensajeNoResultados;
                    return;
                }
                // Agrupar productos por compra para un mejor detalle
                data.forEach(compra => {
                    const fechaCompra = new Date(compra.fecha);
                    let detalleProductos = [];
                    try {
                        const productosEnCompra = JSON.parse(compra.detalle);
                        productosEnCompra.forEach(prod => {
                            detalleProductos.push({
                                nombre: prod.nombre,
                                cantidad: prod.cantidad,
                                precioUnitario: prod.precioUnitario
                            });
                        });
                    } catch (e) {
                        detalleProductos.push({ nombre: "Error detalle", cantidad: 1, precioUnitario: 0 });
                    }

                    detalleProductos.forEach(prodDetalle => {
                        const fila = tbody.insertRow();
                        fila.insertCell().textContent = compra.id || 'N/A';
                        fila.insertCell().textContent = fechaCompra.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
                        fila.insertCell().textContent = prodDetalle.nombre;
                        fila.insertCell().textContent = prodDetalle.cantidad;
                        fila.insertCell().textContent = `$${(prodDetalle.precioUnitario || 0).toFixed(2)}`;
                    });
                });
            } else if (tipoConsulta === "dineroGastadoPorCliente") {
                let totalGastado = 0;
                if (data.length > 0) {
                    data.forEach(compra => {
                        totalGastado += compra.total || 0;
                    });
                }
                const fila = tbody.insertRow();
                fila.insertCell().textContent = dni;
                fila.insertCell().textContent = `$${totalGastado.toFixed(2)}`;
            }

        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
            const tbody = crearEstructuraTabla(columnas); // Recrea tabla con encabezados si falla la primera vez
            const filaError = tbody.insertRow();
            const celdaError = filaError.insertCell();
            celdaError.colSpan = columnas.length;
            celdaError.className = "mensaje-error";
            celdaError.textContent = `Error al cargar los datos: ${error.message}. Intenta de nuevo.`;
        }
    }

    // Añadir event listeners a los botones
    botonesConsulta.forEach(button => {
        button.addEventListener("click", () => {
            const tipoConsulta = button.dataset.consulta;
            ejecutarConsulta(tipoConsulta);
        });
    });

    // Ejecutar una consulta inicial (ej. Listar Clientes) al cargar la página
    ejecutarConsulta("listarClientes");
});
