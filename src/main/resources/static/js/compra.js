


document.addEventListener("DOMContentLoaded", function () {
    // 1) Obtener el clienteId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');

    // 2) Elementos del DOM
    const carritoItems = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total-compra");
    const nombreClienteSpan = document.getElementById("nombre-cliente");
    const carritoDiv = document.getElementById("carrito-contenido");
    const formularioDiv = document.querySelector(".formulario");
    const categoriaSelect = document.getElementById("categoria");
    const productosContainer = document.getElementById("productos-container");
    const paginationControlsDiv = document.getElementById("pagination-controls-compra");

    // 3) Variables globales para paginación y carrito
    let total = 0;
    // ✅ CORRECCIÓN: Inicializar el carrito cargándolo desde localStorage si existe, si no, como array vacío
    const carrito = JSON.parse(localStorage.getItem('carritoCompra')) || [];

    let currentPage = 0; // Estado: Página actual (base 0)
    const pageSize = 20; // Estado: Cantidad de elementos por página
    let totalPages = 0; // Estado: Total de páginas disponibles
    let currentCategoryFilter = categoriaSelect.value; // Estado: Filtro de categoría actual (inicializa con el valor por defecto del selector)

    // 4) Cargar información del cliente (si viene en la URL)
    function cargarInformacionCliente(clienteId) {
        fetch(`/clientes/${clienteId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error al cargar info cliente: ${res.status}`);
                return res.json();
            })
            .then(data => {
                nombreClienteSpan.textContent = data.nombre || "Cliente";
            })
            .catch(err => console.error("Error al cargar información del cliente:", err));
    }

    // 5) Cargar categorías en el selector (fijas)
    function cargarCategorias() {
        const categorias = ["", "cafe", "te", "accesorio"]; // La opción vacía se mantiene para "-- Seleccionar --"
        categoriaSelect.innerHTML = "";
        categorias.forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre === "" ? "-- Seleccionar --" : nombre.charAt(0).toUpperCase() + nombre.slice(1);
            categoriaSelect.appendChild(option);
        });
        // Sincronizar el selector con el filtro actual si ya se ha seleccionado algo previamente
        categoriaSelect.value = currentCategoryFilter;
    }

    // ✅ FUNCIÓN PRINCIPAL: Carga productos paginados para una categoría específica
    async function cargarProductosPaginados(page, categoria) {
        currentCategoryFilter = categoria; // Actualiza el filtro actual
        productosContainer.innerHTML = ""; // Limpiar productos anteriores

        let url = `/productos?page=${page}&size=${pageSize}&sort=nombre,asc`;
        if (categoria && categoria !== "") {
            url += `&categoria=${categoria}`;
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

            if (productos.length === 0) {
                const message = categoria === "" ?
                    "No se encontraron productos." :
                    `No se encontraron productos en la categoría "${categoria.charAt(0).toUpperCase() + categoria.slice(1)}".`;
                productosContainer.innerHTML = `<p class="mensaje-info">${message}</p>`;
            } else {
                productos.forEach(producto => {
                    const div = document.createElement("div");
                    div.className = "producto";

                    const stockClass = (producto.cantidadEnStock !== null && producto.cantidadEnStock <= 10) ? 'stock-bajo' : 'stock-alto';

                    div.innerHTML = `
                        <span>${producto.nombre} - Stock: <span class="stock ${stockClass}">${producto.cantidadEnStock || 'N/A'}</span> - $${(producto.precio || 0).toFixed(2)}</span>
                        <input type="number" min="1" max="${producto.cantidadEnStock}" value="1" class="cantidad-input">
                        <button class="btn-agregar" data-producto='${JSON.stringify(producto)}'>Agregar</button>
                    `;

                    const btnAgregar = div.querySelector(".btn-agregar");
                    const inputCantidad = div.querySelector(".cantidad-input");
                    const stockSpan = div.querySelector(".stock");

                    // ✅ Deshabilitar si el stock es 0 al cargar la página
                    if (producto.cantidadEnStock === 0) {
                        inputCantidad.value = 0;
                        inputCantidad.disabled = true;
                        btnAgregar.disabled = true;
                    }


                    btnAgregar.addEventListener("click", () => {
                        const cantidad = parseInt(inputCantidad.value, 10);
                        let productoAgregado = JSON.parse(btnAgregar.dataset.producto);

                        if (isNaN(cantidad) || cantidad < 1) {
                            mostrarMensajeFlotante("Ingrese una cantidad válida", "error");
                            return;
                        }
                        if (cantidad > productoAgregado.cantidadEnStock) {
                            mostrarMensajeFlotante(`No hay suficiente stock. Disponible: ${productoAgregado.cantidadEnStock}`, "error");
                            return;
                        }

                        const existente = carrito.find(p => p.id === productoAgregado.id);
                        if (existente) {
                            if (existente.cantidad + cantidad > productoAgregado.cantidadEnStock + existente.cantidad) {
                                mostrarMensajeFlotante("No hay suficiente stock para esa cantidad.", "error");
                                return;
                            }
                            existente.cantidad += cantidad;
                        } else {
                            carrito.push({ ...productoAgregado, cantidad: cantidad });
                        }

                        // ✅ Actualizar stock visualmente en la misma fila del producto (solo en el frontend)
                        const nuevoStockVisual = productoAgregado.cantidadEnStock - cantidad;
                        stockSpan.textContent = nuevoStockVisual;

                        stockSpan.classList.remove('stock-bajo', 'stock-alto');
                        if (nuevoStockVisual <= 10) {
                            stockSpan.classList.add('stock-bajo');
                        } else {
                            stockSpan.classList.add('stock-alto');
                        }

                        inputCantidad.max = nuevoStockVisual;
                        if (nuevoStockVisual === 0) {
                            inputCantidad.value = 0;
                            inputCantidad.disabled = true;
                            btnAgregar.disabled = true;
                        }

                        productoAgregado.cantidadEnStock = nuevoStockVisual;
                        btnAgregar.dataset.producto = JSON.stringify(productoAgregado);
                        inputCantidad.value = 1; // Resetear cantidad a 1 para la próxima adición

                        actualizarCarrito();
                        mostrarMensajeFlotante(`"${productoAgregado.nombre}" agregado al carrito.`, "exito");
                    });

                    productosContainer.appendChild(div);
                });
            }
            actualizarControlesPaginacion(); // Actualizar controles de paginación después de cargar productos
        } catch (err) {
            console.error("Error al cargar productos:", err);
            productosContainer.innerHTML = `<p class="mensaje-error">Error al cargar los productos. Intenta de nuevo.</p>`;
            paginationControlsDiv.innerHTML = ''; // Limpiar controles de paginación en caso de error
        }
    }

    // ✅ FUNCIÓN: Actualizar los controles de paginación
    function actualizarControlesPaginacion() {
        paginationControlsDiv.innerHTML = ''; // Limpiar controles existentes

        // Botón "Anterior"
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            cargarProductosPaginados(currentPage - 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(prevButton);

        // Indicador de página (ej. "Página 1 de 5")
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
        paginationControlsDiv.appendChild(pageInfo);

        // Botón "Siguiente"
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages - 1 || totalPages === 0;
        nextButton.addEventListener('click', () => {
            cargarProductosPaginados(currentPage + 1, currentCategoryFilter);
        });
        paginationControlsDiv.appendChild(nextButton);
    }

    // 7) Actualizar carrito
    function actualizarCarrito() {
        carritoItems.innerHTML = "";
        total = 0;

        carrito.forEach((item, idx) => {
            const li = document.createElement("li");
            li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)} `;

            const btnEliminar = document.createElement("button");
            btnEliminar.className = "eliminar";
            btnEliminar.textContent = "❌";
            // ✅ CORRECCIÓN: Event listener del botón eliminar
            btnEliminar.addEventListener("click", () => {
                const productoEliminado = carrito[idx]; // Obtener el producto antes de eliminarlo
                carrito.splice(idx, 1); // Eliminar el elemento del carrito
                actualizarCarrito(); // Volver a renderizar el carrito

                // ✅ MEJORA: Restaurar el stock visualmente del producto si está en la página actual
                // No es necesario recargar toda la página si solo se actualiza un stock
                const productoDivEnDOM = productosContainer.querySelector(`[data-producto*='"id":${productoEliminado.id}']`);
                if (productoDivEnDOM) {
                    let productoDataBtn = JSON.parse(productoDivEnDOM.querySelector('.btn-agregar').dataset.producto);
                    const cantidadRestaurada = productoDataBtn.cantidadEnStock + productoEliminado.cantidad;

                    productoDivEnDOM.querySelector('.stock').textContent = cantidadRestaurada;
                    productoDivEnDOM.querySelector('.cantidad-input').max = cantidadRestaurada;
                    productoDivEnDOM.querySelector('.cantidad-input').disabled = false;
                    productoDivEnDOM.querySelector('.btn-agregar').disabled = false;

                    // Actualizar clase de color de stock
                    productoDivEnDOM.querySelector('.stock').classList.remove('stock-bajo', 'stock-alto');
                    if (cantidadRestaurada <= 10) {
                        productoDivEnDOM.querySelector('.stock').classList.add('stock-bajo');
                    } else {
                        productoDivEnDOM.querySelector('.stock').classList.add('stock-alto');
                    }

                    // Actualizar el dataset.producto en el botón para reflejar el nuevo stock
                    productoDataBtn.cantidadEnStock = cantidadRestaurada;
                    productoDivEnDOM.querySelector('.btn-agregar').dataset.producto = JSON.stringify(productoDataBtn);
                } else {
                    // Si el producto no está en la vista actual, recargar la página para asegurar la coherencia
                    cargarProductosPaginados(currentPage, currentCategoryFilter);
                }
                mostrarMensajeFlotante(`"${productoEliminado.nombre}" eliminado del carrito.`, "info");
            });

            li.appendChild(btnEliminar);
            carritoItems.appendChild(li);

            total += item.precio * item.cantidad;
        });
        totalSpan.textContent = `$${total.toFixed(2)}`;
        // ✅ Guardar el carrito actualizado en localStorage
        localStorage.setItem('carritoCompra', JSON.stringify(carrito));
    }

    // Función para mostrar mensajes flotantes (reemplazo de alert)
    function mostrarMensajeFlotante(mensaje, tipo = "info", duracion = 3000) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            text-align: center;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            max-width: 80%;
            pointer-events: none; /* Permite clics a través del mensaje */
            color: white; /* Color de texto base para los mensajes */
        `;

        if (tipo === "error") {
            mensajeDiv.style.backgroundColor = 'rgba(255, 99, 71, 0.9)'; // Tomato
        } else if (tipo === "exito") {
            mensajeDiv.style.backgroundColor = 'rgba(60, 179, 113, 0.9)'; // MediumSeaGreen
        } else { // info
            mensajeDiv.style.backgroundColor = 'rgba(70, 130, 180, 0.9)'; // SteelBlue
        }

        document.body.appendChild(mensajeDiv);

        // Fade in
        setTimeout(() => { mensajeDiv.style.opacity = 1; }, 10);

        // Fade out and remove
        setTimeout(() => {
            mensajeDiv.style.opacity = 0;
            mensajeDiv.addEventListener('transitionend', () => mensajeDiv.remove());
        }, duracion);
    }

    // 8) Listeners de botones de control del carrito
    document.getElementById("carrito-icono").addEventListener("click", () => {
        carritoDiv.style.display = carritoDiv.style.display === "block" ? "none" : "block";
    });

    document.getElementById("finalizar-compra").addEventListener("click", () => {
        if (carrito.length === 0) {
            mostrarMensajeFlotante("El carrito está vacío. Agrega productos antes de finalizar.", "error");
            return;
        }
        const nombre = nombreClienteSpan.textContent || "Cliente";
        const fecha = new Date().toLocaleDateString();
        const numeroCompra = Math.floor(Math.random() * 1000000);

        // ✅ Usar 'carritoCompra' como clave para el carrito en localStorage
        localStorage.setItem("carritoCompra", JSON.stringify(carrito));
        localStorage.setItem("nombreCliente", nombre);
        localStorage.setItem("fecha", fecha);
        localStorage.setItem("total", total.toFixed(2));
        localStorage.setItem("numeroCompra", numeroCompra);

        // Guardar el clienteId en localStorage
        if (clienteId) {
            localStorage.setItem("clienteIdCompra", clienteId); // ✅ Nueva clave para evitar colisiones
        } else {
            console.warn("ClienteId no disponible para guardar en localStorage al finalizar compra.");
        }

        window.location.href = "factura.html";
    });

    document.getElementById("seguir-comprando").addEventListener("click", () => {
        carritoDiv.style.display = "none";
    });

    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        carrito.length = 0; // Vaciar el array del carrito
        actualizarCarrito(); // Actualizar la vista del carrito (quedará vacío)
        // Recargar la página actual de productos para actualizar stocks visuales
        cargarProductosPaginados(currentPage, currentCategoryFilter);
        mostrarMensajeFlotante("El carrito ha sido vaciado.", "info");
    });

    // 9) Inicialización al cargar la página
    if (clienteId) {
        cargarInformacionCliente(clienteId);
    } else {
        // ✅ CORRECCIÓN: Si no viene clienteId en la URL, intentar cargarlo de localStorage
        const storedClienteId = localStorage.getItem("clienteIdCompra");
        if (storedClienteId) {
            cargarInformacionCliente(storedClienteId);
            // También podemos actualizar el URL para que al recargar la página siga teniendo el ID
            window.history.replaceState({}, document.title, window.location.pathname + `?clienteId=${storedClienteId}`);
        } else {
            console.error("No se encontró el clienteId en la URL ni en localStorage. Se mostrará un cliente genérico.");
            nombreClienteSpan.textContent = "Cliente Genérico";
        }
    }

    cargarCategorias();

    categoriaSelect.addEventListener("change", () => {
        currentPage = 0;
        cargarProductosPaginados(currentPage, categoriaSelect.value);
    });

    // Cargar productos al inicio (primera página de la categoría por defecto)
    cargarProductosPaginados(currentPage, currentCategoryFilter);
    actualizarCarrito(); // Asegurar que el carrito se renderice si ya tiene algo en localStorage
});
