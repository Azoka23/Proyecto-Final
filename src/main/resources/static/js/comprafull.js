// 1) Variables globales
const carrito = [];
const productosPorCategoria = {
  cafe: [
    { nombre: "Café Colombiano", precio: 120, stock: 25 },
    { nombre: "Café Brasil",      precio: 110, stock: 10 }
  ],
  te: [
    { nombre: "Té Verde", precio: 80, stock: 30 },
    { nombre: "Té Negro", precio: 70, stock: 15 }
  ],
  accesorios: [
    { nombre: "Taza",        precio: 200, stock: 20 },
    { nombre: "Filtro Café", precio: 150, stock: 5 }
  ]
};

// 2) Listener único para cambio de categoría
document.getElementById("categoria").addEventListener("change", function () {
  const categoria = this.value;
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  if (!categoria) return;

  // --- Usar siempre productosPorCategoria ---
  const lista = productosPorCategoria[categoria] || [];

  lista.forEach(producto => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <span>${producto.nombre} - Stock: ${producto.stock} - $${producto.precio}</span>
      <input type="number" min="1" max="${producto.stock}" value="1">
      <button>Agregar</button>
    `;

    const btnAgregar    = div.querySelector("button");
    const inputCantidad = div.querySelector("input");

    btnAgregar.addEventListener("click", () => {
      const cantidad = parseInt(inputCantidad.value, 10);
      if (cantidad > 0 && cantidad <= producto.stock) {
        const existente = carrito.find(p => p.nombre === producto.nombre);
        if (existente) {
          existente.cantidad += cantidad;
        } else {
          carrito.push({ ...producto, cantidad });
        }
        producto.stock -= cantidad;
        actualizarCarrito();
        // recarga la vista de productos con stock actualizado
        document.getElementById("categoria").dispatchEvent(new Event("change"));
      }
    });

    contenedor.appendChild(div);
  });
});

// 3) Función para actualizar el carrito
function actualizarCarrito() {
  const listaUL = document.getElementById("lista-carrito");
  listaUL.innerHTML = "";

  let total = 0;

  carrito.forEach((item, idx) => {
    const li = document.createElement("li");

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "eliminar";
    btnEliminar.textContent = "❌";
    btnEliminar.addEventListener("click", () => {
      // Devolver stock al array original
      const arr = productosPorCategoria[item.categoria] || [];
      const prod = arr.find(p => p.nombre === item.nombre);
      if (prod) prod.stock += item.cantidad;

      carrito.splice(idx, 1);
      actualizarCarrito();
      document.getElementById("categoria").dispatchEvent(new Event("change"));
    });

    li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad} `;
    li.appendChild(btnEliminar);
    listaUL.appendChild(li);

    total += item.precio * item.cantidad;
  });

  // Asegúrate de que en tu HTML haya un elemento con id="total-compra"
  document.getElementById("total-compra").textContent = `$${total}`;
}

// 4) Resto de listeners (carrito, finalizar, boleta, etc.)
document.getElementById("carrito-icono").addEventListener("click", () => {
  const carritoDiv = document.getElementById("carrito-contenido");
  carritoDiv.style.display = carritoDiv.style.display === "block" ? "none" : "block";
  document.querySelector(".formulario").style.display = "none";
});

document.getElementById("finalizar-compra").addEventListener("click", () => {
  const detalle = document.getElementById("detalle-compra");
  const nombre  = document.getElementById("nombre-cliente").textContent;
  const fecha   = new Date().toLocaleDateString();
  const total   = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  document.getElementById("nombre-cliente-detalle").textContent = nombre;
  document.getElementById("total-compra").textContent         = `$${total}`;
  document.getElementById("fecha-compra").textContent         = fecha;

  document.getElementById("carrito-contenido").style.display = "none";
  detalle.style.display = "block";
  document.querySelector(".formulario").style.display = "none";
});

document.getElementById("seguir-comprando").addEventListener("click", () => {
  document.getElementById("detalle-compra").style.display    = "none";
  document.querySelector(".formulario").style.display        = "block";
  document.getElementById("carrito-contenido").style.display = "none";
});

document.getElementById("vaciar-carrito").addEventListener("click", () => {
  // Devolver a stock todos los ítems
  carrito.forEach(item => {
    const arr = productosPorCategoria[item.categoria] || [];
    const prod = arr.find(p => p.nombre === item.nombre);
    if (prod) prod.stock += item.cantidad;
  });
  carrito.length = 0;
  actualizarCarrito();
  document.getElementById("categoria").dispatchEvent(new Event("change"));
});

document.getElementById("imprimir-boleta").addEventListener("click", () => window.print());
