Website: https://sondaven.com/en

**Site:** https://sondaven.com/en

---

## File map

The site runs three JS layers:

---

## CSS animation tokens (`:root`)

Defined in the site's `<style>` block. Used both in CSS hover animations and (as JS constants) inside 55210.js.

### Durations

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-s` | `0.4s` | Micro-interactions, info tooltips |
| `--dur-m` | `0.6s` | UI transitions, buttons, nav, header |
| `--dur-l` | `1.2s` | Scroll reveals, image hovers, preloader |

### Easing curves

| Token | Cubic-bezier | Character |
| --- | --- | --- |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | Sharp snap both ends — page transitions, dramatic reveals |
| `--ease-out` | `cubic-bezier(0.25, 1, 0.5, 1)` | Decelerates to rest — most scroll reveals |
| `--ease-in` | `cubic-bezier(0.5, 0, 0.75, 0)` | Accelerates out — exits only |
| `--ease` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard CSS ease — FAQ accordion, tabs |
| `--ease-write` | `cubic-bezier(0.333, 0, 0.667, 1)` | Symmetric S-curve — text/line drawing |

Inside GSAP these are registered as **CustomEase aliases**: `"Out"`, `"InOut"`, `"In"`.

---

## Libraries loaded

| Library | Version | Role |
| --- | --- | --- |
| `gsap` | 3.13 | Core animation engine |
| `ScrollTrigger` | — | Scroll-linked animations |
| `CustomEase` | — | Registers `"Out"`, `"InOut"`, `"In"` |
| `SplitText` | — | Splits headings/paragraphs for per-word/line animation |
| `Flip` | — | GSAP Flip for DOM-position-change animations |
| `Lenis` | 1.3 | Smooth scroll (replaces native scroll) |
| `Barba.js` | — | Page transitions (SPA routing) |
| `Swiper` | 11 | Touch sliders |

---

### `scroll` (module 286) — anchor smooth-scroll

Custom logarithmic duration formula for `href="#section"` links:

```jsx
duration = 472.143 * Math.log(Math.abs(distance) + 125) - 2000
```

Short distances are fast, long distances aren't proportionally longer. Respects `prefers-reduced-motion`.

---

### Lenis smooth scroll

```jsx
new Lenis({
  duration: 1.2,
  smoothWheel: true,
  touchMultiplier: 2,
  easing: e => Math.min(1, 1.001 - Math.pow(2, -10 * e))  // exponential ease-out
})

lenis.on("scroll", ScrollTrigger.update)   // keeps GSAP in sync
gsap.ticker.add(e => lenis.raf(1000 * e)) // Lenis driven by GSAP ticker
gsap.ticker.lagSmoothing(0)
```

**The easing** is exponential ease-out — very front-loaded deceleration. At `t=0.3` it's already at 87% of the way. Feels "instant start, smooth coast."

Scrollable cards (`[data-lenis-scroll]`) get their own Lenis instance with `duration: 0.6` — half speed, so nested scroll feels snappier than the page.

---

### Text animation primitives

Three reusable functions called everywhere. All take `(elements, state, delay)`.

### `animateTextH()` — headings

```jsx
// Split: SplitText by words, smartWrap: true

// Reveal
gsap.fromTo(words, {
  yPercent: gsap.utils.wrap([-150, 75, -75, 150]),  // alternating entry directions
  scale: 0,
  opacity: 0
}, {
  yPercent: 0, scale: 1, opacity: 1,
  duration: durL,
  stagger: { each: 0.25 * stagger, from: "random" },
  ease: "Out"
})

// Hide
gsap.to(words, {
  yPercent: gsap.utils.wrap([75, -75, 75, -75]),
  scale: 0, opacity: 0,
  duration: durS,
  ease: "In"
})
```

`wrap([-150, 75, -75, 150])` assigns each word a different start Y — word 1 from -150%, word 2 from +75%, etc., cycling. Combined with `stagger: {from: "random"}` no two reveals look identical.

### `animateTextP()` — paragraphs

```jsx
// Split: SplitText by lines, aria: "none"
// Empty lines → replaced with <br>

