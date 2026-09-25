# Agent Task: bigbitespk.vercel.app Performance — Round 6 (Mobile)

CLS is fixed (0). Score is 89/100, one point under target. This round is about closing that last gap — the remaining issues are smaller and more mechanical than the CLS saga.

## Status check

| Metric | Round 5 | Round 6 (now) | Target | Status |
|---|---|---|---|---|
| Performance | 74 | **89** | ≥ 90 | 🟢 one point away |
| Accessibility | 95 | 92 | ≥ 95 | 🟡 slight regression, no detail in this report — re-audit |
| Best Practices | 96 | 100 | 100 | ✅ |
| FCP | 0.8s | 2.6s | < 1.8s | 🟡 regressed — likely tied to render-blocking CSS below |
| LCP | 2.0s | 2.9s | < 2.5s | 🟡 regressed — see Phase 0, this is the highest-value fix |
| TBT | 30ms | 70ms | < 200ms | ✅ |
| **CLS** | 1.516 | **0** | < 0.1 | ✅ **fixed** |
| SI | 2.7s | 4.4s | < 3.4s | 🟡 regressed, will likely recover once Phase 0/1 land |

---

## Phase 0 — LCP discoverability bug (highest value fix this round)

New insight this report — Lighthouse now explicitly flags what's wrong with the LCP element:
```
LCP resources should not use loading=lazy   ← FAILING
fetchpriority=high should be applied         ← FAILING

Combo 1
<img ... loading="lazy" ... src="./assets/images/combo-1.avif" ...>
```

The actual LCP element on this run was the **"Combo 1" menu card image**, not the hero — and it's marked `loading="lazy"`. A lazy-loaded image is deliberately deprioritized by the browser until it's about to scroll into view, which is the opposite of what you want for whatever ends up being the LCP candidate. This explains the LCP regression (2.0s → 2.9s).

The root issue: which image is "the LCP element" isn't fixed — it depends on viewport size and what's actually largest/highest in the render. Your fetchpriority fix only covers the hero. Fix this properly by not lazy-loading anything in the very first screenful, not just the hero:

- [ ] Remove `loading="lazy"` from the **first visible menu card's** image (e.g. the first `.product-card` image in the "Top Picks" grid, currently "Combo 1") — set it to `loading="eager"` / no `loading` attribute, same as the hero.
- [ ] Consider giving that first card's image `fetchpriority="high"` too, alongside the hero — the browser can prioritize more than one resource; this isn't the same mistake as round 1's "everything is high priority" problem, since this is now just two images (hero + first visible card), not fifteen.
- [ ] Everything else in the grid (second card onward) keeps `loading="lazy"` — don't revert the whole grid back to eager loading, that's what caused the original 14.6s LCP disaster.

---

## Phase 1 — Extend the hero fix to the other two hero images (11 KiB, ties into LCP)

Round 5 correctly fixed the **first** hero image (`hero.avif` → responsive `srcset`). Turns out there are **three** hero carousel images, and only one got the fix:

- [ ] `bigbites Hero 3` (`offer-2.avif`) — still shipping 801×400 for a 736×347 display, no `srcset`. Apply the exact same responsive-image treatment used for Hero 1.
- [ ] `bigbites Hero 2` (`offer-1.avif`) — wasn't flagged in this specific report run but almost certainly has the same issue as Hero 3; fix it at the same time rather than waiting for it to show up in a future report.
- [ ] **The "clone" element** — Hero 1 now appears twice in the DOM: once as the original (with the working `srcset`) and once as `class="hero-full-img is-loaded clone"` shipping the old unoptimized `hero.avif` master. This is almost certainly a JS-generated duplicate for a seamless carousel loop. Find wherever the clone is created and make sure it copies the **full** `srcset`/`sizes`/`loading`/`decoding` attributes from the original element, not just `src` — otherwise every future image fix on the hero needs to be applied twice, once to the real element and once to whatever generates its clone.

---

