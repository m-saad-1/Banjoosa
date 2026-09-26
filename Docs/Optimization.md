# Agent Task: bigbitespk.vercel.app Performance — Round 2

## What's fixed since round 1
- ✅ Hero carousel container CLS (was 0.639) — gone from this report entirely.
- ✅ Forced reflow down from 145ms → 31ms.
- Offer-modal LCP-lazy-load issue not present in this report — either fixed or just not the LCP element on this run; worth a quick recheck but not urgent.

## What's left

### 1. CLS = 0.482, 100% from `<main>` (the menu grid) — same bug already solved on crustpk

```
bigbites - The Real Flavor Combos Burgers Pizzas Rolls Fries Drinks Top Picks...
<main>
0.482
```

This is the identical grid-shift bug that took several rounds to run down on crustpk.vercel.app, and it was eventually fixed there (CLS reached 0 on that site). Since both sites share the same template:
- [ ] Pull whatever fix was applied to crustpk's `<main>`/menu-grid CLS bug and port it directly to bigbitespk — don't re-diagnose from scratch, this should be the same root cause (was either a category-filter-on-load issue or a card-height-equalizer script running late; check crustpk's current source for whichever it turned out to be).
- [ ] After porting, verify with the layout-shift console snippet used on crustpk:
  ```js
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('CLS shift:', entry.value, entry.sources?.map(s => s.node));
    }
  }).observe({ type: 'layout-shift', buffered: true });
  ```

### 2. Hero image still oversized for one breakpoint — 24.3 KiB

Shipped at 1664×694 but this run displays it at 721×875 — a different (taller/narrower) slot than the 832×347 landscape display seen in round 1. That mismatch means the current `srcset` doesn't have a candidate sized for this breakpoint/orientation.
- [ ] Audit the hero's `srcset`/`sizes` and add a candidate that matches this taller display context, rather than only covering the wide-landscape case.

### 3. New: Logo flagged "Unsized image element" despite having `width="40" height="40"`

```html
<img src="./assets/images/logo.avif" class="header-logo is-loaded" width="40" height="40">
```
Attributes are present, but Lighthouse still flags it — almost certainly the CSS for `.header-logo` sets a different width/height than the attributes, breaking the aspect-ratio reservation those attributes are supposed to provide.
- [ ] Check `.header-logo`'s CSS. Either remove the conflicting CSS sizing, or add `aspect-ratio: 1/1` (or whatever the real logo ratio is) so the reserved space matches what actually renders.

### 4. Unused CSS — still 15.2 KiB of 25.9 KiB (59%), unchanged from round 1
- [ ] Same PurgeCSS pass as flagged before — no new information here, just still outstanding.

## Definition of done
- [ ] CLS < 0.1 (currently 0.482 — should resolve once the crustpk fix is ported)
- [ ] Hero image correctly sized across all display breakpoints
- [ ] Logo's CSS and width/height attributes agree (no more "unsized image" flag)
- [ ] Unused CSS under ~5 KiB