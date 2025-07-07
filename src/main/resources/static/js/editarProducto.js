
 // Ubicación: src/main/resources/static/js/editarProducto.js
 document.addEventListener("DOMContentLoaded", () => {
   const buscarNombreInput = document.getElementById("buscarNombre");
   const buscarBtn = document.getElementById("buscarBtn");
   const formEditar = document.getElementById("formEditar");
   const nombreInputEditar = document.getElementById("nombre");
   const categoriaInputEditar = document.getElementById("categoria");
   const stockInputEditar = document.getElementById("stock");
   const precioInputEditar = document.getElementById("precio");
   const autocompleteSuggestionsDiv = document.getElementById("autocomplete-suggestions");

   let productoAEditarId = null;
   let debounceTimer;

   function capitalizeWords(str) {
     if (!str) return '';
     return str.replace(/\b\w/g, char => char.toUpperCase());
   }

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

     tempMessageDiv.style.backgroundColor = "rgba(255, 243, 220, 0.9)";
     tempMessageDiv.style.color = "#721c24";
     tempMessageDiv.style.border = "1px solid #d9b382";

     document.body.appendChild(tempMessageDiv);

     setTimeout(() => {
         tempMessageDiv.style.opacity = 1;
     }, 10);

     setTimeout(() => {
         tempMessageDiv.style.opacity = 0;
         setTimeout(() => tempMessageDiv.remove(), 300);
     }, 3000);
   }

   window.alert = (message) => mostrarMensajeTemporal(message, "error");

   buscarNombreInput.addEventListener("input", () => {
     clearTimeout(debounceTimer);
     const query = buscarNombreInput.value.trim();
     if (query.length > 1) {
       debounceTimer = setTimeout(() => {
         buscarSugerencias(query);
       }, 300);
     } else {
       autocompleteSuggestionsDiv.innerHTML = '';
       autocompleteSuggestionsDiv.style.display = 'none';
     }
   });

   buscarNombreInput.addEventListener("blur", () => {
     setTimeout(() => {
       autocompleteSuggestionsDiv.style.display = 'none';
     }, 150);
   });

   buscarNombreInput.addEventListener("focus", () => {
     if (autocompleteSuggestionsDiv.innerHTML !== '' && autocompleteSuggestionsDiv.children.length > 0) {
         autocompleteSuggestionsDiv.style.display = 'block';
     }
   });

   buscarBtn.addEventListener("click", () => {
     const nombreBusqueda = buscarNombreInput.value.trim();
     if (nombreBusqueda) {
       buscarSugerencias(nombreBusqueda);
     } else {
       mostrarMensajeTemporal("Por favor, ingresa el nombre del producto a buscar.", "error");
     }
   });

   const productoFormEditar = document.getElementById("productoFormEditar");
   if (productoFormEditar) { // Asegúrate de que el formulario exista antes de añadir el listener
       productoFormEditar.addEventListener("submit", function (e) {
         console.log("Evento submit del formulario activado.");
         e.preventDefault();

         if (!nombreInputEditar.value.trim()) {
             mostrarMensajeTemporal("El nombre  del producto no puede estar vacío.", "error");
             return;
         }
         if (isNaN(parseInt(stockInputEditar.value))) {
             mostrarMensajeTemporal("El stock debe ser un número válido.", "error");
             return;
         }
         if (isNaN(parseFloat(precioInputEditar.value))) {
             mostrarMensajeTemporal("El precio debe ser un número válido.", "error");
             return;
         }
         if (!categoriaInputEditar.value.trim()) {
             mostrarMensajeTemporal("La categoría no puede estar vacía.", "error");
             return;
         }

         if (productoAEditarId && categoriaInputEditar.value) {
           const categoria = capitalizeWords(categoriaInputEditar.value.trim());
           const productoActualizado = {
             nombre: nombreInputEditar.value.trim(),
             cantidadEnStock: parseInt(stockInputEditar.value),
             precio: parseFloat(precioInputEditar.value),
             categoria: categoria
           };
           console.log("DEBUG: ID que se envía a actualizarProducto:", productoAEditarId);
           actualizarProducto(productoAEditarId, productoActualizado, categoria);
         } else {
           mostrarMensajeTemporal("No se ha cargado ningún producto para editar o la categoría no está definida.", "error");
         }
       });
   }


   async function buscarSugerencias(query) {
     try {
       // ✅ MODIFICACIÓN: Añadir logs para ver el estado de la respuesta
       const url = `/productos/buscar?nombre=${encodeURIComponent(query)}`;
       console.log(`DEBUG: Realizando fetch a: ${url}`);
       const response = await fetch(url);

       console.log(`DEBUG: Respuesta recibida - Status: ${response.status}, StatusText: ${response.statusText}`);

       if (!response.ok) {
         const errorText = await response.text();
         console.error(`DEBUG: Error en la respuesta HTTP para ${url}: ${response.status} - ${response.statusText}`, errorText);
         throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
       }
       const productos = await response.json();

       mostrarSugerencias(productos);
     } catch (error) {
       console.error("Error al buscar sugerencias:", error);
       autocompleteSuggestionsDiv.innerHTML = `<li style="color: red; padding: 10px;">Error al cargar sugerencias: ${error.message}.</li>`;
       autocompleteSuggestionsDiv.style.display = 'block';
     }
   }

   function mostrarSugerencias(productos) {
     autocompleteSuggestionsDiv.innerHTML = '';
     if (productos.length === 0) {
       autocompleteSuggestionsDiv.innerHTML = '<li style="padding: 10px;">No se encontraron coincidencias.</li>';
       autocompleteSuggestionsDiv.style.display = 'block';
       return;
     }

     productos.forEach(producto => {
       const li = document.createElement('li');
       li.textContent = `${producto.nombre} (${producto.categoria})`;
       li.dataset.producto = JSON.stringify(producto);

       li.addEventListener('mousedown', (e) => {
         e.preventDefault();
         seleccionarSugerencia(producto);
       });
       autocompleteSuggestionsDiv.appendChild(li);
     });
     autocompleteSuggestionsDiv.style.display = 'block';
   }

   function seleccionarSugerencia(producto) {
     buscarNombreInput.value = producto.nombre;
     mostrarFormularioEdicion(producto, producto.categoria);
     autocompleteSuggestionsDiv.innerHTML = '';
     autocompleteSuggestionsDiv.style.display = 'none';
   }

   function mostrarFormularioEdicion(producto, categoriaBuscada) {
       console.log("DEBUG: ID recibido en mostrarFormularioEdicion:", producto.id);
       productoAEditarId = producto.id;
       nombreInputEditar.value = producto.nombre || "";
       categoriaInputEditar.value = categoriaBuscada || "";
       stockInputEditar.value = producto.cantidadEnStock || "";
       precioInputEditar.value = producto.precio || "";
       formEditar.style.display = "block";
     }

   function actualizarProducto(id, producto, categoria) {
     console.log(`Actualizando producto con ID: ${id} en categoría: ${categoria}`, producto);
     let url = "";
     switch (categoria.toLowerCase()) {
       case "cafe":
         url = `/cafes/${id}`;
         break;
       case "te":
         url = `/tes/${id}`;
         break;
       case "accesorio":
         url = `/accesorios/${id}`;
         break;
       case "producto":
         url = `/productos/${id}`;
         break;
       default:
         mostrarMensajeTemporal("Categoría de producto no válida para actualizar.", "error");
         return;
     }

     fetch(url, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(producto),
     })
       .then(response => {
         if (response.ok) {
           mostrarMensajeTemporal(`Producto "${producto.nombre}" actualizado con éxito.`, "success");
           formEditar.style.display = "none";
           buscarNombreInput.value = "";
           autocompleteSuggestionsDiv.innerHTML = '';
           autocompleteSuggestionsDiv.style.display = 'none';
           productoAEditarId = null;
         } else {
           return response.text().then(text => { throw new Error(`Error al actualizar producto: ${response.status} - ${text}`); });
         }
       })
       .catch(error => {
         console.error("Error al actualizar producto:", error);
         mostrarMensajeTemporal(`Error al actualizar el producto: ${error.message || ''}`, "error");
       });
     }

     const btnEliminar = document.getElementById("btnEliminar");
     if(btnEliminar) {
         btnEliminar.addEventListener("click", () => {
             if (productoAEditarId && categoriaInputEditar.value && nombreInputEditar.value) {
               const categoriaDisplay = capitalizeWords(categoriaInputEditar.value.trim());
               if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${nombreInputEditar.value}" de la categoría ${categoriaDisplay}?`)) {
                  eliminarProducto(productoAEditarId, categoriaInputEditar.value.trim().toLowerCase());
               }
             } else {
               mostrarMensajeTemporal("No se ha cargado ningún producto para eliminar.", "error");
             }
         });
     }

     function eliminarProducto(id, categoria) {
         let url = "";
         switch (categoria.toLowerCase()) {
           case "cafe": url = `/cafes/${id}`; break;
           case "te": url = `/tes/${id}`; break;
           case "accesorio": url = `/accesorios/${id}`; break;
           case "producto": url = `/productos/${id}`; break;
           default: mostrarMensajeTemporal("Categoría de producto no válida para eliminar.", "error"); return;
         }

         fetch(url, { method: "DELETE" })
           .then(response => {
             if (response.ok) {
               mostrarMensajeTemporal(`Producto eliminado con éxito.`, "success");
               formEditar.style.display = "none";
               buscarNombreInput.value = "";
               autocompleteSuggestionsDiv.innerHTML = '';
               autocompleteSuggestionsDiv.style.display = 'none';
               productoAEditarId = null;
             } else {
               return response.text().then(text => { throw new Error(`Error al eliminar producto: ${response.status} - ${text}`); });
             }
           })
           .catch(error => {
             console.error("Error al eliminar producto:", error);
             mostrarMensajeTemporal(`Error al eliminar el producto: ${error.message || ''}`, "error");
           });
       }
 });
