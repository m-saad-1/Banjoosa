/* ==========================================================================
   banjoosa - Smart Search
   Reads menu items from the DOM, shows results in a floating overlay.
   Does NOT alter or scroll the underlying page.
   ========================================================================== */

(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────────────────────── */
  let menuIndex = [];
  let overlay = null;
  let resultsGrid = null;
  let noResultsEl = null;
  let isOpen = false;

  /* ── Build Search Overlay ─────────────────────────────────────────────── */
  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'search-results-overlay';
    overlay.innerHTML = `
      <div id="search-results-panel">
        <div id="search-results-header">
          <input type="text" id="mobile-search-overlay-input" placeholder="Search menu items..." style="flex:1; border:none; background:var(--clr-background, rgba(0,0,0,0.05)); padding:0.6rem 1rem; border-radius:50px; margin-right:1rem; font-size:1rem; outline:none; color:var(--clr-text-primary, #111);">
          <button id="search-results-close" aria-label="Close search">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="search-results-body">
          <div id="search-results-grid"></div>
          <div id="search-no-results">
            <svg viewBox="0 0 24 24" width="52" height="52" stroke="#ddd" stroke-width="1.5" fill="none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>No matching items found</p>
            <span>Try a different keyword</span>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #search-results-overlay {
        position: fixed;
        inset: 0;
        z-index: 99990;
        background: rgba(0,0,0,0.45);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 90px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      #search-results-overlay.open {
        opacity: 1;
        pointer-events: all;
      }
      /* When the item-modal is open on top, keep overlay visible but hands-off */
      #search-results-overlay.item-modal-open {
        pointer-events: none;
      }
      #search-results-panel {
        background: var(--clr-surface, #fff);
        border-radius: 16px;
        width: min(720px, calc(100vw - 2rem));
        max-height: calc(100vh - 110px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        transform: translateY(-12px);
        transition: transform 0.25s ease;
      }
      #search-results-overlay.open #search-results-panel {
        transform: translateY(0);
      }
      #search-results-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid rgba(0,0,0,0.07);
        flex-shrink: 0;
      }
      #search-results-label {
        font-weight: 700;
        font-size: 1rem;
        color: var(--clr-text-primary, #111);
      }
      #search-results-close {
        background: rgba(0,0,0,0.05);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
        color: var(--clr-text-primary, #111);
      }
      #search-results-close:hover { background: rgba(0,0,0,0.1); }
      #search-results-body {
        overflow-y: auto;
        padding: 1rem 1.25rem 1.5rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      #search-results-body::-webkit-scrollbar { display: none; }
      #search-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
      #search-no-results {
        display: none;
        text-align: center;
        padding: 3rem 1rem;
        color: #aaa;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      #search-no-results p {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--clr-text-primary, #111);
        margin: 0;
      }
      #search-no-results span {
        font-size: 0.85rem;
        color: #999;
      }
      @media (max-width: 480px) {
        #search-results-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        #search-results-panel { border-radius: 16px 16px 0 0; max-height: calc(100vh - 70px); }
        #search-results-overlay { align-items: flex-end; padding-top: 0; }
      }
      .search-result-card {
        background: var(--clr-surface, #fff);
        border: 1px solid rgba(0,0,0,0.07);
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        display: flex;
        flex-direction: column;
      }
      .search-result-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      .search-result-card:active { transform: scale(0.97); }
      .src-img-wrap { width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #f5f5f5; position: relative; }
      .src-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
      .search-result-card:hover .src-img-wrap img { transform: scale(1.05); }
      .src-badge {
        position: absolute; top: 0.5rem; left: 0.5rem;
        background: var(--clr-primary, #B32121); color: #fff;
        font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem;
        border-radius: 50px; letter-spacing: 0.5px; text-transform: uppercase;
      }
      .src-content { padding: 0.65rem 0.75rem 0.75rem; flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
      .src-category { font-size: 0.65rem; font-weight: 600; color: var(--clr-primary, #B32121); text-transform: uppercase; letter-spacing: 0.5px; }
      .src-name { font-weight: 700; font-size: 0.9rem; color: var(--clr-text-primary, #111); line-height: 1.3; margin: 0; }
      .src-desc { font-size: 0.75rem; color: #777; line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .src-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.5rem; }
      .src-price { font-weight: 700; font-size: 0.95rem; color: var(--clr-text-primary, #111); }
      .src-add-btn {
        background: var(--clr-primary, #B32121); color: #fff; border: none;
        border-radius: 50px; padding: 0.3rem 0.75rem; font-size: 0.8rem;
        font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: inherit;
      }
      .src-add-btn:hover { opacity: 0.85; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    resultsGrid = overlay.querySelector('#search-results-grid');
    noResultsEl = overlay.querySelector('#search-no-results');

    overlay.querySelector('#search-results-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // If item modal is open, let it close first; search overlay stays
        const itemModal = document.getElementById('item-modal');
        if (itemModal && itemModal.classList.contains('active')) return;
        if (isOpen) closeSearch();
      }
    });
  }

  /* ── Scrape Menu Data from DOM and Merge with Static List ────────────── */
  function buildMenuIndex() {
    menuIndex = [];
    const domNames = new Set();
    const cards = document.querySelectorAll('.product-card');

    if (cards.length > 0) {
      cards.forEach(card => {
        const img = card.querySelector('.card-image img');
        const name = card.querySelector('h3');
        const desc = card.querySelector('.card-desc');
        const price = card.querySelector('.price');

        let category = 'Menu';
        const grid = card.closest('.menu-grid');
        if (grid) {
          let prev = grid.previousElementSibling;
          while (prev) {
            const h = prev.querySelector && prev.querySelector('h3');
            if (h) { category = h.textContent.trim(); break; }
            if (prev.tagName === 'H3') { category = prev.textContent.trim(); break; }
            prev = prev.previousElementSibling;
          }
        }

        const itemName = name ? name.textContent.trim() : '';
        if (itemName) domNames.add(itemName.toLowerCase());

        menuIndex.push({
          name: itemName,
          desc: desc ? desc.textContent.trim() : '',
          price: price ? price.textContent.trim() : '',
          img: img ? img.src : '',
          imgAlt: img ? img.alt : '',
          category,
          originalCard: card,
        });
      });
    }

    let staticMenu = [];
    if (window.Store && window.Store.state && window.Store.state.products) {
      window.Store.state.products.forEach(p => {
        let catName = 'Menu';
        if (window.Store.state.categories) {
          const cat = window.Store.state.categories.find(c => c.id === p.categoryId);
          if (cat) catName = cat.name;
        }
        let imgSrc = p.image;
        if (imgSrc.startsWith('../')) {
           imgSrc = imgSrc.substring(3);
        }
        
        staticMenu.push({
          name: p.name,
          desc: p.desc || '',
          price: 'Rs ' + p.price,
          img: imgSrc,
          imgAlt: p.name,
          category: catName
        });
      });
    } else if (window.BANJOOSA_MENU && window.BANJOOSA_MENU.length > 0) {
      staticMenu = window.BANJOOSA_MENU;
    }

    staticMenu.forEach(item => {
      if (!domNames.has(item.name.toLowerCase())) {
        menuIndex.push({ ...item, isStatic: true });
      }
    });
  }

  /* ── Open Item Modal Directly (no navigation needed) ─────────────────── */
  function openItemModalFromSearch(item) {
    const itemModal = document.getElementById('item-modal');
    if (!itemModal || typeof window.openItemModalWithData !== 'function') return false;

    // Use the exact same logic as the Homepage menu modal
    window.openItemModalWithData(item.originalCard || null, item);

    // Keep search overlay visible but non-interactive while item modal sits above it
    overlay.classList.add('item-modal-open');

    // Ensure item-modal stacks above the search overlay
    itemModal.style.zIndex = '100000';

    // Watch for item modal losing 'active' class → restore search overlay
    const obs = new MutationObserver(() => {
      if (!itemModal.classList.contains('active')) {
        obs.disconnect();
        itemModal.style.zIndex = '';
        overlay.classList.remove('item-modal-open');
        // Body scroll remains locked because search overlay is still open
        if (isOpen) {
          void 0;
        }
      }
    });
    obs.observe(itemModal, { attributes: true, attributeFilter: ['class'] });

    return true;
  }

  /* ── Render Results ────────────────────────────────────────────────────── */
  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) { closeSearch(); return; }

    const matches = menuIndex.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );

    resultsGrid.innerHTML = '';

    if (matches.length === 0) {
      noResultsEl.style.display = 'flex';
      resultsGrid.style.display = 'none';
    } else {
      noResultsEl.style.display = 'none';
      resultsGrid.style.display = 'grid';

      matches.forEach(item => {
        const card = document.createElement('div');
        card.className = 'search-result-card';

        // Fix image paths for static items when viewed from subdirectories
        let imgSrc = item.img;
        if (item.isStatic && window.location.pathname.includes('/pages/')) {
          imgSrc = '../' + item.img;
        }

        card.innerHTML = `
          <div class="src-img-wrap">
            <img src="${imgSrc}" alt="${item.imgAlt}" loading="lazy" decoding="async">
          </div>
          <div class="src-content">
            <span class="src-category">${item.category}</span>
            <h3 class="src-name">${item.name}</h3>
            ${item.desc ? `<p class="src-desc">${item.desc}</p>` : ''}
            <div class="src-footer">
              <span class="src-price">${item.price}</span>
              <button class="src-add-btn">View</button>
            </div>
          </div>
        `;

        card.addEventListener('click', (e) => {
          e.stopPropagation();

          // Always try to open the item-modal directly on the current page
          if (openItemModalFromSearch(item)) {
            // Success: search overlay stays open in background, item modal is on top
            return;
          }

          // Fallback: item-modal not in DOM yet — try clicking original DOM card
          if (item.originalCard) {
            item.originalCard.click();
            return;
          }

          // Last resort for static items: navigate (keeps original cross-page behavior)
          const rootPath = window.location.pathname.includes('/pages/') ? '../' : './';
          window.location.href = `${rootPath}index.html?search=${encodeURIComponent(item.name)}`;
        });

        resultsGrid.appendChild(card);
      });
    }

    const label = overlay.querySelector('#search-results-label');
    label.textContent = matches.length > 0
      ? `${matches.length} result${matches.length !== 1 ? 's' : ''} for "${query}"`
      : `No results for "${query}"`;

    openSearch();
  }

  /* ── Open / Close ──────────────────────────────────────────────────────── */
  window.openSearchModal = function() {
    openSearch();
    const overlayInput = document.getElementById('mobile-search-overlay-input');
    if (overlayInput) {
       setTimeout(() => overlayInput.focus(), 100);
    }
  };

  function openSearch() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.remove('item-modal-open');
    overlay.classList.add('open');
    void 0;
    history.pushState({ searchOpen: true }, "");
  }

  function closeSearch() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('open', 'item-modal-open');
    void 0;
    
    const inputs = document.querySelectorAll('#desktop-search-input, #mobile-search-overlay-input');
    inputs.forEach(inp => { inp.value = ''; });
    resultsGrid.innerHTML = '';
    
    if (history.state && history.state.searchOpen) {
      history.back();
    }
  }

  window.addEventListener("popstate", (ev) => {
    if (isOpen && (!ev.state || !ev.state.searchOpen)) {
      isOpen = false;
      overlay.classList.remove('open', 'item-modal-open');
      void 0;
      const inputs = document.querySelectorAll('#desktop-search-input, #mobile-search-overlay-input');
      inputs.forEach(inp => { inp.value = ''; });
      resultsGrid.innerHTML = '';
    }
  });

  /* ── Intercept old script.bundle.js search to stop it hiding cards ─────── */
  function interceptOldSearch() {
    const tryIntercept = () => {
      const inp = document.getElementById('desktop-search-input');
      if (!inp || inp.dataset.srIntercept) return false;
      inp.dataset.srIntercept = '1';

      // Use capture=true so this runs BEFORE script.bundle.js bubble listener
      inp.addEventListener('input', (e) => {
        // Always restore background cards immediately after old handler may hide them
        requestAnimationFrame(() => {
          document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
          document.querySelectorAll('.menu-grid').forEach(g => g.style.display = '');
          // Also hide the "No dishes found" div that script.bundle.js injects
          const noRes = document.getElementById('menu-no-results');
          if (noRes) noRes.style.display = 'none';
        });
      }, true); // capturing phase

      return true;
    };

    if (!tryIntercept()) {
      const obs = new MutationObserver(() => { if (tryIntercept()) obs.disconnect(); });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ── Hook into Search Input ───────────────────────────────────────────── */
  function hookSearchInput() {
    const tryHook = () => {
      let inputs = document.querySelectorAll('#desktop-search-input');
      const overlayInput = document.getElementById('mobile-search-overlay-input');
      
      let inputsArray = Array.from(inputs);
      if (overlayInput && !inputsArray.includes(overlayInput)) {
          inputsArray.push(overlayInput);
      }
      
      if (!inputsArray.length) return false;

      inputsArray.forEach(inp => {
        if (inp.dataset.srHooked) return;
        inp.dataset.srHooked = '1';

        inp.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          if (val.length >= 1) renderResults(val);
          else closeSearch();
        });

        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            // Only close search if item modal is not open
            const itemModal = document.getElementById('item-modal');
            if (itemModal && itemModal.classList.contains('active')) return;
            closeSearch();
          }
        });
      });
      return true;
    };

    if (!tryHook()) {
      const obs = new MutationObserver(() => { if (tryHook()) obs.disconnect(); });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  function init() {
    buildOverlay();
    hookSearchInput();
    interceptOldSearch();

    const buildIndex = () => {
      buildMenuIndex();
      const menuSection = document.querySelector('#cardapio, #menu-section, main');
      if (menuSection) {
        const obs = new MutationObserver(() => buildMenuIndex());
        obs.observe(menuSection, { childList: true, subtree: true });
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(buildIndex, { timeout: 1500 });
    } else {
      setTimeout(buildIndex, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle cross-page search redirect (still used for bookmarked ?search= URLs)
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setTimeout(() => {
        const inputs = document.querySelectorAll('#desktop-search-input');
        if (inputs.length > 0) {
          inputs[0].value = searchQuery;
          renderResults(searchQuery);
          // Clear the url param without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 500); // Wait for menu to build
    }
  });

})();
