document.addEventListener("DOMContentLoaded", () => {
  const formCargar = document.getElementById("formCargar");
  const mensajeExito = document.getElementById("mensajeExito");
  const categoriaInput = document.getElementById("categoria");

  formCargar.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreInput = document.getElementById("nombre");
    const stockInput = document.getElementById("stock");
    const precioInput = document.getElementById("precio");

    function capitalizeWords(str) {
      return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    const categoriaCapitalizada = capitalizeWords(categoriaInput.value.trim());
    const nuevoProducto = {
      nombre: capitalizeWords(nombreInput.value.trim()),
      cantidadEnStock: parseInt(stockInput.value),
      precio: parseFloat(precioInput.value),
      categoria: categoriaCapitalizada
    };

    console.log("Valores antes de la validación:", nuevoProducto, "Categoría:", categoriaCapitalizada);

    if (!nuevoProducto.nombre) {
      console.log("Validación falló por nombre:", nuevoProducto.nombre);
      mostrarMensajeTemporal("Por favor, completa el nombre del producto.", "error");
      return;
    }
    if (isNaN(nuevoProducto.precio)) {
      console.log("Validación falló por precio:", nuevoProducto.precio);
      mostrarMensajeTemporal("Por favor, ingresa un precio válido.", "error");
      return;
    }
    if (isNaN(nuevoProducto.cantidadEnStock)) {
      console.log("Validación falló por stock:", nuevoProducto.cantidadEnStock);
      mostrarMensajeTemporal("Por favor, ingresa un stock inicial válido.", "error");
      return;
    }
    if (!categoriaCapitalizada) {
      console.log("Validación falló por categoría:", categoriaCapitalizada);
      mostrarMensajeTemporal("Por favor, ingresa la categoría del producto.", "error");
      return;
    }

    let url = "";
    switch (categoriaCapitalizada.toLowerCase()) {
      case "cafe":
        url = "/cafes";
        break;
      case "te":
        url = "/tes";
        break;
      case "accesorio":
        url = "/accesorios";
        break;
      case "producto":
        url = "/productos";
        break;
      default:
        mostrarMensajeTemporal("Categoría de producto no válida.", "error");
        return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((response) => {
        if (response.ok) {
          // Aunque mensajeExito.textContent se mantiene, también usamos mostrarMensajeTemporal
          // para la consistencia visual y la duración.
          mostrarMensajeTemporal(`Producto "${nuevoProducto.nombre}" cargado en ${categoriaCapitalizada} con éxito.`, "success");
          formCargar.reset();
        } else {
          return response.text().then(text => {
            const errorMessage = `Error al cargar producto: ${response.status} - ${text}`;
            console.error(errorMessage);
            mostrarMensajeTemporal(errorMessage, "error");
            return Promise.reject(errorMessage);
          });
        }
      })
      .catch((error) => {
        console.error("Error en la carga del producto:", error);
        mostrarMensajeTemporal(`Error de conexión o servidor: ${error.message}`, "error");
      });
  });

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
    `;

    // ✅ CAMBIO CLAVE AQUÍ: Ambos tipos de mensaje ahora usan los mismos colores
    tempMessageDiv.style.backgroundColor = "rgba(255, 243, 220, 0.9)"; // Fondo beige claro
    tempMessageDiv.style.color = "#721c24"; // Texto marrón oscuro
    tempMessageDiv.style.border = "1px solid #d9b382"; // Borde marrón/beige

    document.body.appendChild(tempMessageDiv);

    setTimeout(() => {
        tempMessageDiv.style.opacity = 1;
    }, 10);

    setTimeout(() => {
        tempMessageDiv.style.opacity = 0;
        setTimeout(() => tempMessageDiv.remove(), 300);
    }, 3000);
  }

  // Ahora 'alert' también usará el estilo de error unificado.
  window.alert = (message) => mostrarMensajeTemporal(message, "error");

});
