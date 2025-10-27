// script.js - versión actualizada para navegación por páginas individuales
// - searchToggle muestra/oculta collapse con campo de búsqueda (globalSearch) y filtros.
// - búsqueda acepta texto y filtros combinados (data-brand, data-color, data-price).
// - cada tarjeta es un enlace normal a product-#.html (no modal).
// - mantiene conteo de resultados.

document.addEventListener('DOMContentLoaded', ()=> {
  const searchToggle = document.getElementById('searchToggle');
  const filtersRow = document.getElementById('filtersRow');
  const collapseFilters = new bootstrap.Collapse(filtersRow, { toggle: false });
  const globalSearch = document.getElementById('globalSearch');
  const filterBrand = document.getElementById('filter-brand');
  const filterColor = document.getElementById('filter-color');
  const filterPrice = document.getElementById('filter-price');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const countEl = document.getElementById('result-count');

  // product columns
  const productCols = Array.from(document.querySelectorAll('.product-col'));

  // Toggle filters/search area
  searchToggle.addEventListener('click', ()=> {
    const expanded = searchToggle.getAttribute('aria-expanded') === 'true';
    searchToggle.setAttribute('aria-expanded', String(!expanded));
    collapseFilters.toggle();
    if(!expanded){
      setTimeout(()=> { globalSearch.focus(); }, 200);
    }
  });

  // Filtering logic (text + selects)
  function applyFilters(){
    const q = (globalSearch && globalSearch.value.trim().toLowerCase()) || '';
    const brand = filterBrand.value;
    const color = filterColor.value;
    const price = filterPrice.value;

    productCols.forEach(col => {
      const title = (col.querySelector('.card-title')?.textContent || '').toLowerCase();
      const caption = (col.querySelector('.card-body p')?.textContent || '').toLowerCase();
      const matchesText = !q || title.includes(q) || caption.includes(q) || col.dataset.brand.toLowerCase().includes(q);

      const matchesBrand = !brand || col.dataset.brand === brand;
      const matchesColor = !color || col.dataset.color === color;

      let matchesPrice = true;
      if(price){
        const p = Number(col.dataset.price || 0);
        if(price === '0-1000') matchesPrice = p <= 1000;
        if(price === '1000-5000') matchesPrice = p > 1000 && p <= 5000;
        if(price === '5000+') matchesPrice = p > 5000;
      }

      const show = matchesText && matchesBrand && matchesColor && matchesPrice;
      col.hidden = !show;
    });

    updateCount();
  }

  function updateCount(){
    const visibleCount = productCols.filter(col => !col.hidden && col.offsetParent !== null).length;
    countEl.textContent = `${visibleCount} Guitarras en nuestra colección`;
  }

  // Bind events
  [globalSearch].forEach(el => el && el.addEventListener('input', applyFilters));
  [filterBrand, filterColor, filterPrice].forEach(sel => sel && sel.addEventListener('change', applyFilters));
  clearFiltersBtn.addEventListener('click', ()=> {
    if(globalSearch) globalSearch.value='';
    filterBrand.value='';
    filterColor.value='';
    filterPrice.value='';
    applyFilters();
  });

  // Initial count
  updateCount();

  // Accessibility: allow Enter in search to move focus back to results
  if(globalSearch){
    globalSearch.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        // move focus to first visible product link
        const firstVisible = document.querySelector('.product-col:not([hidden]) .stretched-link');
        if(firstVisible){
          e.preventDefault();
          firstVisible.focus();
        }
      }
    });
  }
});