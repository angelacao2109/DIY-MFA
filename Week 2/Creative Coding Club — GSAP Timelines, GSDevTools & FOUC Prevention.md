# Creative Coding Club — GSAP Timelines, GSDevTools & FOUC Prevention

---

docs: https://gsap.com/docs/v3/Plugins/GSDevTools/

https://gsap.com/resources/fouc/

## gsap.timeline()

Creates a sequence where every animation plays one after the other automatically.

```jsx
var tl = gsap.timeline()

tl.from("#demo",  { opacity: 0 })        // plays first
  .from("h1",     { x: 80,  opacity: 0 }) // plays after #demo
  .from("h2",     { x: -80, opacity: 0 }) // plays after h1
  .from("p",      { y: 30,  opacity: 0 }) // plays after h2
  .from("button", { y: 50,  opacity: 0 }) // plays after p
```

Without a timeline you'd need to manually set `delay:` on every tween.
With a timeline GSAP handles the sequencing automatically.

---

## .from() — what it does

Animates FROM the values you give TO the element's natural/current state.

```jsx
.from("h1", { x: 80, opacity: 0 })
// h1 starts at: x=80, opacity=0
// h1 ends at:   x=0  (its normal position), opacity=1
```

The element's CSS is the destination. You only define the starting point.

---

## The full sequence explained

```jsx
tl.from("#demo", { opacity: 0 })
// whole element fades in

.from("h1", { x: 80,  opacity: 0 })
// slides in from the RIGHT (positive x = right)

.from("h2", { x: -80, opacity: 0 })
// slides in from the LEFT (negative x = left)
// opposite directions = intentional design pattern

.from("p",      { y: 30, opacity: 0 })
// rises up from below (positive y = down in CSS)

.from("button", { y: 50, opacity: 0 })
// rises up further than p — feels heavier/more important
```

---

## SVG stagger with transformOrigin

```jsx
.from("#items > g", {
  transformOrigin: "50% 50%",
  scale: 0,
  opacity: 0,
  stagger: 0.1,
})
```

### What each property does

**`#items > g`**
CSS selector — targets every `<g>` element that is a direct child of `#items`.
In SVG, `<g>` is a group tag — like a `<div>` for grouping shapes together.

**`scale: 0`**
Each group starts invisible (scaled to nothing) and grows to full size.

**`opacity: 0`**
Fades in as it scales up.

**`stagger: 0.1`**
Each `<g>` starts 0.1 seconds after the previous one.
5 groups = first starts at 0s, last starts at 0.4s.
Creates the "popping in one by one" effect.

---

## transformOrigin — why it matters for SVG

### The problem

In SVG, the default transform origin is `0 0` — the top-left corner of the **entire SVG canvas**, not the element itself.

So if you scale an icon that sits in the bottom-right of your SVG without setting transformOrigin, it doesn't grow from its own center — it grows toward the top-left of the whole canvas. Looks completely broken.

### The fix

```jsx
transformOrigin: "50% 50%"
// 50% horizontally + 50% vertically = the element's own center
```

Tells GSAP to scale from the middle of each element, wherever it sits in the SVG.

### Visual difference

```
WITHOUT transformOrigin        WITH transformOrigin: "50% 50%"

  ↗ shape grows toward         shape grows outward from
    top-left of SVG canvas       its own center

  looks like flying in          looks like popping into place
  from the wrong place          exactly where it lives
```

### HTML vs SVG difference

|  | Default transform origin |
| --- | --- |
| HTML element | `50% 50%` (center) — usually fine without setting it |
| SVG element | `0 0` (top-left of canvas) — always set it manually |

This is why you see `transformOrigin: "50% 50%"` constantly in SVG animations but rarely in HTML animations.

---

## GSDevTools.create()

A visual debugger that appears in the browser — lets you scrub, pause, slow down, and inspect any GSAP animation without touching code.

### What it looks like

A control bar at the bottom of the screen with:

- Play / pause button
- Scrubber — drag to any point in the animation
- Speed selector — 0.1x, 0.25x, 0.5x, 1x, 2x
- Loop toggle
- Timeline selector — if you have multiple timelines, switch between them

### Basic usage

```jsx
// 1. Register the plugin first (always required for GSAP plugins)
gsap.registerPlugin(GSDevTools)

// 2. Drop this one line anywhere in your code
GSDevTools.create()
```

That's it. It automatically finds and displays all timelines on the page.

### With options

```jsx
GSDevTools.create({
  animation: tl,     // show a specific timeline instead of all
  paused: true,      // start with animation paused
  minimal: true,     // compact UI — smaller footprint
  keyboard: true,    // enable keyboard shortcuts (space = play/pause)
  container: "#app", // where to inject the UI (default: body)
})
```

