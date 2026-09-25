# Agent Task: bigbitespk.vercel.app Performance Fixes

This site shares the same template/codebase as crustpk.vercel.app. Several issues here are ones already solved on that site — port the fix over rather than re-deriving it. One issue (the hero carousel CLS) is new.

## 1. Oversized/uncompressed images — 148.8 KiB to save

| Asset | Issue | Fix |
|---|---|---|
| `hero.avif` | 998×500 shipped for 832×347 display, plus poor compression | Resize to ~1664×694 (2x retina), recompress AVIF, add `srcset`/`sizes` — same fix already applied to crustpk's hero image |
| `burger-3.avif`, `cheese-fries.avif`, `roll-1.avif` (category-circle icons) | All shipping 400×400 for a 116×116 display, plus poor compression | Resize to ~232×232, recompress, add `srcset` — identical bug already fixed on crustpk's category icons; copy that fix |
| `app-install.avif` | Compression only (no resize needed) | Recompress at a lower AVIF quality setting |

## 2. CLS = 0.639, 100% from the hero carousel container (new issue)

```
bigbites Hero 3
<div class="hero-image-frame loaded" id="hero-carousel-container" style="...width: 100%...">
0.639
```

The carousel container itself is resizing after load — almost certainly because its height isn't reserved until a slide image finishes loading and the JS then sets/adjusts the container's dimensions.

- [ ] Give `#hero-carousel-container` a fixed `aspect-ratio` (matching the hero image's real ratio, e.g. `aspect-ratio: 1200/500`) or an explicit `height` in CSS **before** any JS runs, so the space is reserved from first paint regardless of when the carousel JS initializes.
- [ ] Don't let the carousel script set `height`/`width` on this container dynamically after images load — that's what's causing the shift.

## 3. LCP element is lazy-loaded (same bug class as crustpk's "Combo 1" issue)

```
LCP resources should not use loading=lazy   ← FAILING
Offer Image  <img ... loading="lazy" ... id="offer-modal-img" src="./assets/images/offer-1.avif" ...>
```

The LCP element on this run is the **offer modal's image** — which is suspicious on its own: a modal image shouldn't normally be the largest visible content unless the modal is opening automatically on load (this is the exact same auto-popup pattern chased down on crustpk).

- [ ] Check whether this offer modal auto-opens on page load. If yes, that's the real thing to fix — an unprompted modal covering the screen on load isn't just a perf issue, it's the reason this image is even competing for LCP.
- [ ] If the auto-open is intentional, remove `loading="lazy"` and add `fetchpriority="high"` to this image, matching the hero's treatment.
- [ ] If it's not intentional (or hurts conversion), reconsider triggering it on a delay/interaction instead of on load — this also sidesteps the LCP problem entirely, since a hidden modal's image can't be the LCP candidate.

## 4. Unused CSS — 15.2 KiB of 25.9 KiB (59%)

- [ ] Same purge treatment as crustpk: run `style.bundle.min.css` through PurgeCSS against this page's actual rendered HTML.

## Definition of done
- [ ] Image savings realized (~149 KiB)
- [ ] CLS < 0.1 (currently 0.639)
- [ ] LCP element (whichever it turns out to be) not lazy-loaded
- [ ] Unused CSS under ~5 KiB