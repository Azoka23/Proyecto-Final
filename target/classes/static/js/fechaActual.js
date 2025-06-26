function actualizarFechaHora() {
    const fechaHora = new Date();
    const formato = fechaHora.toLocaleString('es-AR', {
        dateStyle: 'long',
        timeStyle: 'short'
    });
    document.getElementById('fechaHora').textContent = formato;
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();
