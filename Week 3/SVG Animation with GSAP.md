# SVG Animation with GSAP 

SVG stands for Scalable Vector Graphic. It's an image format written in code — XML specifically — that describes shapes using math rather than pixels.

SVG has its own internal coordinate grid defined by `viewBox`. The top-left corner is `0, 0`. X increases going right. Y increases going **down** 

```html
<svg viewBox="0 0 200 200">
  <!--        ↑ ↑  ↑   ↑
              x y  w   h
              origin  size of the grid -->
</svg>
```

`viewBox="0 0 200 200"` means: the grid starts at 0,0 and is 200 units wide and 200 units tall.

### `<circle>`

Draws a circle. Three attributes you need:

html

```html
<svg viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="#88ce02" />
</svg>
```

| Attribute | What it does |
| --- | --- |
| `cx` | Centre point on the X axis |
| `cy` | Centre point on the Y axis |
| `r` | Radius — distance from centre to edge |
| `fill` | Fill colour |
| `stroke` | Border colour |
| `stroke-width` | Border thickness |

## Method 1 — External CSS

Styles live in your stylesheet, not on the element itself.

```html
<svg class="demo" viewBox="0 0 400 400" width="400" height="400">
  <circle class="c1" r="100" cx="200" cy="200"/>
  <circle r="50" cx="300" cy="200"/>
</svg>
```

```css
svg.demo {
  border: 1px solid black;
  background: #ddd;
}

circle {
  fill: blue;
  stroke: orange;
  stroke-width: 8px;
  vector-effect: non-scaling-stroke;
  will-change: stroke-width;
}
```

---

**GSAP can animate both.** But how you target them is slightly different.

```jsx
// Animating CSS properties — same as HTML
gsap.to(".c1", {
  fill: "green",
  stroke: "red",
  duration: 3,
  scale: 3
})
```

`fill` and `stroke` are CSS properties in SVG — GSAP can animate them directly without `attr: {}`. This works whether the original values came from a stylesheet or inline attributes.

**The rule:**

