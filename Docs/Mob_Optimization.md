# Performance & Accessibility Fix Plan — bigbites.vercel.app

**Source audit:** PageSpeed Insights / Lighthouse 13.4.1, Moto G Power emulation, Slow 4G throttling, captured Sep 4, 2026
**Current scores:** Performance 64 · Accessibility 88 · Best Practices 92 · SEO 100 · Agentic Browsing 0/2

## Baseline metrics vs. target

| Metric | Current | "Good" threshold | Status |
|---|---|---|---|
| LCP (Largest Contentful Paint) | 8.1 s | < 2.5 s | 🔴 Critical — main driver of the low score |
| FCP (First Contentful Paint) | 2.9 s | < 1.8 s | 🟡 Needs work |
| SI (Speed Index) | 3.6 s | < 3.4 s | 🟡 Close |
| CLS (Cumulative Layout Shift) | 0.113 | < 0.1 | 🟡 Just over — cheap fix |
| TBT (Total Blocking Time) | 140 ms | < 200 ms | 🟢 Already fine |

LCP is the dominant problem, so sections 1–4 below (images, third-party JS, CSS/JS bundles, caching) are ordered by expected LCP impact. Sections 5–7 cover CLS, accessibility, and security, which are smaller but still scored.

> **Note for the implementing agent:** this plan was built from the Lighthouse HTML snippets in the audit, not from the live source tree. Selectors/paths below (class names, IDs, `./assets/...` paths) are taken directly from the report — locate the corresponding markup in the actual template files (likely `index.html` plus `css/style.bundle.css`, `js/script.bundle.js`, `js/loader.js`, and a `vercel.json`) before editing.

---

## 1. Images — biggest single win (~406 KiB, also fixes CLS + an aspect-ratio bug)

Nearly every image on the page is shipped far larger than its rendered size — several category icons ship a 300–500px source for a 66×66px circle, and the App Store/Google Play badges ship a 2172×724 source for a 120×40px slot.

- [ ] Generate a properly-sized (and a 2x/retina) AVIF variant for each image below, add `srcset`/`sizes`, and add explicit `width`/`height` attributes matching the **rendered** size.

| Image (path) | Shipped | Displayed | Est. savings |
|---|---|---|---|
| `./assets/gallery/gallery-1.avif` | 465×567 | 184×224 | 45.6 KiB |
| `./assets/gallery/gallery-5.avif` | 552×550 | 184×183 | 35.2 KiB |
| `./assets/gallery/gallery-2.avif` | 465×581 | 184×229 | 28.8 KiB |
| `./assets/images/appstore-btn.avif` | 2172×724 | 120×40 | 27.2 KiB |
| `./assets/images/playstore-btn.avif` | 2172×724 | 120×40 | 27.2 KiB |
| `./assets/images/offer-1.avif` | 678×376 | 485×228 | 24.3 KiB |
| `./assets/images/hero-768w.avif` | 768×384 | 396×198 | 22.9 KiB |
| `./assets/images/cheese-fries.avif` | 500×500 | 66×66 | 19.1 KiB |
| `./assets/images/chicken-pizza.avif` | 400×400 | 182×182 | 18.6 KiB |
| `./assets/gallery/gallery-4.avif` | 384×536 | 184×256 | 18.5 KiB |
| `./assets/images/special-pizza.avif` | 400×400 | 182×182 | 17.7 KiB |
| `./assets/images/crown-bigbites-pizza.avif` | 400×400 | 182×182 | 16.4 KiB |
| `./assets/images/combo-2.avif` | 300×300 | 182×182 | 14.3 KiB |
| `./assets/images/roll-1.avif` | 400×400 | 66×66 | 13.7 KiB |
| `./assets/images/app-install.avif` | 600×282 | 380×179 | 13.1 KiB |
| `./assets/images/burger-1.avif` | 300×300 | 66×66 | 12.3 KiB |
| `./assets/images/combo-1.avif` | 300×300 | 182×182 | 11.0 KiB |
| `./assets/images/burger-4.avif` | 300×300 | 182×182 | 9.6 KiB |
| `./assets/images/burger-5.avif` | 300×300 | 182×182 | 9.6 KiB |
| `./assets/images/burger-3.avif` | 300×300 | 182×182 | 7.9 KiB |
| `./assets/images/mountain-dew.avif` | 300×300 | 66×66 | 7.6 KiB |
| `./assets/images/logo.avif` | 200×200 | 120×120 | 5.6 KiB |

**Highest ratio, do these first:** the category-circle icons (`cheese-fries`, `roll-1`, `burger-1`, `mountain-dew`) are shipping 300–500px images into 66×66px circles — a 5–8x oversize for a tiny thumbnail. The App Store/Google Play badges are the single worst offender (2172×724 → 120×40).

