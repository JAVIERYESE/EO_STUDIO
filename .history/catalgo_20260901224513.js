// ======================================================
// MOTOR DE CARGA DINÁMICA - EO STUDIO
// ======================================================

function abrirColeccion(idFranquicia, nombreFranquicia, rutaJson) {
  console.log("-> Ejecutando abrirColeccion para:", idFranquicia, "Ruta:", rutaJson);

  const vistaA = document.getElementById('vista-franquicias');
  const vistaB = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');
  const contenedorGrilla = document.getElementById('disenos-grid-dinamico');

  // 1. Ocultar Capa A y mostrar Capa B (se despliega el botón Volver y el título)
  if (vistaA) vistaA.style.display = 'none';
  if (vistaB) vistaB.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;

  if (!contenedorGrilla) {
    console.error("Error: No se encontró la división con id='disenos-grid-dinamico' en el HTML.");
    return;
  }
  
  contenedorGrilla.innerHTML = '<p style="text-align:center; padding: 20px;">Cargando diseños...</p>';

  // 2. Definir la ruta del archivo JSON objetivo
  const archivoTarget = rutaJson || 'json/mugs.json';

  // 3. Petición al archivo JSON
  fetch(archivoTarget)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Estado HTTP ${response.status}: No se encontró el archivo en ${archivoTarget}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("-> Datos JSON recibidos exitosamente:", data);
      const coleccion = data[idFranquicia];
      
      if (!coleccion || !coleccion.fotos || coleccion.fotos.length === 0) {
        contenedorGrilla.innerHTML = '<p class="sin-resultados" style="grid-column: 1/-1; text-align: center; padding: 30px;">No hay diseños disponibles en esta colección todavía.</p>';
        return;
      }

      contenedorGrilla.innerHTML = ''; // Limpiar mensaje de carga

      // 4. Inyectar las imágenes en la grilla
      coleccion.fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto.src;
        img.alt = foto.titulo;
        img.loading = 'lazy';
        img.onclick = () => abrirVisor(foto.src, foto.titulo, coleccion.categoria);
        contenedorGrilla.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error durante la carga:', error);
      contenedorGrilla.innerHTML = `<p class="sin-resultados" style="grid-column: 1/-1; text-align: center; color: #d9534f; padding: 30px;">Error al cargar los diseños (${error.message}). Revisa que la ruta exista y estés usando Live Server.</p>`;
    });

  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function cerrarColeccion() {
  const vistaA = document.getElementById('vista-franquicias');
  const vistaB = document.getElementById('vista-galeria-disenos');

  if (vistaB) vistaB.style.display = 'none';
  if (vistaA) vistaA.style.display = 'block';
}

// ======================================================
// VISOR MODAL PARA WHATSAPP
// ======================================================

function abrirVisor(rutaImg, titulo, categoria) {
  const modal = document.getElementById('modal-visor');
  const img = document.getElementById('modal-img');
  const txtTitulo = document.getElementById('modal-titulo');
  const btnWa = document.getElementById('modal-btn-wa');

  if (!modal) return;

  if (img) img.src = rutaImg;
  if (txtTitulo) txtTitulo.textContent = titulo;

  if (btnWa) {
    const mensaje = encodeURIComponent(`¡Hola EO Studio! Me interesa el diseño "${titulo}" de la categoría ${categoria || 'Mugs'}.`);
    btnWa.href = `https://wa.me/573046168524?text=${mensaje}`;
  }

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function cerrarVisorDirecto() {
  const modal = document.getElementById('modal-visor');
  if (modal) modal.classList.remove('is-active');
  document.body.style.overflow = '';
}

function cerrarVisor(e) {
  if (e.target.id === 'modal-visor') cerrarVisorDirecto();
}