### Pointing it at a specific timeline

```jsx
var tl = gsap.timeline()
tl.from("h1", { x: 80, opacity: 0 })
  .from("p",  { y: 30, opacity: 0 })

// Debug only this timeline
GSDevTools.create({ animation: tl })
```

Useful when you have multiple timelines and only want to focus on one.

### Why it matters

Scrubbing an animation manually with the timeline controls is 10x faster than adding `console.log` statements or guessing at timing. When an animation looks wrong — use GSDevTools first. Drag the scrubber to the broken frame, see exactly what's happening.

---

## Timeline defaults

Set properties that apply to every tween in the timeline automatically.

```jsx
var tl = gsap.timeline({
  defaults: { opacity: 0, ease: "back" }
})
```

Now every `.from()` in this timeline inherits `opacity:0` and `ease:"back"` without you typing it each time.

```jsx
// Without defaults — repetitive
tl.from("h1", { x: 80,  opacity: 0, ease: "back" })
  .from("h2", { x: -80, opacity: 0, ease: "back" })
  .from("p",  { y: 30,  opacity: 0, ease: "back" })

// With defaults — clean
var tl = gsap.timeline({ defaults: { opacity: 0, ease: "back" } })
tl.from("h1", { x: 80  })   // opacity:0 and ease:"back" inherited
  .from("h2", { x: -80 })   // same
  .from("p",  { y: 30  })   // same
```

### Overriding a default

Pass the property directly on the tween — it overrides the default for that tween only.

```jsx
var tl = gsap.timeline({ defaults: { ease: "back" } })

tl.from("#demo", { ease: "linear", autoAlpha: 0 })
// this tween uses ease:"linear" — overrides the default "back"

  .from("h1", { x: 80 })
// this tween uses ease:"back" — inherits the default
```

This is exactly what the code above does — `#demo` needs a linear fade in, everything else uses the snappy `back` ease.

---

## Position parameters — controlling timing

By default each tween starts when the previous one ends. Position parameters let you change that.

### `"<"` — start at the same time as the previous tween

```jsx
tl.from("h1", { x: 80  })           // starts at t=0
  .from("h2", { x: -80 }, "<")      // also starts at t=0 — same time as h1
```

h1 and h2 animate in simultaneously. The `"<"` means "start at the beginning of the previous tween."

### `"-=0.2"` — start 0.2s before the previous tween ends

```jsx
tl.from("h1", { x: 80,  duration: 1 })   // 0s → 1s
  .from("p",  { y: 30 }, "-=0.2")         // starts at 0.8s, overlaps last 0.2s
```

Creates a slight overlap — feels more fluid than waiting for each animation to fully finish.

### Other position values

```jsx
"+=0.5"    // start 0.5s AFTER previous ends — adds a gap/pause
"<0.3"     // start 0.3s after the start of previous tween
1.5        // start at exactly 1.5s on the timeline (absolute time)
"myLabel"  // start at a named label position
```

### How the current code reads

```jsx
tl.from("#demo", { ease:"linear", autoAlpha:0 })  // t=0: container fades in
  .from("h1",    { x:80 })                         // after #demo: slides in
  .from("h2",    { x:-80 }, "<")                   // same time as h1
  .from("p",     { y:30  }, "-=0.2")               // 0.2s before h2 finishes
  .from("button",{ y:50  }, "-=0.2")               // 0.2s before p finishes
  .from("#items > g", { ... stagger:0.1 })          // after button
```

h1 and h2 fire together. p and button stagger in with overlaps. SVG pieces pop in after.

---

## GSDevTools inside the load event

```jsx
window.addEventListener("load", function(event) {
  init()
  GSDevTools.create({ animation: tl })
})
```

Both `init()` and `GSDevTools.create()` are inside the load event. This is correct — GSDevTools needs the timeline to exist before it can display it. Since `tl` is built inside `init()`, GSDevTools must be called after `init()` runs.

`{ animation: tl }` points GSDevTools at your specific timeline instead of showing all GSAP animations on the page. Cleaner when debugging one thing.

---

### What it is

The brief moment where elements appear on screen before your JavaScript runs and styles them correctly. Most common causes:

- Custom fonts not loaded yet — you see the wrong font for a split second
- GSAP animations — elements appear at full opacity before GSAP sets them to 0

### Why GSAP specifically causes it

Scripts load after the closing `</body>` tag (best practice for performance). That means:

