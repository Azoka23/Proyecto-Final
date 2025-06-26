document.addEventListener("DOMContentLoaded", () => {
    const tablaStockBody = document.querySelector(".productos-table tbody");
    const tablaStockDiv = document.querySelector(".productos-table");
    const paginationControlsDiv = document.getElementById("pagination-controls");

    let currentPage = 0; // Estado: Página actual (base 0)
    const pageSize = 15; // Estado: Cantidad de elementos por página
    let totalPages = 0; // Estado: Total de páginas disponibles
    let currentCategoryFilter = "todos"; // Estado: Filtro de categoría actual

    // Función principal para cargar el stock con paginación y filtro
    async function cargarStockPaginado(page, categoriaFiltro) {
        currentCategoryFilter = categoriaFiltro; // Actualiza el filtro global

        // Puedes cambiar 'nombre,asc' a 'cantidadEnStock,asc' si quieres ordenar por stock por defecto
        let url = `/productos?page=${page}&size=${pageSize}&sort=nombre,asc`;
        if (categoriaFiltro && categoriaFiltro !== "todos") {
            url += `&categoria=${categoriaFiltro}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pageData = await response.json();

            const productos = pageData.content;
            totalPages = pageData.totalPages;
            currentPage = pageData.number;

            mostrarStock(productos);
            actualizarControlesPaginacion();
            agregarSelectorCategoria(); // No necesitamos pasar productos aquí.
        } catch (error) {
            console.error("Error al cargar el stock:", error);
            tablaStockBody.innerHTML = `<tr><td colspan="4" class="mensaje-error">Error al cargar el stock. Intenta de nuevo.</td></tr>`;
            paginationControlsDiv.innerHTML = '';
        }
    }

    // Función para agregar el selector de categoría dinámicamente
    function agregarSelectorCategoria() {
        let selector = document.getElementById("filtroCategoriaStock");
        if (!selector) {
            selector = document.createElement("select");
            selector.id = "filtroCategoriaStock";
            tablaStockDiv.parentNode.insertBefore(selector, tablaStockDiv);

            const categorias = ["todos", "cafe", "te", "accesorio"];
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat;
                option.textContent = cat === "todos" ? "Todas las Categorías" : cat.charAt(0).toUpperCase() + cat.slice(1);
                selector.appendChild(option);
            });

            selector.value = currentCategoryFilter;

            selector.addEventListener("change", function () {
                currentPage = 0;
                cargarStockPaginado(currentPage, this.value);
            });
        }
    }

    // ✅ FUNCIÓN MODIFICADA: Ahora aplica formato condicional al stock
    function mostrarStock(productos) {
        tablaStockBody.innerHTML = "";

        if (productos.length === 0) {
            const mensajeCategoria = currentCategoryFilter === "todos" ? "ninguna categoría." : `la categoría "${currentCategoryFilter.charAt(0).toUpperCase() + currentCategoryFilter.slice(1)}".`;
            tablaStockBody.innerHTML = `<tr><td colspan="4" class="mensaje-info">No hay productos en ${mensajeCategoria}</td></tr>`;
            return;
        }

        productos.forEach((producto) => {
            const fila = tablaStockBody.insertRow();
            const idCell = fila.insertCell();
            const nombreCell = fila.insertCell();
            const categoriaCell = fila.insertCell();
            const stockCell = fila.insertCell(); // Celda para el stock

            idCell.textContent = producto.id || "N/A";
            nombreCell.textContent = producto.nombre;
            categoriaCell.textContent = producto.categoria || "N/A";
            stockCell.textContent = producto.cantidadEnStock || "N/A";

            // ✅ LÓGICA DE FORMATO CONDICIONAL
            const stockValue = producto.cantidadEnStock;
            if (stockValue !== null && stockValue !== undefined) {
                if (stockValue <= 10) {
                    stockCell.classList.add('stock-bajo'); // Añade la clase CSS para stock bajo
                } else {
                    stockCell.classList.add('stock-alto'); // Añade la clase CSS para stock alto
                }
            }
        });
    }

    // Función: Actualizar los controles de paginación
    function actualizarControlesPaginacion() {
        paginationControlsDiv.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            cargarStockPaginado(currentPage - 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
        paginationControlsDiv.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages - 1 || totalPages === 0;
        nextButton.addEventListener('click', () => {
            cargarStockPaginado(currentPage + 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(nextButton);
    }

    agregarSelectorCategoria();
    cargarStockPaginado(currentPage, currentCategoryFilter);
});
