/** purgecss.config.js — bigbites
 *  Removes unused CSS from style.bundle.css.
 *  Run: node purgecss.config.js
 *  The safelist preserves all JS-toggled classes that don't appear in static HTML.
 */
const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const CleanCSS = require('clean-css');

(async () => {
  const result = await new PurgeCSS().purge({
    content: [
      // All HTML pages
      './index.html',
      './pages/*.html',
      './dashboard/index.html',
      // All JS (loader injects classes dynamically)
      './assets/js/loader.js',
      './assets/js/script.bundle.js',
      './assets/js/search.js',
      './assets/js/config.js',
      './assets/js/menu-data.js',
    ],
    css: ['./assets/css/style.bundle.css'],
    // Safelist: classes toggled by JS that won't appear literally in static HTML
    safelist: {
      standard: [
        // Theme
        'dark-mode',
        // Search overlay
        'search-active',
        'search-open',
        // Sticky navbar
        'is-sticky',
        'sticky',
        // Active / selected states
        'active',
        // Loading / asset states
        'is-loaded',
        'loaded',
        // Page loader
        'page-loader',
        'loader-logo',
        'loader-bar-track',
        'loader-bar-fill',
        'loader-spinner',
        // Modals
        'modal-open',
        'modal-active',
        'item-modal',
        'offer-modal',
        'modal-overlay',
        'modal-visible',
        'no-scroll',
        // Toast
        'toast',
        'toast-success',
        'toast-error',
        'toast-info',
        // Skeleton screens
        'product-card-skeleton',
        'sk-image',
        'sk-body',
        'sk-title',
        'sk-desc',
        'sk-desc-2',
        'sk-footer',
        'sk-price',
        'sk-btn',
        // Menu / nav states
        'menu-open',
        'nav-open',
        // Cart / checkout states
        'cart-open',
        'has-items',
        // Category
        'category-btn',
        'category-circle-btn',
        'circle-img',
        'circle-label',
        'category-circles-wrapper',
        'category-sticky-wrapper',
        // Hero / carousel
        'hero-full-img',
        'hero-image-frame',
        'hero-carousel-track',
        'carousel-indicators',
        'indicator',
        // Card
        'product-card',
        'card-image',
        'card-content',
        'card-header',
        'card-desc',
        'card-footer',
        // Buttons
        'btn',
        'btn-primary',
        // Misc dynamic
        'open',
        'closed',
        'hidden',
        'visible',
        'show',
        'hide',
        'expanded',
        'collapsed',
        'disabled',
        'selected',
        'checked',
        'error',
        'success',
        'warning',
        'info',
        // Grab cursor (JS carousel)
        'grabbing',
        'grab',
      ],
      // Regex patterns — covers all variants of toggled classes
      greedy: [
        /^dark-mode/,
        /^is-/,
        /^has-/,
        /^menu-/,
        /^nav-/,
        /^modal/,
        /^toast/,
        /^sk-/,
        /^hero/,
        /^loader/,
        /^category/,
        /^product-card/,
        /^search/,
        /^cart/,
        /^order/,
        /^page-/,
        /^btn/,
        /^card-/,
        /^circle/,
        /^indicator/,
      ],
    },
  });

  if (!result || !result[0]) {
    console.error('PurgeCSS returned no result');
    process.exit(1);
  }

  const purgedCss = result[0].css;
  const origSize = fs.statSync('./assets/css/style.bundle.css').size;
  const purgedSize = Buffer.byteLength(purgedCss, 'utf8');
  console.log(`Original:  ${(origSize / 1024).toFixed(1)} KiB`);
  console.log(`Purged:    ${(purgedSize / 1024).toFixed(1)} KiB`);
  console.log(`Removed:   ${((origSize - purgedSize) / 1024).toFixed(1)} KiB (${Math.round((1 - purgedSize / origSize) * 100)}%)`);

  // Write purged (unminified) back to style.bundle.css
  fs.writeFileSync('./assets/css/style.bundle.css', purgedCss, 'utf8');
  console.log('Written: assets/css/style.bundle.css');

  // Minify => style.bundle.min.css
  const minified = new CleanCSS({ level: 2 }).minify(purgedCss);
  if (minified.errors && minified.errors.length) {
    console.error('CleanCSS errors:', minified.errors);
    process.exit(1);
  }
  fs.writeFileSync('./assets/css/style.bundle.min.css', minified.styles, 'utf8');
  const minSize = Buffer.byteLength(minified.styles, 'utf8');
  console.log(`Minified:  ${(minSize / 1024).toFixed(1)} KiB`);
  console.log('Written: assets/css/style.bundle.min.css');
})();
