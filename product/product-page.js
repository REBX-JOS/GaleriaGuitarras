// product-page.js (actualizado)

document.addEventListener('DOMContentLoaded', () => {
  // Main carousel thumbnails
  const carouselEl = document.getElementById('productCarousel');
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  thumbs.forEach((t, i) => {
    t.setAttribute('tabindex', '0');
    t.addEventListener('click', () => {
      const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
      carousel.to(i);
      thumbs.forEach(tt => tt.style.borderColor = 'transparent');
      t.style.borderColor = '#222';
    });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); }
    });
  });

  // Elementos del DOM relevantes
  const summaryArea = document.getElementById('summaryArea');
  const tabsArea = document.getElementById('tabsArea');
  const detailsTrigger = document.getElementById('detailsTrigger');
  const productBlock = document.getElementById('productBlock');

  // tabs en la vista breve (superiores) que abren la vista de tabs completa
  const topSpecTab = document.getElementById('spec-tab');
  const topDescTab = document.getElementById('desc-tab');

  // tabs dentro de tabsArea
  const detailsDescTab = document.getElementById('tab-desc');
  const detailsSpecTab = document.getElementById('tab-spec');

  // "Introducción" trigger (ahora restaura la vista previa)
  const introTrigger = document.getElementById('introTrigger');

  // Mostrar área de pestañas (oculta price/intro). No toca el título.
  function showTabsArea(activateSpec = false) {
    // Hide summary (precio + intro corto)
    summaryArea.classList.add('d-none');

    // Show tabs area
    tabsArea.classList.remove('d-none');
    tabsArea.setAttribute('aria-hidden', 'false');

    productBlock.classList.add('details-open'); // rotación visual de la flecha

    // Activar la pestaña solicitada
    const targetTab = activateSpec ? detailsSpecTab : detailsDescTab;
    const bsTab = new bootstrap.Tab(targetTab);
    bsTab.show();

    // Scroll suave al inicio del área de tabs
    setTimeout(() => {
      tabsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  // Restaurar resumen (muestra price y texto corto otra vez)
  function restoreSummaryArea() {
    // Hide tabs area and show summary
    tabsArea.classList.add('d-none');
    tabsArea.setAttribute('aria-hidden', 'true');

    summaryArea.classList.remove('d-none');

    productBlock.classList.remove('details-open');

    // Scroll suave para volver al resumen
    setTimeout(() => {
      summaryArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  // Bind: detalles (flecha) muestra tabs
  detailsTrigger.addEventListener('click', (e) => {
    showTabsArea(false);
  });
  detailsTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); detailsTrigger.click(); }
  });

  // Si el usuario pulsa la pestaña superior "Especificaciones" en la vista corta,
  // abrimos la vista completa y activamos Especificaciones.
  if (topSpecTab) {
    topSpecTab.addEventListener('click', (e) => {
      e.preventDefault();
      showTabsArea(true);
    });
  }
  if (topDescTab) {
    topDescTab.addEventListener('click', (e) => {
      e.preventDefault();
      showTabsArea(false);
    });
  }

  //IntroTrigger ahora restaura el resumen en lugar de abrir un panel.
  if (introTrigger) {
    introTrigger.addEventListener('click', (e) => {
      // Si ya estamos en la vista de tabs, restauramos el resumen
      restoreSummaryArea();
    });
    introTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); introTrigger.click(); }
    });
  }

  // Nota: no se implementa aquí "volver al historial" (botón Back),
  // la navegación continúa siendo a nivel de UI sin modificar el history.
});