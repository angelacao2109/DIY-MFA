---
notion-url: https://www.notion.so/380c3dcfa16e8073858eca21c87fd198
title: SVG Animation with GSAP
date: '2026-06-08 12:26:00.000'
from_notion: https://app.notion.com/p/SVG-Animation-with-GSAP-380c3dcfa16e8073858eca21c87fd198
author: Angela Cao
last_edited_time: '2026-06-15 18:22:00.000'
---
<br/>


```html
<svg viewBox="0 0 200 200">
  <!--        ↑ ↑  ↑   ↑
              x y  w   h
              origin  size of the grid -->
</svg>
```

### `<circle>`


```html
<svg viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="#88ce02" />
</svg>
```

 | Attribute | What it does | 
 | ---- | ---- | 
 | `cx` | Centre point on the X axis | 
 | `cy` | Centre point on the Y axis | 
 | `r` | Radius — distance from centre to edge | 
 | `fill` | Fill colour | 
 | `stroke` | Border colour | 
 | `stroke-width` | Border thickness | 

## Method 1 — External CSS

<br/>


```html
<svg class="demo" viewBox="0 0 400 400" width="400" height="400">
  <circle class="c1" r="100" cx="200" cy="200"/>
  <circle r="50" cx="300" cy="200"/>
</svg>
```

<br/>


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


```javascript
// Animating CSS properties — same as HTML
gsap.to(".c1", {
  fill: "green",
  stroke: "red",
  duration: 3,
  scale: 3
})
```

- `fill`, `stroke`, `opacity`, `stroke-width` → animate directly (they're CSS properties)

- `cx`, `cy`, `r`, `rx`, `ry`, `points`, `d` → wrap in `attr: {}` (they're SVG geometry attributes, not CSS)

<br/>


```javascript
// ✅ CSS property — no attr needed
gsap.to("circle", { fill: "green", stroke: "red" })

// ✅ SVG geometry attribute — needs attr wrapper
gsap.to("circle", { attr: { cx: 100, r: 50 } })
```

### `vector-effect: non-scaling-stroke`

<br/>


```css
vector-effect: non-scaling-stroke;
```

---

### `will-change: stroke-width`

<br/>


```css
will-change: stroke-width;
```

---

## 1. The `<g>` Element — Your Spin Target

<br/>


```html
<svg viewBox="0 0 400 400" width="400" height="400">
  <g id="my-shape">
    <path d="..." />
    <path d="..." />
    <circle ... />
  </g>
</svg>
```

<br/>


```javascript
gsap.to("#my-shape", { rotation: 360, duration: 4, ease: "none", repeat: -1 })
```

---

## 2. The transformOrigin Problem — The Most Important Thing


```javascript
Element rotates around (0, 0) — the top-left corner of the SVG
Result: element swings around the canvas like a ball on a string ❌
```

---

### Fix A — CSS `transform-origin` (simplest)

<br/>


```css
#my-shape {
  transform-origin: center center;
  transform-box: fill-box;  /* ← critical. Makes transform-origin relative to the element's own bounding box */
}
```

---

### Fix B — GSAP `svgOrigin` property

<br/>


```javascript
gsap.to("#my-shape", {
  rotation: 360,
  svgOrigin: "200 200",   // "x y" — the centre of your SVG grid
  duration: 4,
  ease: "none",
  repeat: -1
})
```

---

### Which to use?

 | Approach | When | 
 | ---- | ---- | 
 | CSS `transform-box: fill-box` | Element is centered and you want it to spin around its own centre | 
 | GSAP `svgOrigin` | You know the exact SVG coordinates and want precise control | 

---

## 3. Basic Spin Animation


```javascript
// Continuous spin — infinite, linear
gsap.to("#my-shape", {
  rotation: 360,
  duration: 4,
  ease: "none",     // linear — no acceleration, constant speed
  repeat: -1,       // repeat forever
  transformOrigin: "center center"
})
```

---

## 4. Staggered Child Element Animation

<br/>


```javascript
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

<br/>


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

---

## 6. The Full Pattern

---

## 7. Common Mistakes

 | Mistake | What happens | Fix | 
 | ---- | ---- | ---- | 
 | Using `<img src="my.svg">` | GSAP can't see inside it | Use inline SVG in your HTML | 
 | Forgetting `transform-box: fill-box` | Element rotates around wrong point | Add it to CSS | 
 | Using any ease other than `"none"` on a spin | Rotation stutters on repeat | Use `ease: "none"` | 
 | Targeting `<svg>` instead of `<g>` | Whole canvas rotates including the viewBox | Target the `<g>` group inside | 
 | Setting `repeat: -1` without `ease: "none"` | Each loop has a slow start/end | Always pair infinite repeat with linear ease | 

---

<br/>


```javascript
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
 | ---- | ---- | 
 | Spin an element around its own centre | `transformOrigin: "center center"` | 
 | Spin an element around its corner or edge | `transformOrigin: "0% 0%"` etc. | 
 | Multiple elements orbiting around one shared canvas point | `svgOrigin: "x y"` | 
 | You know the exact SVG coordinates and need precision | `svgOrigin: "x y"` | 

---

## The Code


```javascript
const tl = gsap.timeline()
  .to("line, rect", { strokeDashoffset: -40, repeat: 20, ease: "none" })

GSDevTools.create({ animation: tl })
```

---

## `"line, rect"` — the target

---

## `strokeDashoffset` — the key property


```css
stroke-dasharray: 10;    /* dash 10px, gap 10px, repeat */
stroke-dasharray: 10 5;  /* dash 10px, gap 5px, repeat */
```


```plain text
dashoffset: 0    →  [--  --  --  --]
dashoffset: 5    →  [-  --  --  --  ]   shifted 5px
dashoffset: 10   →  [  --  --  --  -- ] shifted 10px
```


```plain text
dashoffset: 0    →  pattern moves forward →
dashoffset: -40  →  pattern moves backward ←
```

---

## `repeat: 20`

---

## `ease: "none"`

---

