# Agent Task: bigbitespk.vercel.app Performance — Round 5 (Mobile)

Two genuine wins this round, and one real regression to run down. Read the "what actually shipped" section before doing anything — it tells you exactly which of round 4's fixes worked and which didn't.

## What actually shipped vs. what didn't

| Item from round 4 | Status now | Evidence |
|---|---|---|
| Image sizing / `sizes` attribute bugs | ✅ **Fixed** | "Improve image delivery" insight is gone entirely — first time in 5 rounds |
| Hero image responsive `srcset` | ✅ **Fixed** | Hero now correctly ships `hero-300`/`hero-600` with proper `sizes`, LCP holding at 2.0s |
| Non-composited animations | 🟡 **Partial** | 112 → 75. Real progress, not done |
| `<main>` grid CLS shift | 🔴 **Not fixed** | Score is **exactly 0.516 — identical to round 4.** Nothing changed |
| `body overflow:hidden` scroll-lock | 🔴 **Not fixed, worse** | Was 0 (absent) in round 4, now back at **1.000, the maximum possible score** |
| Forced reflow in `script.bundle.min.js` | 🔴 **Not fixed** | Same exact lines (`2:3716`, `1:1294`) as round 4, just different ms |

## Status check

| Metric | Round 4 | Round 5 (now) | Target | Status |
|---|---|---|---|---|
| Performance | 78 | 74 | ≥ 90 | Down — entirely because of CLS |
| FCP | 0.8s | 0.8s | < 1.8s | ✅ |
| LCP | 1.5s | 2.0s | < 2.5s | ✅ still passing, watch it |
| TBT | 80ms | 30ms | < 200ms | ✅ |
| **CLS** | 0.516 | **1.516** | < 0.1 | 🔴 **worst of the whole series** |
| SI | 3.1s | 2.7s | < 3.4s | ✅ |

---

## Phase 0 — The `body overflow:hidden` bug was never actually fixed (this is why it's intermittent)

Across all 5 reports, this exact culprit has shown these scores: 0.200 (round 3, desktop) → 0 / absent (round 4, mobile) → **1.000 (round 5, mobile, now)**. A real fix doesn't bounce between "gone" and "maximum severity" — that pattern is the signature of a bug that's **timing-dependent**, not one that's been resolved. Most likely explanation: whatever opens the scroll-locking modal does so on a `setTimeout` delay (e.g., "show the special offer 3 seconds after load"), and whether Lighthouse's trace window happens to include that moment determines whether this shows up at all in a given run.

Stop treating this as fixed. Do these steps, in order, and don't mark it done until step 4 passes:

1. [ ] Grep the codebase for every `setTimeout` near a modal-open call, and for every place `overflow` is set to `hidden` on `body` or `html`. There are likely 2–3 separate implementations (Special Offer, Delivery Info, Contact Us modals) — find all of them, not just the first one you hit.
2. [ ] Confirm — by reading the actual deployed CSS, not the source repo — whether `scrollbar-gutter: stable` is present on `html`. Do this by opening the live site in DevTools → Elements → select the `<html>` node → Computed tab → search "scrollbar-gutter". If it's not there, whatever was "fixed" in an earlier round never made it to production.
3. [ ] Apply `scrollbar-gutter: stable` on `html` as one global rule (not per-modal — one rule covers all three modals no matter which one fires or when):
   ```css
   html { scrollbar-gutter: stable; }
   ```
4. [ ] Reload the live site, wait at least 10 full seconds with DevTools open (to give any timer-based popup time to fire), and check Rendering → "Layout Shift Regions" for zero shifts. Don't rely on a single quick reload — the whole reason this bug hides is that it depends on timing, so test long enough for it to have a chance to trigger.

---

## Phase 1 — The `<main>` grid shift: identical score means nothing changed here at all

0.516 in round 4, 0.516 now — down to the third decimal. Whatever was supposed to happen here did not happen. New evidence this round narrows down which of the two hypotheses from round 4 is more likely:

