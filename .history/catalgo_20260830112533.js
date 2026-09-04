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