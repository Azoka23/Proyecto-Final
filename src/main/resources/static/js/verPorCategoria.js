document.addEventListener("DOMContentLoaded", () => {
    const categoriaSelector = document.getElementById("categoria");
    const buscarBtn = document.getElementById("buscarBtn"); // Se mantendrá para referencia, pero su listener será removido
    const resultadoCategoriaDiv = document.getElementById("resultadoCategoria");
    const paginationControlsDiv = document.getElementById("pagination-controls-categoria");

    let currentPage = 0;
    const pageSize = 20;
    let totalPages = 0;
    // Inicializa con el valor por defecto del selector al cargar la página
    let currentCategoryFilter = categoriaSelector.value;

    // Función para mostrar mensajes temporales (reemplaza los alerts)
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
            color: white; /* Texto blanco por defecto */
        `;

        if (type === "error") {
            tempMessageDiv.style.backgroundColor = 'rgba(220, 53, 69, 0.9)'; // Rojo para error
        } else { // Info o éxito
            tempMessageDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.9)'; // Verde para éxito/info
        }

        document.body.appendChild(tempMessageDiv);

        setTimeout(() => { tempMessageDiv.style.opacity = 1; }, 10);
        setTimeout(() => {
            tempMessageDiv.style.opacity = 0;
            tempMessageDiv.addEventListener('transitionend', () => tempMessageDiv.remove());
        }, 3000);
    }

    // ✅ NUEVO: Función para capitalizar la primera letra de cada palabra (similar a otros JS)
    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    // Función principal para cargar y mostrar productos con paginación y filtro
    async function cargarProductosPaginados(page, categoriaFiltro) {
        currentCategoryFilter = categoriaFiltro; // Actualiza el filtro global

        let url = `/productos?page=${page}&size=${pageSize}&sort=nombre,asc`;
        if (categoriaFiltro && categoriaFiltro !== "todos" && categoriaFiltro !== "") {
            // ✅ MODIFICACIÓN: Capitalizar la categoría antes de enviarla al backend
            const categoriaParaBackend = capitalizeWords(categoriaFiltro);
            url += `&categoria=${categoriaParaBackend}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // ✅ MODIFICACIÓN: Mostrar mensaje de error más específico
                mostrarMensajeTemporal(`Error al cargar productos: HTTP status ${response.status}`, "error");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pageData = await response.json();

            const productos = pageData.content;
            totalPages = pageData.totalPages;
            currentPage = pageData.number;

            mostrarProductos(productos);
            actualizarControlesPaginacion();
        } catch (error) {
            console.error("Error al buscar productos:", error);
            // ✅ MODIFICACIÓN: Usar mostrarMensajeTemporal en lugar de innerHTML directo
            mostrarMensajeTemporal("Error al cargar los productos. Intenta de nuevo.", "error");
            resultadoCategoriaDiv.innerHTML = ""; // Asegurarse de limpiar la tabla si hubo un error irrecuperable
            paginationControlsDiv.innerHTML = '';
        }
    }

    // Función para mostrar los productos en la tabla
    function mostrarProductos(productos) {
        resultadoCategoriaDiv.innerHTML = ""; // Limpiar resultados anteriores

        // ✅ MODIFICACIÓN: Crear el contenedor de la tabla para aplicar estilos de scroll y bordes
        const tablaContainer = document.createElement('div');
        tablaContainer.className = 'productos-table-container';

        const tabla = document.createElement("table");
        // ✅ MODIFICACIÓN: Añadir la clase específica para la tabla de categoría para anchos de columna
        tabla.className = "productos-table stock-table";

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = tabla.querySelector("tbody");

        if (productos.length === 0) {
            const message = currentCategoryFilter === "todos" || currentCategoryFilter === "" ?
                "No se encontraron productos." :
                `No se encontraron productos en la categoría "${capitalizeWords(currentCategoryFilter)}".`; // ✅ MODIFICACIÓN: Capitalizar aquí también
            // ✅ MODIFICACIÓN: Insertar el mensaje en el tbody de la tabla con colspan
            tbody.innerHTML = `<tr><td colspan="4" class="mensaje-info">${message}</td></tr>`;
            tablaContainer.appendChild(tabla); // Asegurarse de que la tabla con el mensaje se añade
            resultadoCategoriaDiv.appendChild(tablaContainer);
            return;
        }

        productos.forEach(producto => {
            const fila = tbody.insertRow();
            const idCell = fila.insertCell();
            const nombreCell = fila.insertCell();
            const precioCell = fila.insertCell();
            const stockCell = fila.insertCell();

            idCell.textContent = producto.id || 'N/A';
            nombreCell.textContent = producto.nombre;
            precioCell.textContent = `$${(producto.precio || 0).toFixed(2)}`;
            stockCell.textContent = producto.cantidadEnStock || 'N/A';

            const stockValue = producto.cantidadEnStock;
            if (stockValue !== null && stockValue !== undefined) {
                if (stockValue <= 10) {
                    stockCell.classList.add('stock-bajo');
                } else {
                    stockCell.classList.add('stock-alto');
                }
            }
        });

        tablaContainer.appendChild(tabla);
        resultadoCategoriaDiv.appendChild(tablaContainer);
    }

    function actualizarControlesPaginacion() {
        paginationControlsDiv.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            cargarProductosPaginados(currentPage - 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
        paginationControlsDiv.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages - 1 || totalPages === 0;
        nextButton.addEventListener('click', () => {
            cargarProductosPaginados(currentPage + 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(nextButton);
    }

    // ✅ MODIFICACIÓN: Eliminar el event listener del botón "Buscar"
    // if (buscarBtn) {
    //     buscarBtn.addEventListener("click", () => {
    //         currentPage = 0;
    //         cargarProductosPaginados(currentPage, categoriaSelector.value);
    //     });
    // }

    // ✅ NUEVA MODIFICACIÓN: Añadir event listener al selector de categoría
    categoriaSelector.addEventListener("change", () => {
        currentPage = 0; // Reiniciar a la primera página al cambiar la categoría
        cargarProductosPaginados(currentPage, categoriaSelector.value);
    });

    // Llamar a cargarProductosPaginados() al cargar la página para mostrar productos de la categoría por defecto
    cargarProductosPaginados(currentPage, currentCategoryFilter);
});