## Phase 2 — Render-blocking CSS is still unresolved (630ms block, flagged since round 1)

This has been in every report since the very first one and still hasn't been addressed:
- [ ] Extract critical above-the-fold CSS and inline it in `<head>`.
- [ ] Load the rest of `style.bundle.min.css` (29.8 KiB) non-blocking:
  ```html
  <link rel="preload" href="/css/style.bundle.min.css?v=20" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/style.bundle.min.css?v=20"></noscript>
  ```
- [ ] This alone should meaningfully help the FCP regression (0.8s → 2.6s) — a 630ms render-blocking request sitting in the critical path is consistent with FCP getting worse.

---

## Phase 3 — Your build's minification step isn't actually running (worth investigating directly, not just re-applying)

Both bundles are named `*.min.*` but Lighthouse says minifying them would still save real bytes:
- `style.bundle.min.css` — 5.2 KiB more to save via minification
- `script.bundle.min.js` — 6.3 KiB more to save
- `loader.min.js` — 2.6 KiB more to save

A file named `.min.` that isn't actually minified means the build step that's supposed to minify it is silently failing or being skipped — the naming convention is happening (maybe it's just a static filename in the source, not an output of an actual minify step), but the compression itself isn't. Don't just "minify it again" — find out **why** the pipeline named the file `.min.` without running a minifier on it:

- [ ] Check the actual build script / CI config for the minification step — is a minifier plugin (Terser, cssnano, esbuild `--minify`, etc.) actually wired into the build that produces `*.min.*`, or is the filename just hardcoded and the content copied through unchanged?
- [ ] Once fixed, confirm by diffing file size before/after in the build output, not just checking the filename.

---

## Phase 4 — Unused CSS/JS, still substantial

- `style.bundle.min.css` — 17.2 KiB of 29.2 KiB (59%) unused
- `script.bundle.min.js` — 21.9 KiB of 29.4 KiB (75%) unused

Both have been flagged multiple rounds running without real progress. Given six rounds of incremental patches, the JS bundle in particular has likely accumulated dead code paths from earlier fixes that were superseded (e.g., old category-filter logic, old height-equalization code, anything replaced during the CLS fix). Worth a proper cleanup pass now that the site is stable, rather than another partial purge:

- [ ] Run DevTools → Sources → Coverage while loading the page, identify genuinely dead code, and remove it rather than just deferring it.
- [ ] Purge unused CSS rules with PurgeCSS (or equivalent) against the actual rendered HTML.

---

## Phase 5 — Forced reflow, still present but now unattributed (145ms)

Lighthouse could no longer pin this to a specific file/line this run (it shows `[unattributed]`), likely because minification (once actually working, per Phase 3) obscures stack traces, or the code path shifted during the CLS fix. Since CLS is now 0, this reflow is a pure performance cost, not a visual-shift bug — profile it fresh:
- [ ] Record a DevTools Performance trace, find the purple "Forced reflow" warnings, and trace them back to source now that the CLS-related code has changed.
- [ ] Apply the same read-before-write batching fix as always once located.

---

## Phase 6 — Accessibility regressed 95 → 92 (no detail in this report)

- [ ] Run a full Lighthouse accessibility audit and diff it against the round-4 findings (contrast on `card-desc`/buttons/status-dot, heading order) — confirm those are still fixed and see what new element is now failing. This report didn't include the accessibility detail section, so don't guess — pull the full breakdown.

---

## Definition of done (round 6)

- [ ] LCP < 2.5s, with the first-visible-card image no longer lazy-loaded
- [ ] All three hero images (and the carousel clone) have responsive `srcset`
- [ ] CSS no longer render-blocking (inlined critical CSS + async load)
- [ ] Build pipeline confirmed to actually minify `*.min.*` output (verified by file size, not filename)
- [ ] Unused CSS/JS both under ~5 KiB
- [ ] CLS stays at 0 (don't regress this — verify after every other change in this round)
- [ ] Accessibility back to ≥ 95
- [ ] Performance score ≥ 90