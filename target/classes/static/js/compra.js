


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
    const carrito = JSON.parse(localStorage.getItem('carritoCompra')) || []; // Cargar carrito desde localStorage

    let currentPage = 0;
    const pageSize = 20;
    let totalPages = 0;
    let currentCategoryFilter = categoriaSelect.value;

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
        const categorias = ["", "cafe", "te", "accesorio"];
        categoriaSelect.innerHTML = "";
        categorias.forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre === "" ? " Todos " : nombre.charAt(0).toUpperCase() + nombre.slice(1);
            categoriaSelect.appendChild(option);
        });
        categoriaSelect.value = currentCategoryFilter;
    }

    // ✅ FUNCIÓN PRINCIPAL: Carga productos paginados para una categoría específica
    async function cargarProductosPaginados(page, categoria) {
        currentCategoryFilter = categoria;
        productosContainer.innerHTML = "";

        let url = `/productos?page=${page}&size=${pageSize}&sort=nombre,asc`;
        if (categoria && categoria !== "") {
            url += `&categoria=${categoria}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
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
                    div.id = `producto-${producto.id}`; // ✅ AÑADIDO: ID único para cada div de producto

                    const stockValueForDisplay = producto.cantidadEnStock !== null && producto.cantidadEnStock !== undefined ? producto.cantidadEnStock : 'N/A';
                    const stockValueForLogic = producto.cantidadEnStock !== null && producto.cantidadEnStock !== undefined ? producto.cantidadEnStock : 0;

                    let stockClass = (stockValueForLogic <= 10 && stockValueForLogic > 0) ? 'stock-bajo' : 'stock-alto';
                    if (stockValueForLogic === 0) {
                        stockClass = 'stock-bajo';
                    }

                    div.innerHTML = `
                        <span>${producto.nombre} - Stock: <span class="stock ${stockClass}">${stockValueForDisplay}</span> - $${(producto.precio || 0).toFixed(2)}</span>
                        <input type="number" min="1" max="${stockValueForLogic}" value="1" class="cantidad-input">
                        <button class="btn-agregar" data-producto='${JSON.stringify(producto)}'>Agregar</button>
                    `;

                    const btnAgregar = div.querySelector(".btn-agregar");
                    const inputCantidad = div.querySelector(".cantidad-input");
                    const stockSpan = div.querySelector(".stock");

                    if (stockValueForLogic <= 0) {
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
                                mostrarMensajeFlotante("No hay suficiente stock para agregar esa cantidad.", "error");
                                return;
                            }
                            existente.cantidad += cantidad;
                        } else {
                            carrito.push({ ...productoAgregado, cantidad: cantidad });
                        }

                        const nuevoStockVisual = productoAgregado.cantidadEnStock - cantidad;
                        stockSpan.textContent = nuevoStockVisual;

                        stockSpan.classList.remove('stock-bajo', 'stock-alto');
                        if (nuevoStockVisual <= 10 && nuevoStockVisual > 0) {
                            stockSpan.classList.add('stock-bajo');
                        } else if (nuevoStockVisual === 0) {
                            stockSpan.classList.add('stock-bajo');
                        }
                        else {
                            stockSpan.classList.add('stock-alto');
                        }

                        inputCantidad.max = nuevoStockVisual;
                        if (nuevoStockVisual <= 0) {
                            inputCantidad.value = 0;
                            inputCantidad.disabled = true;
                            btnAgregar.disabled = true;
                        }

                        productoAgregado.cantidadEnStock = nuevoStockVisual;
                        btnAgregar.dataset.producto = JSON.stringify(productoAgregado);

                        inputCantidad.value = 1;

                        actualizarCarrito();
                        mostrarMensajeFlotante(`"${productoAgregado.nombre}" agregado al carrito.`, "exito");
                    });

                    productosContainer.appendChild(div);
                });
                // ✅ LLAMADA CLAVE: Sincronizar el stock visual con el carrito DESPUÉS de renderizar
                sincronizarStockVisualConCarrito();
            }
            actualizarControlesPaginacion();
        } catch (err) {
            console.error("Error al cargar productos:", err); // ✅ Mensaje genérico
            // ✅ CORRECCIÓN: Asegurar que el mensaje de error se renderice correctamente
            productosContainer.innerHTML = `<p class="mensaje-error">Error al cargar los productos. Detalles: ${err.message}. Por favor, revisa la consola del navegador.</p>`;
            paginationControlsDiv.innerHTML = '';
        }
    }

    // ✅ NUEVA FUNCIÓN: Sincroniza el stock visual en la página con los productos que ya están en el carrito
    function sincronizarStockVisualConCarrito() {
        console.log("--- Sincronizando stock visual con carrito ---");
        console.log("Carrito actual (localStorage):", JSON.stringify(carrito));

        if (carrito.length === 0) {
            console.log("Carrito vacío, no hay stock que sincronizar.");
            return;
        }

        carrito.forEach(itemCarrito => {
            console.log(`Intentando sincronizar producto ID: ${itemCarrito.id}, Cantidad en carrito: ${itemCarrito.cantidad}`);
            // ✅ MODIFICADO: Buscar el div de producto por su ID directo
            const productoDiv = document.getElementById(`producto-${itemCarrito.id}`);

            if (productoDiv) {
                console.log(`Producto DIV encontrado para ID ${itemCarrito.id}.`);
                console.log(`Inner HTML of productoDiv:`, productoDiv.innerHTML); // DEBUG: Muestra el contenido del div

                const btnAgregar = productoDiv.querySelector(".btn-agregar");
                const inputCantidad = productoDiv.querySelector(".cantidad-input");
                const stockSpan = productoDiv.querySelector(".stock");

                console.log(`Resultado querySelector .btn-agregar:`, btnAgregar); // DEBUG: Resultado de la búsqueda del botón
                console.log(`Resultado querySelector .cantidad-input:`, inputCantidad);
                console.log(`Resultado querySelector .stock:`, stockSpan);


                if (!btnAgregar || !inputCantidad || !stockSpan) { // ✅ Añadido: Manejo de error si no se encuentran los elementos esperados
                    console.error(`ERROR: No se encontraron todos los elementos necesarios (btn-agregar, cantidad-input, stock) para el producto ID ${itemCarrito.id}. Saltando sincronización para este ítem.`);
                    return; // Saltar a la siguiente iteración del forEach
                }


                let productoDataFromButton = JSON.parse(btnAgregar.dataset.producto);

                const stockEnBoton = productoDataFromButton.cantidadEnStock;
                const cantidadYaEnCarrito = itemCarrito.cantidad;

                const nuevoStockVisual = stockEnBoton - cantidadYaEnCarrito;

                console.log(`  - ${itemCarrito.nombre}: Stock inicial (desde botón) = ${stockEnBoton}, Cantidad en carrito = ${cantidadYaEnCarrito}, Nuevo stock visual = ${nuevoStockVisual}`);

                stockSpan.textContent = nuevoStockVisual;
                stockSpan.classList.remove('stock-bajo', 'stock-alto');
                if (nuevoStockVisual <= 10 && nuevoStockVisual > 0) {
                    stockSpan.classList.add('stock-bajo');
                } else if (nuevoStockVisual <= 0) {
                     stockSpan.classList.add('stock-bajo');
                }
                else {
                    stockSpan.classList.add('stock-alto');
                }

                inputCantidad.max = nuevoStockVisual;
                if (nuevoStockVisual <= 0) {
                    inputCantidad.value = 0;
                    inputCantidad.disabled = true;
                    btnAgregar.disabled = true;
                } else {
                    inputCantidad.disabled = false;
                    btnAgregar.disabled = false;
                }

                productoDataFromButton.cantidadEnStock = nuevoStockVisual;
                btnAgregar.dataset.producto = JSON.stringify(productoDataFromButton);
                console.log(`  - Dataset actualizado para ${itemCarrito.nombre}:`, JSON.parse(btnAgregar.dataset.producto));

            } else {
                console.log(`Producto ID ${itemCarrito.id} NO encontrado en la página actual. (Puede estar en otra página de la paginación).`);
            }
        });
        console.log("--- Sincronización de stock visual finalizada ---");
    }

    // ✅ FUNCIÓN: Actualizar los controles de paginación
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
            btnEliminar.addEventListener("click", () => {
                const productoEliminadoDelCarrito = carrito.splice(idx, 1)[0];
                actualizarCarrito();

                const productoDivEnDOM = document.getElementById(`producto-${productoEliminadoDelCarrito.id}`); // ✅ MODIFICADO: Buscar por ID

                if (productoDivEnDOM) {
                    const btnAgregar = productoDivEnDOM.querySelector('.btn-agregar');
                    const inputCantidad = productoDivEnDOM.querySelector('.cantidad-input');
                    const stockSpan = productoDivEnDOM.querySelector('.stock');

                    if (!btnAgregar || !inputCantidad || !stockSpan) { // ✅ Añadido: Manejo de error
                        console.error(`ERROR: No se encontraron todos los elementos necesarios (btn-agregar, cantidad-input, stock) para el producto ID ${productoEliminadoDelCarrito.id} al eliminar del carrito.`);
                        // En este caso, no podemos restaurar el stock visualmente.
                        return;
                    }

                    let productoDataFromButton = JSON.parse(btnAgregar.dataset.producto);
                    const cantidadRestaurada = productoDataFromButton.cantidadEnStock + productoEliminadoDelCarrito.cantidad;

                    stockSpan.textContent = cantidadRestaurada;
                    stockSpan.classList.remove('stock-bajo', 'stock-alto');
                    if (cantidadRestaurada <= 10 && cantidadRestaurada > 0) {
                        stockSpan.classList.add('stock-bajo');
                    } else if (cantidadRestaurada === 0) {
                        stockSpan.classList.add('stock-bajo');
                    }
                    else {
                        stockSpan.classList.add('stock-alto');
                    }

                    inputCantidad.max = cantidadRestaurada;
                    inputCantidad.disabled = false;
                    btnAgregar.disabled = false;

                    productoDataFromButton.cantidadEnStock = cantidadRestaurada;
                    btnAgregar.dataset.producto = JSON.stringify(productoDataFromButton);
                } else {
                    // Si el producto no está en la vista actual, no podemos restaurar su stock visual aquí directamente.
                    // La sincronización al recargar la página lo manejará.
                }
                mostrarMensajeFlotante(`"${productoEliminadoDelCarrito.nombre}" eliminado del carrito.`, "info");
            });

            li.appendChild(btnEliminar);
            carritoItems.appendChild(li);

            total += item.precio * item.cantidad;
        });
        totalSpan.textContent = `$${total.toFixed(2)}`;
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
            pointer-events: none;
            color: white;
        `;

        if (tipo === "error") {
            mensajeDiv.style.backgroundColor = 'rgba(255, 99, 71, 0.9)';
        } else if (tipo === "exito") {
            mensajeDiv.style.backgroundColor = 'rgba(60, 179, 113, 0.9)';
        } else { // info
            mensajeDiv.style.backgroundColor = 'rgba(70, 130, 180, 0.9)';
        }

        document.body.appendChild(mensajeDiv);

        setTimeout(() => { mensajeDiv.style.opacity = 1; }, 10);

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

        localStorage.setItem("carritoCompra", JSON.stringify(carrito));
        localStorage.setItem("nombreCliente", nombre);
        localStorage.setItem("fecha", fecha);
        localStorage.setItem("total", total.toFixed(2));
        localStorage.setItem("numeroCompra", numeroCompra);

        if (clienteId) {
            localStorage.setItem("clienteIdCompra", clienteId);
        } else {
            console.warn("ClienteId no disponible para guardar en localStorage al finalizar compra.");
        }

        window.location.href = "factura.html";
    });

    document.getElementById("seguir-comprando").addEventListener("click", () => {
        carritoDiv.style.display = "none";
    });

    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        carrito.length = 0;
        actualizarCarrito();
        // ✅ CLAVE: Al vaciar el carrito, recargamos los productos para que el stock vuelva a su estado original del backend.
        cargarProductosPaginados(currentPage, currentCategoryFilter);
        mostrarMensajeFlotante("El carrito ha sido vaciado. El stock de los productos ha sido restaurado.", "info");
    });

    // 9) Inicialización al cargar la página
    if (clienteId) {
        cargarInformacionCliente(clienteId);
    } else {
        const storedClienteId = localStorage.getItem("clienteIdCompra");
        if (storedClienteId) {
            cargarInformacionCliente(storedClienteId);
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
    actualizarCarrito();
});