The "Avoid long main-thread tasks" data in this report shows exactly when the suspect scripts run:
```
script.bundle.min.js  — starts at 3,151 ms, runs 75 ms
loader.min.js         — starts at 2,718 ms, runs 67 ms
```
Both fire **~2.7–3.1 seconds after navigation start** — quite late. A category-filter script (Hypothesis A from round 4) would normally run immediately on `DOMContentLoaded`, much earlier than 2.7s. A script that waits for `window.onload` (i.e., waits for every image on the page to finish downloading before running) firing at ~2.7-3.1s on a throttled Slow-4G connection fits much better. This points toward **Hypothesis B — a card-height-equalization script that waits for all images to load, then measures and re-applies heights** as the more likely cause. Confirm before fixing:

1. [ ] Run this in the console on page load and actually read the output this time — don't skip straight to a fix:
   ```js
   new PerformanceObserver((list) => {
     for (const entry of list.getEntries()) {
       console.log('CLS shift:', entry.value, entry.sources?.map(s => s.node));
     }
   }).observe({ type: 'layout-shift', buffered: true });
   ```
2. [ ] Also check whether `script.bundle.js` (unminified source, or via source map) has a `window.addEventListener('load', ...)` or similar that measures card heights via `offsetHeight`/`getBoundingClientRect()` and then sets a `min-height`/`height` style on the cards. Lines around `2:3716` and `1:1294` in the minified bundle are the two locations flagged for forced reflow — start there.
3. [ ] If confirmed as a height-equalizer: delete the JS entirely and replace with CSS Grid, which produces equal card heights with zero JavaScript and zero layout shift:
   ```css
   .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); align-items: stretch; }
   .product-card { display: flex; flex-direction: column; height: 100%; }
   ```
4. [ ] If it turns out to be Hypothesis A (category filtering) instead, apply the CSS-only default-category fix from round 4's Phase 0.
5. [ ] After deploying, re-run the console snippet and confirm it logs nothing meaningful — and confirm the "Avoid long main-thread tasks" entries for these two scripts are gone or much smaller, since removing the layout-thrashing code should shrink those task durations too.

---

## Phase 2 — Forced reflow ties directly to Phase 1

Same two source locations two rounds running (`script.bundle.min.js:2:3716` and `:1:1294`). This is almost certainly the exact same code as the `<main>` shift — fix Phase 1 properly and this should disappear as a side effect. Don't spend separate time on it; just verify it's gone after Phase 1's fix.

---

## Phase 3 — Finish the non-composited animations cleanup (112 → 75, keep going)

Good progress, not done. Whatever rule got fixed only covered some of the elements.

- [ ] Re-run the "Avoid non-composited animations" insight and get the current list of the 75 remaining flagged elements.
- [ ] Check for any other broad transition/animation rules besides the one already fixed — likely candidates: hover states on `.product-card`, `.btn-primary`/`.btn-outline`, or the category tab buttons (`loc-tab-active` and similar).
- [ ] Same fix pattern as before — constrain every transition to `transform`/`opacity` only.

---

## Phase 4 — Minor, low priority

- [ ] Unused CSS: 10.9 KiB remaining in `style.bundle.min.css` — small, keep chipping at it whenever convenient.
- [ ] DOM size: 1,075 total elements. Not flagged as a hard problem yet, but worth knowing — if the menu grid ends up rendering all products for all categories simultaneously (per Phase 1's investigation) rather than only the active category, that's likely a meaningful chunk of this element count too.
- [ ] Google Fonts: 58 KiB transferred, 0ms main-thread cost — no action needed, just noted as healthy.

---

## Definition of done (round 5)

- [ ] `scrollbar-gutter: stable` confirmed present on the **live production** `<html>` element (verified in DevTools, not just checked in source)
- [ ] Waited 10+ seconds on a fresh load with DevTools open — zero layout-shift regions logged
- [ ] `<main>` grid shift root cause confirmed via the console snippet (not assumed) and fixed
- [ ] Forced reflow at `script.bundle.min.js:2:3716`/`:1:1294` confirmed gone
- [ ] CLS < 0.1
- [ ] Non-composited animations under ~10 (down from 75)
- [ ] Performance score ≥ 90