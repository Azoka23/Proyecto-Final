document.addEventListener("DOMContentLoaded", () => {
  const productoForm = document.getElementById("producto-form");
  const productoTableBody = document.getElementById("producto-table-body");
  const nombreInput = document.getElementById("nombre");
  const tipoInput = document.getElementById("tipo");
  const precioInput = document.getElementById("precio");
  const descripcionInput = document.getElementById("descripcion");
  const guardarBtn = document.getElementById("guardar-btn");
  const limpiarBtn = document.getElementById("limpiar-btn");

  let editando = false;
  let idEditando = null;

  // Cargar productos al iniciar
  cargarProductos();

  // Guardar producto
  productoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const producto = {
      nombre: nombreInput.value.trim(),
      tipo: tipoInput.value.trim(),
      precio: parseFloat(precioInput.value),
      descripcion: descripcionInput.value.trim()
    };

    if (!producto.nombre || !producto.tipo || isNaN(producto.precio)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    if (editando) {
      actualizarProducto(idEditando, producto);
    } else {
      crearProducto(producto);
    }
  });

  // Limpiar formulario
  limpiarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarFormulario();
  });

  function cargarProductos() {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => {
        productoTableBody.innerHTML = "";
        data.forEach(p => agregarFila(p));
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }

  function agregarFila(producto) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.tipo}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.descripcion || ""}</td>
      <td>
        <button class="editar-btn" data-id="${producto.id}">✏️</button>
        <button class="eliminar-btn" data-id="${producto.id}">🗑️</button>
      </td>
    `;
    productoTableBody.appendChild(fila);
  }

  function crearProducto(producto) {
    fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    })
      .then(res => res.ok ? cargarProductos() : Promise.reject("Error al crear producto"))
      .then(() => limpiarFormulario())
      .catch(err => console.error(err));
  }

  function actualizarProducto(id, producto) {
    fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    })
      .then(res => res.ok ? cargarProductos() : Promise.reject("Error al actualizar producto"))
      .then(() => limpiarFormulario())
      .catch(err => console.error(err))
      .finally(() => {
        editando = false;
        idEditando = null;
        guardarBtn.textContent = "Agregar";
      });
  }

  function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    fetch(`/api/productos/${id}`, {
      method: "DELETE"
    })
      .then(res => res.ok ? cargarProductos() : Promise.reject("Error al eliminar producto"))
      .catch(err => console.error(err));
  }

  function limpiarFormulario() {
    productoForm.reset();
    editando = false;
    idEditando = null;
    guardarBtn.textContent = "Agregar";
  }

  productoTableBody.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("editar-btn")) {
      fetch(`/api/productos/${id}`)
        .then(res => res.json())
        .then(p => {
          nombreInput.value = p.nombre;
          tipoInput.value = p.tipo;
          precioInput.value = p.precio;
          descripcionInput.value = p.descripcion;
          editando = true;
          idEditando = p.id;
          guardarBtn.textContent = "Actualizar";
        })
        .catch(err => console.error("Error al obtener producto:", err));
    }

    if (e.target.classList.contains("eliminar-btn")) {
      eliminarProducto(id);
    }
  });
});
