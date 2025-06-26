// Ubicación: src/main/resources/static/js/listarClientes.js
document.addEventListener("DOMContentLoaded", () => {
    const clientesTablaContainer = document.getElementById("clientes-tabla-container");
    const paginationControlsDiv = document.getElementById("pagination-controls-clientes");

    // ✅ NUEVAS VARIABLES DE ESTADO PARA PAGINACIÓN Y ORDENAMIENTO
    let currentPage = 0; // Página actual (base 0)
    const pageSize = 15; // Cantidad de elementos por página (puedes ajustar este valor)
    let totalPages = 0; // Total de páginas disponibles
    // Estado de ordenamiento: campo por el que se ordena y dirección ('asc' o 'desc')
    let currentSort = { field: 'nombre', direction: 'asc' }; // Ordenar inicialmente por nombre ascendente

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


    // Función para crear la estructura básica de la tabla (thead y tbody)
    function crearEstructuraTabla(columnas) {
        clientesTablaContainer.innerHTML = ''; // Limpiar resultados anteriores

        const tabla = document.createElement("table");
        tabla.className = "productos-table clientes-list-table";

        const thead = tabla.createTHead();
        const headerRow = thead.insertRow();

        // ✅ Mapa de nombres de columna de frontend a nombres de campo de backend para ordenar
        const sortableColumnsMap = {
            "DNI": "dni",
            "Nombre": "nombre",
            "Email": "email"
        };

        columnas.forEach(colDisplayName => {
            const th = document.createElement("th");
            th.textContent = colDisplayName;

            const backendFieldName = sortableColumnsMap[colDisplayName];
            if (backendFieldName) {
                th.classList.add('sortable'); // Añadir clase para estilos de clic
                th.dataset.field = backendFieldName; // Guardar el nombre del campo de backend

                // Crear un span para el ícono de ordenamiento
                const sortIcon = document.createElement('span');
                sortIcon.className = 'sort-icon';
                th.appendChild(sortIcon);

                // ✅ Actualizar el ícono y la clase 'active-sort' si esta columna es la que está ordenada
                if (currentSort.field === backendFieldName) {
                    th.classList.add('active-sort');
                    sortIcon.innerHTML = currentSort.direction === 'asc' ? ' &#9650;' : ' &#9660;'; // Flecha arriba / Flecha abajo
                }

                // ✅ Listener de clic para ordenar
                th.addEventListener('click', () => {
                    let newDirection = 'asc';
                    // Si se hace clic en la columna que ya está ordenada, alternar la dirección
                    if (currentSort.field === backendFieldName) {
                        newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
                    }
                    currentSort = { field: backendFieldName, direction: newDirection };
                    // Reiniciar a la primera página cuando se cambia el ordenamiento
                    listarClientes(0); // Llama a listarClientes, que usará el currentSort global
                });
            }
            headerRow.appendChild(th);
        });

        const tbody = tabla.createTBody();
        clientesTablaContainer.appendChild(tabla);
        return tbody;
    }


    // ✅ MODIFICADO: Función para listar clientes con paginación y ordenamiento
    async function listarClientes(page = 0, size = pageSize) {
        clientesTablaContainer.innerHTML = '<p class="mensaje-info">Cargando clientes...</p>';
        paginationControlsDiv.innerHTML = '';

        // Construye el parámetro de ordenamiento a partir del estado global currentSort
        const sortParam = `${currentSort.field},${currentSort.direction}`;
        let url = `/clientes?page=${page}&size=${size}&sort=${sortParam}`;

        try {
            const response = await fetch(url);

            console.log(`DEBUG: Solicitud a: ${url}`);
            console.log(`DEBUG: Respuesta recibida - Status: ${response.status}, StatusText: ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            const pageData = await response.json();
            const clientes = pageData.content;
            totalPages = pageData.totalPages;
            currentPage = pageData.number;

            console.log("DEBUG: Clientes recibidos (Page data):", pageData);

            const columnas = ["DNI", "Nombre", "Email"];
            // ✅ IMPORTANTE: Se llama a crearEstructuraTabla CADA VEZ que se cargan nuevos datos
            // Esto asegura que los encabezados con sus listeners e íconos se rendericen correctamente
            const tbody = crearEstructuraTabla(columnas);

            if (clientes.length === 0) {
                const filaMensaje = tbody.insertRow();
                const celdaMensaje = filaMensaje.insertCell();
                celdaMensaje.colSpan = columnas.length;
                celdaMensaje.className = "mensaje-info";
                celdaMensaje.textContent = "No se encontraron clientes.";
                paginationControlsDiv.innerHTML = '';
                return;
            }

            clientes.forEach(cliente => {
                const fila = tbody.insertRow();
                fila.insertCell().textContent = cliente.dni || 'N/A';

                // Combina nombre y apellido en una sola celda 'Nombre'
                const nombreCompleto = (cliente.nombre ? capitalizeWords(cliente.nombre) : '') +
                                     (cliente.apellido ? ' ' + capitalizeWords(cliente.apellido) : ''); // Asumiendo que 'apellido' podría existir
                fila.insertCell().textContent = nombreCompleto.trim() || 'N/A';

                fila.insertCell().textContent = cliente.email || 'N/A';
            });

            actualizarControlesPaginacion();

        } catch (error) {
            console.error("Error al listar clientes:", error);
            const columnas = ["DNI", "Nombre", "Email"];
            const tbody = crearEstructuraTabla(columnas);
            const filaError = tbody.insertRow();
            const celdaError = filaError.insertCell();
            celdaError.colSpan = columnas.length;
            celdaError.className = "mensaje-error";
            celdaError.textContent = `Error al cargar los clientes: ${error.message}.`;
            paginationControlsDiv.innerHTML = '';
        }
    }

    // Función para actualizar los controles de paginación
    function actualizarControlesPaginacion() {
        paginationControlsDiv.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            listarClientes(currentPage - 1);
        });
        paginationControlsDiv.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
        paginationControlsDiv.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages - 1 || totalPages === 0;
        nextButton.addEventListener('click', () => {
            listarClientes(currentPage + 1);
        });
        paginationControlsDiv.appendChild(nextButton);
    }

    // Llama a la función para listar clientes cuando la página haya cargado
    // Inicia la carga de clientes en la primera página y con el ordenamiento inicial
    listarClientes(currentPage, pageSize); // sort parameter is taken from currentSort global
});