```
1. Browser renders HTML — elements visible at full opacity
2. Brief pause (10–100ms)
3. JavaScript runs — GSAP sets opacity to 0, then animates in
```

That pause in step 2 is the flash. The user sees the un-animated state before GSAP takes control.

### The fix — 4 steps

**Step 1 — Hide the container in CSS**

```css
#demo {
  visibility: hidden;
}
```

Use `visibility: hidden` not `display: none`. Hidden keeps the element in the layout so the page doesn't jump. Display none removes it from flow entirely.

**Step 2 — Use `autoAlpha` instead of `opacity`**

```jsx
// instead of opacity: 0
tl.from("#demo", { autoAlpha: 0 })
```

`autoAlpha` is a GSAP-specific property that controls both `opacity` AND `visibility` together.

| Value | opacity | visibility |
| --- | --- | --- |
| autoAlpha: 0 | 0 | hidden |
| autoAlpha: 1 | 1 | visible |

When GSAP animates autoAlpha from 0 → 1 it automatically sets `visibility: visible` at the start of the animation. This is what reveals the element cleanly.

**Step 3 — Wrap animation code in an `init()` function**

```jsx
function init() {
  var tl = gsap.timeline()
  tl.from("#demo",  { autoAlpha: 0 })
    .from("h1",     { x: 80,  opacity: 0 })
    .from("h2",     { x: -80, opacity: 0 })
    .from("p",      { y: 30,  opacity: 0 })
    .from("button", { y: 50,  opacity: 0 })
}
```

Wrapping in a function means the animation doesn't run until you explicitly call it.

**Step 4 — Call init() only after the page fully loads**

```jsx
window.addEventListener("load", init)
```

The `load` event fires after everything is ready — HTML, CSS, fonts, images. By waiting for it you guarantee:

- Fonts are loaded (no wrong-font flash)
- GSAP has set visibility:hidden before anything is visible
- Animation starts from a clean state

### Full pattern together

```html
<!-- CSS -->
<style>
  #demo {
    visibility: hidden; /* hidden until GSAP takes over */
  }
</style>

<!-- JS -->
<script>
  function init() {
    var tl = gsap.timeline()

    tl.from("#demo", { autoAlpha: 0 })       // reveals the container
      .from("h1",    { x: 80,  opacity: 0 })
      .from("h2",    { x: -80, opacity: 0 })
      .from("p",     { y: 30,  opacity: 0 })
      .from("button",{ y: 50,  opacity: 0 })
      .from("#items > g", {
        transformOrigin: "50% 50%",
        scale: 0,
        opacity: 0,
        stagger: 0.1,
      })
  }

  window.addEventListener("load", init)
</script>
```

### autoAlpha vs opacity — key difference

```jsx
// opacity only controls transparency
gsap.to(".box", { opacity: 0 })
// element is invisible but still technically "visible" to the browser
// screen readers can still read it
// it still receives click events

// autoAlpha controls opacity AND visibility
gsap.to(".box", { autoAlpha: 0 })
// element is invisible AND visibility:hidden
// no longer interactive, no longer read by screen readers
// when animated back to autoAlpha:1 → visibility:visible is restored
```

Use `autoAlpha` for the main container reveal. Use `opacity` for individual elements inside it.

### Why `load` not `DOMContentLoaded`

```jsx
// DOMContentLoaded — HTML parsed, but fonts/images may not be ready yet
document.addEventListener("DOMContentLoaded", init) // still may flash

// load — everything ready including fonts and images
window.addEventListener("load", init) // cleanest, no flash
```

---

## Key things to remember

- Timeline = automatic sequencing, no manual delays needed
- `.from()` = you define the start, CSS is the end
- Positive x = right, negative x = left
- Positive y = down, negative y = up
- SVG always needs `transformOrigin: "50% 50%"` for scale animations
- `stagger` on multiple elements = they fire one after another
- GSAP silently ignores typos — check spelling first when debugging
- GSDevTools = visual debugger, use it constantly during development
- GSDevTools is Club GSAP (paid) but free on CodePen
- Always remove GSDevTools.create() before shipping to production
- FOUC = elements flash before GSAP runs — always protect against it
- Fix: `visibility:hidden` in CSS + `autoAlpha:0` in GSAP + `window.addEventListener("load", init)`
- `autoAlpha` controls opacity AND visibility together — use it for container reveals
- `load` fires after fonts and images are ready — `DOMContentLoaded` does not
- `defaults` on a timeline = applies to every tween, override per-tween when needed
- `"<"` = same time as previous tween
- `"-=0.2"` = 0.2s before previous tween ends (overlap)
- `"+=0.2"` = 0.2s after previous tween ends (gap)
