// ======================================================
// MOTOR DE CARGA DINÁMICA - EO STUDIO
// ======================================================

function abrirColeccion(idFranquicia, nombreFranquicia, rutaJson) {
  const vistaA = document.getElementById('vista-franquicias');
  const vistaB = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');
  const contenedorGrilla = document.getElementById('disenos-grid-dinamico');

  // 1. Alternar vistas de las capas
  if (vistaA) vistaA.style.display = 'none';
  if (vistaB) vistaB.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;

  if (!contenedorGrilla) return;
  contenedorGrilla.innerHTML = '';

  // 2. Definir la ruta del archivo JSON objetivo
  const archivoTarget = rutaJson || 'json/mugs.json';

  // 3. Ejecutar la lectura del JSON
  fetch(archivoTarget)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener ${archivoTarget}`);
      }
      return response.json();
    })
    .then(data => {
      const coleccion = data[idFranquicia];
      if (!coleccion || !coleccion.fotos) {
        contenedorGrilla.innerHTML = '<p class="sin-resultados">No hay diseños disponibles en esta sección.</p>';
        return;
      }

      // 4. Renderizar las imágenes en la grilla
      coleccion.fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto.src;
        img.alt = foto.titulo;
        img.onclick = () => abrirVisor(foto.src, foto.titulo, coleccion.categoria);
        contenedorGrilla.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error procesando el JSON:', error);
      contenedorGrilla.innerHTML = `<p class="sin-resultados">Error al cargar los diseños. Revisa que estés ejecutando la página con Live Server.</p>`;
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