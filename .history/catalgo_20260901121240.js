document.addEventListener('DOMContentLoaded', function () {
  const cards = Array.from(document.querySelectorAll('.diseno-card'));
  const buscador = document.getElementById('buscador');
  const contador = document.getElementById('contador-num');
  const sinResultados = document.getElementById('sin-resultados');
  const grid = document.getElementById('disenos-grid');

  const estado = { tecnica: 'todas', categoria: 'todas', texto: '' };

  // Botones de chips (técnica y categoría)
  document.querySelectorAll('.filtro-chips').forEach(function (grupo) {
    const nombreGrupo = grupo.dataset.filterGroup;
    grupo.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        grupo.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        estado[nombreGrupo] = chip.dataset.value;
        aplicarFiltros();
      });
    });
  });

  // Buscador de texto
  buscador.addEventListener('input', function () {
    estado.texto = buscador.value.trim().toLowerCase();
    aplicarFiltros();
  });

  function aplicarFiltros() {
    let visibles = 0;

    cards.forEach(function (card) {
      const tecnicas = card.dataset.tecnica.split(' ');
      const categoria = card.dataset.categoria;
      const nombre = card.dataset.nombre;

      const pasaTecnica = estado.tecnica === 'todas' || tecnicas.includes(estado.tecnica);
      const pasaCategoria = estado.categoria === 'todas' || categoria === estado.categoria;
      const pasaTexto = estado.texto === '' || nombre.includes(estado.texto);

      const visible = pasaTecnica && pasaCategoria && pasaTexto;
      card.style.display = visible ? '' : 'none';
      if (visible) visibles++;
    });

    contador.textContent = visibles;
    sinResultados.hidden = visibles !== 0;
    grid.style.display = visibles === 0 ? 'none' : 'grid';
  }
});

// ===== FUNCIONES ADICIONALES PARA  COLECCIONES =====

// 1. ABRIR Y CERRAR COLECCIONES (Navegación de 2 capas)
function abrirColeccion(idFranquicia, nombreFranquicia) {
  const vistaFranquicias = document.getElementById('vista-franquicias');
  const vistaGaleria = document.getElementById('vista-galeria-disenos');
  const titulo = document.getElementById('titulo-franquicia-activa');

  if (vistaFranquicias) vistaFranquicias.style.display = 'none';
  if (vistaGaleria) vistaGaleria.style.display = 'block';
  if (titulo) titulo.textContent = nombreFranquicia;
  
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