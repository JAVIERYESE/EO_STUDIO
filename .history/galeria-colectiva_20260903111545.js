// ======================================================
// MOTOR DE GRILLAS Y VISOR MODAL (EO STUDIO)
// Para: mugs.html, gorras.html, camisetas.html, etc.
// ======================================================

// 1. NAVEGACIÓN EN 2 CAPAS Y RENDERIZADO DINÁMICO
async function abrirColeccion(idFranquicia, nombreFranquicia, rutaJson) {
  const vistaA = document.getElementById('vista-franquicias');
  const vistaB = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');
  const contenedorGrid = document.getElementById('disenos-grid-dinamico');

  // Cambiar vista de Capa A a Capa B
  if (vistaA) vistaA.style.display = 'none';
  if (vistaB) vistaB.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;

  window.scrollTo({ top: 300, behavior: 'smooth' });

  if (!contenedorGrid) {
    console.error('Error: No existe el contenedor #disenos-grid-dinamico en el HTML.');
    return;
  }

  // Petición al JSON
  try {
    const respuesta = await fetch(rutaJson);
    if (!respuesta.ok) throw new Error(`HTTP Error status: ${respuesta.status}`);

    const datos = await respuesta.json();
    const franquicia = datos[idFranquicia];

    if (!franquicia) {
      console.warn(`No se encontró la clave "${idFranquicia}" dentro de ${rutaJson}`);
      contenedorGrid.innerHTML = '<p class="sin-disenos">No hay diseños disponibles para esta colección.</p>';
      return;
    }

    // Inyectar tarjetas dinámicamente
    contenedorGrid.innerHTML = '';
    franquicia.fotos.forEach(foto => {
      contenedorGrid.innerHTML += `
        <article class="diseno-card" style="cursor: pointer;" onclick="abrirVisor('${foto.src}', '${foto.titulo}', '${franquicia.categoria}')">
          <div class="diseno-img">
            <img src="${foto.src}" alt="${foto.titulo}" loading="lazy">
          </div>
          <div class="diseno-info">
            <h3>${foto.titulo}</h3>
            <span>Ver detalle</span>
          </div>
        </article>
      `;
    });

  } catch (error) {
    console.error('Error al cargar la colección:', error);
    contenedorGrid.innerHTML = '<p class="error-carga">Error al cargar los productos. Asegúrate de ejecutar el proyecto mediante Live Server.</p>';
  }
}

// 2. VISOR MODAL (Ampliar imagen en pantalla completa)
function abrirVisor(rutaImg, titulo, categoria) {
  const modal = document.getElementById('modal-visor');
  const img = document.getElementById('modal-img');
  const txtTitulo = document.getElementById('modal-titulo');
  const txtCat = document.getElementById('modal-cat');
  const btnWa = document.getElementById('modal-btn-wa');

  if (!modal) return;

  if (img) img.src = rutaImg;
  if (txtTitulo) txtTitulo.textContent = titulo;
  if (txtCat) txtCat.textContent = categoria;

  if (btnWa) {
    const mensaje = encodeURIComponent(`¡Hola EO Studio! Me interesa el diseño "${titulo}" de la categoría ${categoria}.`);
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

// 3. BUSCADOR GENERAL (Busca en portadas y en imágenes de la grilla)
document.addEventListener('DOMContentLoaded', function () {
  const buscador = document.getElementById('buscador');
  const contador = document.getElementById('contador-num');
  const sinResultados = document.getElementById('sin-resultados');

  if (buscador) {
    buscador.addEventListener('input', function () {
      const texto = buscador.value.trim().toLowerCase();
      // Detecta tanto las tarjetas de portadas como las fotos sueltas de la grilla
      const items = Array.from(document.querySelectorAll('.diseno-card, .disenos-grid img'));
      let visibles = 0;

      items.forEach(function (item) {
        const titulo = (item.querySelector('h3')?.textContent || item.alt || '').toLowerCase();
        const visible = texto === '' || titulo.includes(texto);

        item.style.display = visible ? '' : 'none';
        if (visible) visibles++;
      });

      if (contador) contador.textContent = visibles;
      if (sinResultados) sinResultados.style.display = (visibles === 0 && texto !== '') ? 'block' : 'none';
    });
  }
});