- `fill`, `stroke`, `opacity`, `stroke-width` → animate directly (they're CSS properties)
- `cx`, `cy`, `r`, `rx`, `ry`, `points`, `d` → wrap in `attr: {}` (they're SVG geometry attributes, not CSS)

```jsx
// ✅ CSS property — no attr needed
gsap.to("circle", { fill: "green", stroke: "red" })

// ✅ SVG geometry attribute — needs attr wrapper
gsap.to("circle", { attr: { cx: 100, r: 50 } })
```

### `vector-effect: non-scaling-stroke`

```css
vector-effect: non-scaling-stroke;
```

Normally when you scale an SVG element, the stroke scales with it. A `stroke-width: 8` circle scaled to 3× ends up with an effective stroke of 24px.

`non-scaling-stroke` locks the stroke width to its defined value regardless of scale. The shape scales but the border stays the same thickness.

**Without it:**

`circle at scale 3  →  stroke-width appears as 24px`

**With it:**

`circle at scale 3  →  stroke-width stays 8px`

Use it whenever you're scaling SVG elements and want consistent border thickness.

---

### `will-change: stroke-width`

```css
will-change: stroke-width;
```

A browser performance hint. Tells the browser: "this property is about to be animated — prepare for it." The browser can move it to its own compositor layer ahead of time, making the animation smoother.

Same concept as `will-change: transform` on HTML elements. Only add it to elements you're actually animating — adding it to everything is wasteful.

---

## 1. The `<g>` Element — Your Spin Target

A `<g>` is a group. No visual of its own — it's just a container. When you rotate a `<g>`, everything inside rotates together.

A typical exported SVG structure:

```html
<svg viewBox="0 0 400 400" width="400" height="400">
  <g id="my-shape">
    <path d="..." />
    <path d="..." />
    <circle ... />
  </g>
</svg>
```

**You spin the `<g>`, not individual elements.** Target the group and everything inside moves as one unit.

```jsx
gsap.to("#my-shape", { rotation: 360, duration: 4, ease: "none", repeat: -1 })
```

---

## 2. The transformOrigin Problem — The Most Important Thing

By default, SVG elements rotate from the **top-left corner of the entire SVG canvas** — not from the centre of the element. The element will orbit around a random point instead of spinning in place.

**Without fixing transformOrigin:**

```jsx
Element rotates around (0, 0) — the top-left corner of the SVG
Result: element swings around the canvas like a ball on a string ❌
```

**Two ways to fix it:**

---

### Fix A — CSS `transform-origin` (simplest)

```css
#my-shape {
  transform-origin: center center;
  transform-box: fill-box;  /* ← critical. Makes transform-origin relative to the element's own bounding box */
}
```

`transform-box: fill-box` is the key line. Without it, `center center` is relative to the whole SVG viewport, not the element itself.

---

### Fix B — GSAP `svgOrigin` property

Tell GSAP the exact coordinates inside the SVG to rotate around. If your SVG is 400×400 and the element is centred:

```jsx
gsap.to("#my-shape", {
  rotation: 360,
  svgOrigin: "200 200",   // "x y" — the centre of your SVG grid
  duration: 4,
  ease: "none",
  repeat: -1
})
```

`svgOrigin` takes coordinates in the SVG's own coordinate system — so if your viewBox is `0 0 400 400` and the element is centred, the origin is `200 200`.

---

### Which to use?

| Approach | When |
| --- | --- |
| CSS `transform-box: fill-box` | Element is centered and you want it to spin around its own centre |
| GSAP `svgOrigin` | You know the exact SVG coordinates and want precise control |

Start with the CSS approach. If the spin looks off, switch to `svgOrigin`.

---

## 3. Basic Spin Animation

```jsx
// Continuous spin — infinite, linear
gsap.to("#my-shape", {
  rotation: 360,
  duration: 4,
  ease: "none",     // linear — no acceleration, constant speed
  repeat: -1,       // repeat forever
  transformOrigin: "center center"
})
```

**`ease: "none"`** is important for a spin. Any other ease makes the element speed up and slow down each rotation — looks wrong. Linear feels like actual rotation.

---

## 4. Staggered Child Element Animation

If child elements are separate paths, you can stagger their entrance before the spin:

```jsx
const tl = gsap.timeline()

// Children fade/scale in with a stagger
tl.from(".child-element", {
  opacity: 0,
  scale: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: "back.out(1.5)",
  transformOrigin: "center center"
})

// Then spin the whole group
.to("#my-shape", {
  rotation: 360,
  duration: 6,
  ease: "none",
  repeat: -1
})
```

---

## 5. Reading a Figma SVG Export

When you open the exported SVG, look for:

```html
<!-- Figma typically exports something like this -->
<svg viewBox="0 0 400 400">
  <g id="Layer_1">        ← this is probably your spin target
    <g id="group-1">
      <path ... />
      <path ... />
    </g>
    <circle ... />
  </g>
</svg>
```

**First thing to do:** add meaningful IDs to the groups. Figma exports generic names like `Layer_1`. Replace them with descriptive IDs so your JS is readable.

---

## 6. The Full Pattern

`1. Export SVG from Figma
2. Paste inline into HTML (not as <img> — GSAP can't target elements inside an <img>)
3. Add IDs to the groups you want to target
4. Add transform-box: fill-box in CSS on the elements you'll rotate
5. Build a GSAP timeline:
   - Child elements animate in (staggered)
   - Whole group starts spinning`

---

## 7. Common Mistakes

| Mistake | What happens | Fix |
| --- | --- | --- |
| Using `<img src="my.svg">` | GSAP can't see inside it | Use inline SVG in your HTML |
| Forgetting `transform-box: fill-box` | Element rotates around wrong point | Add it to CSS |
| Using any ease other than `"none"` on a spin | Rotation stutters on repeat | Use `ease: "none"` |
| Targeting `<svg>` instead of `<g>` | Whole canvas rotates including the viewBox | Target the `<g>` group inside |
| Setting `repeat: -1` without `ease: "none"` | Each loop has a slow start/end | Always pair infinite repeat with linear ease |

---

**`transformOrigin` — relative to the element itself**

**`svgOrigin`** — relative to the parent SVG canvas

```jsx
// transformOrigin — "50% 50%" always means the centre of THAT element
// doesn't matter where in the SVG it lives
gsap.to("#circle", {
  rotation: 360,
  transformOrigin: "50% 50%"  // ← centre of the circle
})

// svgOrigin — "200 200" means a fixed point on the SVG canvas
// the element rotates AROUND that canvas point
gsap.to("#circle", {
  rotation: 360,
  svgOrigin: "200 200"  // ← point (200,200) on the SVG grid
})
```

### When to Use Which

| Situation | Use |
| --- | --- |
| Spin an element around its own centre | `transformOrigin: "center center"` |
| Spin an element around its corner or edge | `transformOrigin: "0% 0%"` etc. |
| Multiple elements orbiting around one shared canvas point | `svgOrigin: "x y"` |
| You know the exact SVG coordinates and need precision | `svgOrigin: "x y"` |

**Default to `transformOrigin`.** It's the intuitive one — 90% of the time "rotate around the element's own centre" is what you want.

Use `svgOrigin` when you need multiple things rotating around a single fixed point in the canvas — like planets orbiting the same sun.

---

## The Code

```jsx
const tl = gsap.timeline()
  .to("line, rect", { strokeDashoffset: -40, repeat: 20, ease: "none" })

GSDevTools.create({ animation: tl })
```

---

## `"line, rect"` — the target

Just a CSS selector targeting two element types at once — all `<line>` elements and all `<rect>` elements on the page. Same as `document.querySelectorAll("line, rect")`. GSAP accepts any valid CSS selector.

---

## `strokeDashoffset` — the key property

To understand this you need to know what `strokeDasharray` does first.

`strokeDasharray` splits a stroke into a pattern of dashes and gaps:

```css
stroke-dasharray: 10;    /* dash 10px, gap 10px, repeat */
stroke-dasharray: 10 5;  /* dash 10px, gap 5px, repeat */
```

`strokeDashoffset` then shifts that pattern along the path:

```
dashoffset: 0    →  [--  --  --  --]
dashoffset: 5    →  [-  --  --  --  ]   shifted 5px
dashoffset: 10   →  [  --  --  --  -- ] shifted 10px
```

**Animating `strokeDashoffset` makes the dash pattern appear to march along the line** — which is the "marching ants" effect. The dashes aren't actually moving — the pattern offset is shifting, which creates the illusion of motion.

Negative value moves the pattern in the opposite direction:

```
dashoffset: 0    →  pattern moves forward →
dashoffset: -40  →  pattern moves backward ←
```

---

## `repeat: 20`

Play the animation 20 times. Since `strokeDashoffset` shifts the pattern by 40px each time and then loops, it looks continuous — the ants keep marching.

If you use `repeat: -1` instead it loops infinitely.

---

## `ease: "none"`

Linear — no acceleration or deceleration. Essential here. Any other ease would make the ants speed up and slow down each loop, which would look wrong. Marching ants need constant speed.

---
