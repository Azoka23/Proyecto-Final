

document.addEventListener("DOMContentLoaded", function () {
    // 1. Obtener datos del localStorage
    const nombreCliente = localStorage.getItem("nombreCliente");
    const fecha = localStorage.getItem("fecha");
    const total = localStorage.getItem("total");
    const carrito = JSON.parse(localStorage.getItem("carritoCompra")); // ✅ CORRECCIÓN: Usar la misma clave 'carritoCompra'
    const numeroCompra = localStorage.getItem("numeroCompra");
    const clienteId = localStorage.getItem("clienteIdCompra"); // ✅ CORRECCIÓN: Usar la misma clave 'clienteIdCompra'

    // 2. Asignar valores a las variables globales
    let nombreClienteFactura = nombreCliente;
    let fechaFactura = fecha;
    let originalTotalFactura = parseFloat(total);
    let carritoFactura = carrito;
    let numeroCompraFactura = numeroCompra;
    let totalConDescuento = originalTotalFactura;
    let descuentoAplicadoValor = 0;
    let formaPagoSeleccionada = "";

    // 3. Mostrar datos en la factura
    document.getElementById("nombre-cliente-detalle").textContent = nombreCliente;
    document.getElementById("fecha-compra").textContent = fecha;
    document.getElementById("total-compra-detalle").textContent = `$${originalTotalFactura.toFixed(2)}`;
    document.getElementById("numero-compra-detalle").textContent = numeroCompra;

    const listaCompraDetalle = document.getElementById("lista-compra-detalle");
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

    // ✅ CORRECCIÓN: Ya NO ELIMINAMOS el carrito de localStorage aquí si queremos que persista
    // Solo eliminamos los datos de la factura que son de un solo uso
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("fecha");
    localStorage.removeItem("total");
    localStorage.removeItem("numeroCompra");
    localStorage.removeItem("descuentoAplicado");
    localStorage.removeItem("formaPago");
    // localStorage.removeItem("clienteIdCompra"); // Decisión: ¿Queremos que el clienteId persista siempre?
                                                // Si sí, no lo elimines. Si solo es para esta factura, sí.
                                                // Por ahora, lo mantenemos para que el botón "volver a compra" funcione bien.


    // --- MANEJO DE FORMA DE PAGO Y DESCUENTO ---
    const btnFormaPago = document.getElementById('btn-forma-pago');
    const listaFormaPago = document.getElementById('lista-forma-pago');
    const btnDescuento = document.getElementById('btn-descuento');
    const listaDescuento = document.getElementById('lista-descuento');

    const formaPagoSeleccionadaDiv = document.getElementById('forma-pago-seleccionada');
    const descuentoAplicadoDiv = document.getElementById('descuento-aplicado');
    const totalConDescuentoDisplay = document.getElementById('total-con-descuento-display');
    const totalFinalDescuentoSpan = document.getElementById('total-final-descuento');

    const btnImprimirFactura = document.getElementById('btn-imprimir-factura');
    const btnVolverACompra = document.getElementById('btn-volver-a-compra');

    btnFormaPago.addEventListener('click', (event) => {
        event.stopPropagation();
        listaFormaPago.classList.toggle('mostrar');
        listaDescuento.classList.remove('mostrar');
    });

    btnDescuento.addEventListener('click', (event) => {
        event.stopPropagation();
        listaDescuento.classList.toggle('mostrar');
        listaFormaPago.classList.remove('mostrar');
    });

    listaFormaPago.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            formaPagoSeleccionada = event.target.dataset.pago;
            formaPagoSeleccionadaDiv.textContent = `Forma de Pago: ${formaPagoSeleccionada.charAt(0).toUpperCase() + formaPagoSeleccionada.slice(1)}`;
            formaPagoSeleccionadaDiv.classList.remove('oculto');
            listaFormaPago.classList.remove('mostrar');
            btnDescuento.classList.remove('oculto');

            document.querySelectorAll('#lista-forma-pago li.seleccionado').forEach(item => item.classList.remove('seleccionado'));
            event.target.classList.add('seleccionado');
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

    btnImprimirFactura.addEventListener('click', function(event) {
        event.preventDefault();

        if (formaPagoSeleccionada === "") {
            const mensajeError = document.createElement('div');
            mensajeError.textContent = "Debes seleccionar una forma de pago antes de imprimir.";
            mensajeError.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 243, 220, 0.9);
                color: #4b3d2f;
                border: 1px solid #d9b382;
                padding: 15px;
                border-radius: 5px;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                text-align: center;
                font-weight: bold;
            `;
            document.body.appendChild(mensajeError);

            setTimeout(() => {
                mensajeError.remove();
            }, 3000);
            return;
        }
        window.print();
    });

    // ✅ LÓGICA CLAVE: Asignar el clienteId al href del botón "Volver a Compra"
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

});