// Reveal
gsap.fromTo(lines, {
  yPercent: 250, opacity: 0
}, {
  yPercent: 0, opacity: 1,
  duration: durL,
  stagger: 0.5 * stagger,
  ease: "Out"
})
```

Lines slide up from 250% below — much further than you'd expect, which is why the text feels like it's flying in rather than sliding up.

### `animateCtn()` — buttons, blocks, CTAs

```jsx
// Reveal
gsap.fromTo(elements, {
  opacity: 0, yPercent: 100
}, {
  opacity: 1, yPercent: 0,
  duration: durL,
  stagger: 0.5 * stagger,
  ease: "Out"
})
```

### `animateLine()` — divider lines

```jsx
// Reveal: clipPath wipe left to right
gsap.fromTo(lines, {
  clipPath: "inset(0% 100% -1px 0%)"
}, {
  clipPath: "inset(0% 0% -1px 0%)",
  duration: durL,
  ease: "Out"
})
```

The `-1px` bottom value prevents a subpixel gap under the line on some screens.

---

### Scroll reveals — `initScrollElementsReveal()`

Wires all the text primitives to ScrollTrigger:

```jsx
// Pattern for every data-scroll-reveal type:
animateTextH(el, "initial")          // set starting state
gsap.set(el, { visibility: "visible" }) // un-hide (was hidden to prevent flash)
ScrollTrigger.create({
  trigger: wrapper || el,
  start: "top bottom",              // fires as soon as element enters viewport
  once: true,
  onEnter: () => animateTextH(el, "reveal", 0)
})
```

Types: `h` → `animateTextH`, `p` → `animateTextP`, `ctn` → `animateCtn`, `line` → `animateLine`.

---

### Parallax — `initAllParallax()`

All use `ease: "none"` — direct linear mapping to scroll position (no easing on scrub).

| Attribute | From | To | Notes |
| --- | --- | --- | --- |
| `parallax="img"` | `yPercent: -20` | `yPercent: 20` | Images lag behind scroll |
| `parallax="img-out"` | `yPercent: -10` | `yPercent: 30` | Asymmetric — exits faster |
| `parallax="ctn-down"` | `yPercent: -10` | `yPercent: 10` | Content drifts down |
| `parallax="ctn-up"` | `yPercent: 10` | `yPercent: -10` | Content drifts up |
| `parallax="h1"` | `xPercent: wrap([5,-1,-5])` | `xPercent: wrap([-5,1,5])` | Children move horizontally in opposite directions, `scrub: 1` |

`mob="false"` attribute skips parallax on mobile (below `breakPoint`).

---

### Page transition curtain — `animateTransition()`

240 cells (20 columns × 12 rows of `.transition_cell` divs).

```jsx
// "in" — curtain closes
gsap.timeline()
  .fromTo(cells, { scaleX: 0 }, {
    scaleX: 1,
    duration: durS,
    ease: "InOut",
    stagger: { each: 0.03, from: "end", grid: [20, 12] }
  })
  .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: durL }, 0)

// "out" — curtain opens (same but reversed)
// stagger from:"end" = bottom-right fires first, sweeps to top-left
```

Total visual spread ≈ durS + (20 columns × 0.03s) ≈ ~1s. Rows within each column fire in parallel.

---

### Barba.js page transitions — `initPageTransitions()`

```
leave:       save scroll position to sessionStorage
             animateTransition("in")      close curtain
             ScrollTrigger.getAll().forEach(t => t.kill())
             globalSceneManager.destroy()
             remove old container

enter:       animateTransition("out")     open curtain

beforeEnter: restore scroll position (or 0 for new pages)
             initScripts()
             initAllScenes()
             ScrollTrigger.refresh()

afterEnter:  initResetWebflow()           re-run Webflow interactions
```

Browser back/forward (`popstate`) sets a flag that suppresses scroll restoration.

---

### Section transitions — `initSectionTransition()`

### About image

```jsx
gsap.fromTo(imgWrapper, { scale: 1 }, {
  scale: 1.25,
  transformOrigin: "center bottom",
  scrollTrigger: { trigger: section, scrub: 1 }
})
```

### Benefits horizontal scroll

```jsx
// Container scrolls horizontally via scrub
const containerAnim = gsap.to(list, { xPercent: -100, scrub: true })

