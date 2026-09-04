// ======================================================
// MOTOR DE GRILLAS Y VISOR MODAL (EO STUDIO)
// Para: mugs.html, gorras.html, camisetas.html, etc.
// ======================================================

// 1. NAVEGACIÓN EN 2 CAPAS + CARGA DINÁMICA DE JSON
async function abrirColeccion(idFranquicia, nombreFranquicia, rutaJson) {
  const vistaA = document.getElementById('vista-franquicias');
  const vistaB = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');
  const contenedorGrid = document.getElementById('disenos-grid-dinamico');

  if (vistaA) vistaA.style.display = 'none';
  if (vistaB) vistaB.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;

  window.scrollTo({ top: 300, behavior: 'smooth' });

  // Petición dinámica al JSON
  if (!contenedorGrid) {
    console.error('No se encontró el contenedor #disenos-grid-dinamico');
    return;
  }

  try {
    const respuesta = await fetch(rutaJson);
    if (!respuesta.ok) throw new Error(`Error al cargar ${rutaJson}`);

    const datos = await respuesta.json();
    const franquicia = datos[idFranquicia];

    if (!franquicia) {
      console.error(`No existe la clave "${idFranquicia}" en ${rutaJson}`);
      contenedorGrid.innerHTML = '<p>No se encontraron diseños para esta colección.</p>';
      return;
    }

    // Limpiar contenido previo y renderizar fotos
    contenedorGrid.innerHTML = '';
    franquicia.fotos.forEach(foto => {
      contenedorGrid.innerHTML += `
        <article class="diseno-card" onclick="abrirVisor('${foto.src}', '${foto.titulo}', '${franquicia.categoria}')">
          <img src="${foto.src}" alt="${foto.titulo}" loading="lazy">
          <h3>${foto.titulo}</h3>
        </article>
      `;
    });

  } catch (error) {
    console.error('Error procesando la colección:', error);
    contenedorGrid.innerHTML = '<p>Ocurrió un error al cargar los diseños.</p>';
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