Pattern to apply (example for a gallery image):
```html
<img
  src="./assets/gallery/gallery-1-400w.avif"
  srcset="./assets/gallery/gallery-1-200w.avif 200w,
          ./assets/gallery/gallery-1-400w.avif 400w"
  sizes="(max-width: 480px) 184px, 400px"
  width="184" height="224"
  loading="lazy" decoding="async"
  alt="Gallery"
  class="lightbox-trigger">
```
For the category icons and badges, a single correctly-sized file (no srcset needed) is enough — generate one export at ~2x the rendered box size and stop there.

### 1a. Missing explicit width/height (fixes the CLS-causing images specifically)
- [ ] `App Store` button `<img>`
- [ ] `Google Play` button `<img>`
- [ ] `App install` modal `<img>` (`id="app-install-modal-img"` context)
- [ ] Header logo `<img class="header-logo">`
- [ ] Footer logo `<img class="footer-logo-img">`

Add `width`/`height` attributes matching the CSS-rendered size, or fix via CSS:
```css
.header-logo, .footer-logo-img { aspect-ratio: 1 / 1; height: 40px; width: auto; }
```

### 1b. Fix distorted hero images (Best Practices flag)
`Hero 2` (`offer-1-768w.avif`) and `Hero 3` (`offer-2-768w.avif`) are displayed at 396×198 (2.00 ratio) but the shipped asset is 768×360 (2.13 ratio) — the browser is stretching them slightly out of proportion.
- [ ] Re-crop the `-480w`/`-768w` hero variants to a true 2:1 ratio, **or** correct the `width`/`height` attributes so they match the asset's real ratio.
- [ ] Note: `Hero 3` appears twice in the DOM (once with class `clone`) — likely an infinite-scroll clone; fix both instances.

---

## 2. Third-party JavaScript — Google Maps (228 KiB of 405 KiB is unused on load)

`places.js`, `main.js`, `init_embed.js`, `common.js`, `util.js`, `controls.js`, and `map.js` (from `maps.googleapis.com` / `maps.gstatic.com`) are loading on initial page load — 405.3 KiB transferred, 228.2 KiB of it unused for a typical visit. This is very likely tied to the delivery-location picker (`#btn-use-location`, `#loc-delivery-trigger`), not something needed for first paint.

- [ ] Load the Maps JS API on demand instead of on page load:
```js
let mapsLoadingPromise = null;
function loadGoogleMaps() {
  if (mapsLoadingPromise) return mapsLoadingPromise;
  mapsLoadingPromise = new Promise((resolve) => {
    window.__onMapsReady = resolve;
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&loading=async&callback=__onMapsReady';
    s.async = true;
    document.head.appendChild(s);
  });
  return mapsLoadingPromise;
}

document.getElementById('btn-use-location')?.addEventListener('click', async () => {
  await loadGoogleMaps();
  initDeliveryMap();
});
document.getElementById('loc-delivery-trigger')?.addEventListener('click', async () => {
  await loadGoogleMaps();
  initDeliveryMap();
});
```
- [ ] If a map is visible on the page without a click (e.g. embedded), replace the JS SDK with a lightweight `google.com/maps/embed` `<iframe loading="lazy">` or a static map image, and only upgrade to the full SDK if/when the user interacts with it.

---

## 3. CSS/JS bundle hygiene (~40 KiB, plus faster parse/render)

- [ ] **Minify** `css/style.bundle.css?v=16` (~36 KiB, 11 KiB saved) — the "bundle" naming implies a build step exists but isn't minifying output; check the build config (add `cssnano` or `lightningcss`).
- [ ] **Remove unused CSS** from the same file (~22 KiB unused on this page) — likely rules for the menu/gallery pages bundled in with the homepage. Consider splitting CSS per route, or generating a critical/above-the-fold CSS subset for the homepage.
- [ ] **Minify** `js/script.bundle.js` (3.7 KiB saved) and `js/loader.js?v=11` (3.1 KiB saved) — add `esbuild`/`terser` to the build.
- [ ] Ensure `script.bundle.js` has `defer` (if not already) and that `loader.js` isn't blocking first paint.

---

## 4. Caching headers (~12 KiB on repeat visits, bigger win for return traffic)

Since this deploys on Vercel, add long-lived immutable caching for static assets via `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/css/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/js/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- [ ] Add the block above (merge with any existing `vercel.json`).
- [ ] Confirm `style.bundle.css?v=16` and `loader.js?v=11` bump their `?v=` query string whenever content changes — that's what makes `immutable` caching safe with these query-busted filenames.

---

## 5. Main-thread work & animations (TBT is already fine at 140ms, but there's headroom)

- [ ] **6 long tasks found** — audit `script.bundle.js` for synchronous init work on load (gallery/lightbox setup, review carousel, modal wiring are the likely culprits). Wrap non-critical init in `requestIdleCallback()` or defer it slightly with `setTimeout(fn, 0)` after `DOMContentLoaded`.
- [ ] **2 non-composited animations found** — these are almost certainly animating a layout-triggering property (`top`/`left`/`width`/`height`) instead of `transform`/`opacity`. Likely candidates: modal open/close transitions, gallery carousel. Switch to `transform: translate()` / `opacity`, add `will-change` only where actually animating.

---

## 6. Accessibility (88 → also clears both failing Agentic Browsing checks)

### 6a. Icon button needs an accessible name
```html
<!-- before -->
<button class="icon-btn" onclick="document.getElementById('app-install-modal').classList.remove('active');" ...>×</button>

