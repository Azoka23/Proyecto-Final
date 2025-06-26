

document.addEventListener("DOMContentLoaded", function () {
    // 1. Obtener datos del localStorage
    const nombreCliente = localStorage.getItem("nombreCliente");
    const fecha = localStorage.getItem("fecha");
    const total = localStorage.getItem("total");
    const carrito = JSON.parse(localStorage.getItem("carritoCompra"));
    const numeroCompra = localStorage.getItem("numeroCompra");
    const clienteId = localStorage.getItem("clienteIdCompra");

    // 2. Asignar valores a las variables globales (y elementos del DOM ahora al inicio)
    let nombreClienteFactura = nombreCliente;
    let fechaFactura = fecha;
    let originalTotalFactura = parseFloat(total);
    let carritoFactura = carrito;
    let numeroCompraFactura = numeroCompra;
    let totalConDescuento = originalTotalFactura; // Se actualizará si se aplica descuento
    let descuentoAplicadoValor = 0;
    let formaPagoSeleccionada = "";

    // ✅ TODAS LAS DECLARACIONES DE ELEMENTOS DEL DOM AQUI AL PRINCIPIO
    const listaCompraDetalle = document.getElementById("lista-compra-detalle");
    const btnFormaPago = document.getElementById('btn-forma-pago');
    const listaFormaPago = document.getElementById('lista-forma-pago');
    const btnDescuento = document.getElementById('btn-descuento');
    const listaDescuento = document.getElementById('lista-descuento');
    const formaPagoSeleccionadaDiv = document.getElementById('forma-pago-seleccionada');
    const descuentoAplicadoDiv = document.getElementById('descuento-aplicado');
    const totalConDescuentoDisplay = document.getElementById('total-con-descuento-display');
    const totalFinalDescuentoSpan = document.getElementById('total-final-descuento');
    const btnImprimirFactura = document.getElementById('btn-imprimir-factura'); // ✅ Declaración ahora al principio
    const btnVolverACompra = document.getElementById('btn-volver-a-compra');


    // Función auxiliar para capitalizar la primera letra (declarada aquí para que esté disponible)
    function capitalizeFirstLetter(string) {
        if (!string) return ''; // Maneja casos de string nulo o vacío
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // 3. Mostrar datos en la factura
    document.getElementById("nombre-cliente-detalle").textContent = nombreCliente;
    document.getElementById("fecha-compra").textContent = fecha;
    document.getElementById("total-compra-detalle").textContent = `$${originalTotalFactura.toFixed(2)}`;
    document.getElementById("numero-compra-detalle").textContent = numeroCompra;


    if (carritoFactura && carritoFactura.length > 0) {
        carritoFactura.forEach(item => {
            const li = document.createElement("li");
            li.className = "producto";
            li.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            `;
            listaCompraDetalle.appendChild(li);
        });
    } else {
        listaCompraDetalle.innerHTML = "<li>No hay productos en el carrito.</li>";
    }

    // Ya no removemos el carrito de localStorage aquí. Solo se removerá DESPUÉS de una compra exitosa al imprimir factura.
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("fecha");
    localStorage.removeItem("numeroCompra");

    // Inicializar display del total con descuento
    totalConDescuentoDisplay.classList.add('oculto');
    totalFinalDescuentoSpan.textContent = `$${originalTotalFactura.toFixed(2)}`; // Mostrar total original por defecto

    // --- MANEJO DE FORMA DE PAGO Y DESCUENTO ---
    btnFormaPago.addEventListener('click', (event) => {
        event.stopPropagation();
        listaFormaPago.classList.toggle('mostrar');
        listaDescuento.classList.remove('mostrar');
    });

    btnDescuento.addEventListener('click', (event) => {
        event.stopPropagation();
        if (formaPagoSeleccionada === "") {
            mostrarMensajeFlotante("Primero selecciona una forma de pago para aplicar un descuento.", "error", 3500);
            return;
        }
        listaDescuento.classList.toggle('mostrar');
        listaFormaPago.classList.remove('mostrar');
    });

    listaFormaPago.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            formaPagoSeleccionada = event.target.dataset.pago;
            formaPagoSeleccionadaDiv.textContent = `Forma de Pago: ${capitalizeFirstLetter(formaPagoSeleccionada)}`; // Usar capitalizeFirstLetter
            formaPagoSeleccionadaDiv.classList.remove('oculto');
            listaFormaPago.classList.remove('mostrar');
            btnDescuento.classList.remove('oculto');

            document.querySelectorAll('#lista-forma-pago li.seleccionado').forEach(item => item.classList.remove('seleccionado'));
            event.target.classList.add('seleccionado');

            totalConDescuento = originalTotalFactura;
            descuentoAplicadoValor = 0;
            totalFinalDescuentoSpan.textContent = `$${totalConDescuento.toFixed(2)}`;
            descuentoAplicadoDiv.classList.add('oculto');
            document.querySelectorAll('#lista-descuento li.seleccionado').forEach(item => item.classList.remove('seleccionado'));
        }
    });

    listaDescuento.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            descuentoAplicadoValor = parseInt(event.target.dataset.descuento);

            totalConDescuento = originalTotalFactura - (originalTotalFactura * (descuentoAplicadoValor / 100));

            totalFinalDescuentoSpan.textContent = `$${totalConDescuento.toFixed(2)}`;
            totalConDescuentoDisplay.classList.remove('oculto');

            descuentoAplicadoDiv.textContent = `Descuento Aplicado: ${descuentoAplicadoValor}% ($${(originalTotalFactura - totalConDescuento).toFixed(2)})`;
            descuentoAplicadoDiv.classList.remove('oculto');

            listaDescuento.classList.remove('mostrar');

            document.querySelectorAll('#lista-descuento li.seleccionado').forEach(item => item.classList.remove('seleccionado'));
            event.target.classList.add('seleccionado');
        }
    });

    // ✅ LÓGICA CLAVE: ENVIAR LA COMPRA AL BACKEND AL IMPRIMIR FACTURA
    btnImprimirFactura.addEventListener('click', async function(event) {
        event.preventDefault();

        if (formaPagoSeleccionada === "") {
            mostrarMensajeFlotante("Debes seleccionar una forma de pago antes de imprimir.", "error", 3500);
            return;
        }

        if (!carritoFactura || carritoFactura.length === 0) {
            mostrarMensajeFlotante("El carrito está vacío. No se puede registrar una compra sin productos.", "error", 3500);
            return;
        }

        const compraData = {
            cliente: { dni: clienteId },
            carrito: carritoFactura.map(item => ({
                producto: {
                    id: item.id,
                    precio: item.precio,
                    cantidadEnStock: item.cantidadEnStock,
                    nombre: item.nombre,
                    categoria: capitalizeFirstLetter(item.categoria) // ✅ Usar la función capitalizeFirstLetter aquí
                },
                cantidad: item.cantidad,
            })),
            formaPago: formaPagoSeleccionada,
            descuentoAplicado: descuentoAplicadoValor
        };

        console.log("Enviando datos de compra al backend:", JSON.stringify(compraData, null, 2));

        try {
            const response = await fetch('/compras/finalizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(compraData)
            });

            const resultText = await response.text();
            console.log("Respuesta del backend:", response.status, resultText);

            if (!response.ok) {
                mostrarMensajeFlotante(`Error al registrar compra: ${resultText}`, "error", 5000);
                throw new Error(`Error en el servidor: ${resultText}`);
            }

            mostrarMensajeFlotante("✅ Compra registrada y stock actualizado. Imprimiendo factura...", "exito", 4000);

            // Vaciar el carrito de localStorage SOLO DESPUÉS DE UNA COMPRA EXITOSA
            localStorage.removeItem("carritoCompra");
            localStorage.removeItem("clienteIdCompra");
            localStorage.removeItem("nombreCliente");
            localStorage.removeItem("fecha");
            localStorage.removeItem("total");
            localStorage.removeItem("numeroCompra");

            setTimeout(() => {
                window.print();
            }, 1000);

        } catch (error) {
            console.error("Fallo la solicitud al backend:", error);
            mostrarMensajeFlotante(`Fallo la conexión o el servidor: ${error.message}`, "error", 5000);
        }
    });

    // Asignar el clienteId al href del botón "Volver a Compra"
    if (btnVolverACompra && clienteId) {
        btnVolverACompra.href = `/compra.html?clienteId=${clienteId}`;
    } else if (btnVolverACompra) {
        btnVolverACompra.href = `/compra.html`;
        console.warn("ClienteId no encontrado en localStorage para el botón Volver a Compra.");
    }

    document.addEventListener('click', () => {
        listaFormaPago.classList.remove('mostrar');
        listaDescuento.classList.remove('mostrar');
    });

    // Función para mostrar mensajes flotantes
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
});