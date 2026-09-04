// ======================================================
// MOTOR DE CARGA DINÁMICA DE JSON — EO STUDIO
// Servirá para: mugs.html, gorras.html, camisetas.html, etc.
// ======================================================

// 1. CARGAR Y ABRIR COLECCIÓN DESDE EL ARCHIVO JSON
function abrirColeccion(idFranquicia, nombreFranquicia, archivoJson) {
  const vistaFranquicias = document.getElementById('vista-franquicias');
  const vistaGaleria = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');
  const contenedorGrilla = document.getElementById('disenos-grid-dinamico');

  // Cambiar vistas
  if (vistaFranquicias) vistaFranquicias.style.display = 'none';
  if (vistaGaleria) vistaGaleria.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;

  // Limpiar fotos anteriores
  if (contenedorGrilla) contenedorGrilla.innerHTML = '';

  // Si no se especifica JSON, asumimos la ruta por defecto
  const rutaJson = archivoJson || 'json/mugs.json';

  // Cargar datos dinámicamente
  fetch(rutaJson)
    .then(res => {
      if (!res.ok) throw new Error('No se encontró el archivo: ' + rutaJson);
      return res.json();
    })
    .then(datos => {
      if (datos && datos[idFranquicia]) {
        const coleccion = datos[idFranquicia];

        coleccion.fotos.forEach(foto => {
          const img = document.createElement('img');
          img.src = foto.src;
          img.alt = foto.titulo;
          img.loading = 'lazy'; // Carga ultrarrápida
          img.onclick = () => abrirVisor(foto.src, foto.titulo, coleccion.categoria);

          if (contenedorGrilla) contenedorGrilla.appendChild(img);
        });
      } else {
        console.warn('No se encontró la franquicia "' + idFranquicia + '" en ' + rutaJson);
      }
    })
    .catch(err => console.error('Error cargando el catálogo:', err));

  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function cerrarColeccion() {
  const vistaFranquicias = document.getElementById('vista-franquicias');
  const vistaGaleria = document.getElementById('vista-galeria-disenos');

  if (vistaGaleria) vistaGaleria.style.display = 'none';
  if (vistaFranquicias) vistaFranquicias.style.display = 'block';
}

// 2. VISOR MODAL (AMPLIAR FOTO EN GRANDE)
function abrirVisor(rutaImg, titulo, categoria) {
  const modal = document.getElementById('modal-visor');
  const img = document.getElementById('modal-img');
  const txtTitulo = document.getElementById('modal-titulo');
  const txtCat = document.getElementById('modal-cat');
  const btnWa = document.getElementById('modal-btn-wa');

  if (!modal) return;

  if (img) img.src = rutaImg;
  if (txtTitulo) txtTitulo.textContent = titulo;
  if (txtCat) txtCat.textContent = categoria || 'EO STUDIO';

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
  if (e.target.id === 'modal-visor') {
    cerrarVisorDirecto();
  }
}

// 3. BUSCADOR BLINDADO PARA EVITAR ERRORES DE ELEMENTOS FALTANTES
document.addEventListener('DOMContentLoaded', function () {
  const buscador = document.getElementById('buscador');
  const contador = document.getElementById('contador-num');
  const sinResultados = document.getElementById('sin-resultados');

  if (buscador) {
    buscador.addEventListener('input', function () {
      const texto = buscador.value.trim().toLowerCase();
      const tarjetas = document.querySelectorAll('#vista-franquicias .diseno-card');
      let visibles = 0;

      tarjetas.forEach(function (card) {
        const titulo = (card.querySelector('h3')?.textContent || card.alt || '').toLowerCase();
        const visible = texto === '' || titulo.includes(texto);

        card.style.display = visible ? '' : 'none';
        if (visible) visibles++;
      });

      if (contador) contador.textContent = visibles;
      if (sinResultados) sinResultados.style.display = (visibles === 0 && texto !== '') ? 'block' : 'none';
    });
  }
});