<!-- after -->
<button class="icon-btn" aria-label="Close" onclick="...">×</button>
```
- [ ] Fix the close button inside `#app-install-modal`.

### 6b. Dialogs need accessible names
Affects `#delivery-info-modal`, `#demo-modal`, `#about-demo-modal`. Point `aria-labelledby` at each modal's own heading:
```html
<div class="modal-overlay" id="delivery-info-modal" role="dialog" aria-modal="true" aria-labelledby="delivery-info-title">
  ...
  <h2 id="delivery-info-title">Delivery & Pickup Info</h2>
```
- [ ] `#delivery-info-modal` → label from "Delivery & Pickup Info" heading
- [ ] `#demo-modal` → label from "Restaurant Management Dashboard" heading
- [ ] `#about-demo-modal` → label from "About This Demo" heading

### 6c. Color contrast (systemic — several components affected)
Failing elements span multiple components, which suggests a shared muted-text or button color that's too light:
- `.card-desc` (product/combo descriptions on every menu card)
- `.btn.btn-primary` ("Add" buttons, "View Full Menu" link)
- `.btn.btn-outline` ("View Full Gallery" link)
- `.review-timestamp`, `.review-card` text
- Location picker: `.loc-tab-active` ("Delivery" tab), `#btn-use-location` ("Detect My Location"), `#loc-delivery-trigger-text`, `.loc-trigger-bar`/`#loc-delivery-trigger`

- [ ] Pull the actual computed colors for each class above and check against WCAG AA (4.5:1 for normal text, 3:1 for large text/UI components) with a contrast checker. This usually means darkening a light-gray secondary text color (e.g. `#999` → `#5a5a5a` or darker on white) and confirming button text has enough contrast against its specific brand background color.

### 6d. Video: broken resource + missing captions
- [ ] `gallery-1.mp4` returns a **404** (also logged as a console error under Best Practices) — fix the file path/deployment first.
- [ ] Once fixed, add a captions track:
```html
<video controls>
  <source src="assets/gallery/gallery-1.mp4" type="video/mp4">
  <track kind="captions" src="assets/gallery/gallery-1.en.vtt" srclang="en" label="English">
</video>
```

---

## 7. Security headers (Best Practices — currently unaddressed, not yet scored against)

- [ ] Add CSP, COOP, and clickjacking protection via the same `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https:; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://maps.googleapis.com" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
      ]
    }
  ]
}
```
- [ ] Tighten the CSP `script-src`/`connect-src` once you confirm the full list of third-party origins actually called (Maps is the only one visible in this report).
- [ ] Trusted Types (DOM-XSS mitigation) is a larger refactor — treat as a follow-up, not part of this pass.

---

## Not detailed in the audit output (re-check after the fixes above)
The report flagged these as insights but didn't expand the underlying detail in this capture — re-run Lighthouse/DevTools Performance panel after sections 1–4 to see if they're still flagged:
- Layout shift culprits
- Forced reflow
- Network dependency tree
- LCP breakdown
- 3rd parties (breakdown)
- Optimize DOM size

Also low-priority/informational: SEO's only open item is "Structured data is valid" under manual checks (not a failure — just run a structured-data validator to confirm); Best Practices' "Baseline Features" browser-compatibility check showed no failing detail.

---

## Implementation order (highest ROI first)

1. **Images** — sizing + `width`/`height` attrs (§1) — biggest LCP + CLS win, no backend changes
2. **Lazy-load Google Maps** (§2) — second-biggest LCP win
3. **Minify + trim unused CSS/JS** (§3)
4. **Caching headers** (§4) — one `vercel.json` edit
5. **Accessibility fixes** (§6) — also clears both Agentic Browsing failures
6. **Main-thread/animation cleanup** (§5)
7. **Fix broken video + captions** (§6d)
8. **Security headers** (§7)

## Definition of done
- [ ] LCP < 2.5s, CLS < 0.1 on a re-run PageSpeed Insights mobile test
- [ ] Performance score ≥ 90
- [ ] Accessibility score 100
- [ ] Agentic Browsing 2/2
- [ ] No console errors (404s cleared)

Re-run PageSpeed Insights after steps 1–2 alone — that should already move LCP from 8.1s into a much healthier range before touching anything else.