// Each card animates within the horizontal scroll
cards.forEach((card, i) => {
  const randomOffset = { x: ±10–30%, y: ±5%, rotation: ±5–10° }
  gsap.fromTo(card, {
    rotation: offset.rotation,
    xPercent: offset.x,
    yPercent: offset.y + 75 + (i % 2 === 0 ? 15 : -15)
  }, {
    // ... reversed values
    scrollTrigger: {
      trigger: card,
      containerAnimation: containerAnim,  // tied to horizontal scroll
      start: "left 120%",
      end: "right -20%",
      scrub: true
    }
  })
})
```

`containerAnimation` is a GSAP technique that chains a ScrollTrigger to another animation rather than the page scroll directly.

### Footer zoom-in

```jsx
gsap.timeline({ scrollTrigger: { trigger: footer, scrub: true } })
  .fromTo(content,    { scale: 2,    transformOrigin: "center 10%" }, { scale: 1 })
  .fromTo(background, { scale: 0.75, transformOrigin: "center 10%" }, { scale: 1 }, "<")
```

Footer appears to zoom into frame as you scroll down.

---

### Header hide on scroll — `initHeaderHide()`

```
Scroll > 1000px  → fade in header background  (durS, ease:"Out")
Scroll < 1000px  → fade out background

Movement < 40px  → ignore (jitter prevention)

Scrolling down + bg visible + not already hidden
  → yPercent: -100  (durM, ease:"Out")  hide

Scrolling up + hidden
  → yPercent: 0     (durM, ease:"Out")  show

Within 160px of page bottom → always show
```

---

### Theme change — `initThemeChange()`

ScrollTrigger midpoint for each coloured section. When the section's midpoint crosses the header's midpoint:

```jsx
ScrollTrigger.create({
  trigger: section,
  start: () => `top top+=${headerMidpoint}`,
  end:   () => `bottom top+=${headerMidpoint}`,
  onEnter:     () => header.classList.add("theme_on-dark"),
  onEnterBack: () => header.classList.add("theme_on-dark")
})
```

This is how the nav text flips between light and dark as you scroll through sections.

---

### Preloader — `animatePreloaederIntro()`

Full sequence (first visit only):

```
1. lockScroll(), add dark theme
2. Set all transition cells to scaleX:1 (curtain "closed")
3. animateTextP(labels, "reveal")     "Resort design — hotel" text fades in
4. Scene (sheep video) fades in       opacity 0→1, durL, ease:"Out"
5. Logo slides in                     opacity/yPercent, durL, ease:"Out"
6. Timeline PAUSES — await:
   - framesPromise      (hero scroll-video frames preloaded)
   - sceneManager.ready()
   - document.fonts.ready
7. Counter: 0% → 100% via globalSceneManager.progress()
8. Resume: labels animate out
9. Scene fades out
10. animateTransition("out")          curtain opens
11. FLIP logo from preloader → hero position:
    Flip.from(savedState, { duration: 1.5 * durL, ease: "InOut" })
12. Hero text + content reveal
13. unlockScroll()
```

**The GSAP Flip technique:** `Flip.getState(logo)` records position/size before the DOM move. Logo element is then appended to the hero section. `Flip.from(state)` calculates the delta and plays the animation. The browser sees continuous motion — the logo appears to fly from the loading screen into the page header.

Return visits run `animatePreloaederShort()` instead — just `gsap.set(preloader, {display:"none"})` and straight to `animateTransition("out")`.

---

### Form success — 3D card flip

```jsx
// MutationObserver watches when Webflow hides the form and shows success
gsap.timeline()
  .set([form, success], {
    display: "flex",
    position: "absolute",
    transformPerspective: 1000
  })
  .fromTo(form,    { rotateY: 0   }, { rotateY: -180, duration: durL, ease: "InOut" })
  .fromTo(success, { rotateY: 180 }, { rotateY: 0,    duration: durL, ease: "InOut" }, "<")
  // success gets zIndex: 2 at the 50% mark
```

---

### All 33 initialisers in `initScripts()`

```
initThemeChange        initHeaderHide         initForm
initPlayPauseVideoScroll  initIndexCounter    initNextEntityCard
initOther              initAllParallax        initSectionTransition
initScrollElementsReveal  initHighlightText   initMagneticEffect
initMapPins            initNavItemHover       initMenuItemHover
initMarquee            initSoundToggle        initBenefitCard
initAccordion          initLoadMore           initSlider
initSliderText         initSliderFreemode     initTabs
initTabsHilight        initTabsText           initSummerWinterSwitcher
initModalCta           initModalMedia         initModalMenu
initFloatingTips       initScrollVideo        initModalVimVideo
```

All are destroyed on Barba.js page leave via `ScrollTrigger.getAll().forEach(t => t.kill())`.

---
