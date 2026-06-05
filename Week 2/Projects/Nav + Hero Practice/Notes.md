# GSAP Notes — Nav & Hero Animation

---

## What I built

A page load animation sequence using a single GSAP timeline:
1. Nav items stagger in from above
2. Hero words reveal upward with a mask effect

```javascript
let animation = gsap.timeline()
  .from(".nav-item", { y:-40, opacity:0, stagger: 0.1 })
  .from(".word",     { y:100, autoAlpha:0, stagger: 0.08 }, ">-0.2")
```

---

## Core concepts

### Tween vs Timeline

A **tween** is a single animation:
```javascript
gsap.from(".nav-item", { y:-20, opacity:0 })
// returns a Tween — can't chain other animations to it
```

A **timeline** is a container that holds multiple tweens in sequence:
```javascript
const tl = gsap.timeline()
tl.from(".nav-item", { y:-20, opacity:0 }) // plays first
tl.from(".word",     { y:50,  opacity:0 }) // plays after
```

Always use a timeline when you have more than one animation — it keeps everything coordinated and lets you chain, overlap, and label animations.

---

### .from() vs .to()

| Method | What it does |
|--------|-------------|
| `gsap.from()` | Animates FROM your values → to the element's natural state |
| `gsap.to()` | Animates FROM the element's natural state → TO your values |
| `gsap.fromTo()` | You define both start AND end explicitly |

```javascript
// WRONG — this animates the nav items away (disappear upward)
gsap.to(".nav-item", { y:-40, opacity:0 })

// RIGHT — animates them in from above
gsap.from(".nav-item", { y:-40, opacity:0 })
```

---

### autoAlpha vs opacity

```javascript
// basic — only controls opacity
gsap.from(".word", { opacity: 0 })

// better — controls opacity AND visibility
gsap.from(".word", { autoAlpha: 0 })
```

`autoAlpha: 0` sets both `opacity: 0` and `visibility: hidden`.
This means the element is removed from the tab order and screen readers
while it's hidden. GSAP's recommended way to fade things in/out.

---

### Stagger

Stagger delays each element in a matched set by the given amount:

```javascript
gsap.from(".nav-item", { 
  y: -40, 
  opacity: 0, 
  stagger: 0.1   // 0.1s delay between each .nav-item
})
// item 1 starts at 0s
// item 2 starts at 0.1s
// item 3 starts at 0.2s ... etc
```

---

### Timeline position parameter

The third argument to `.from()` on a timeline controls *when* it starts:

```javascript
const tl = gsap.timeline()
tl.from(".nav-item", { y:-40, opacity:0, stagger: 0.1 })
tl.from(".word",     { y:100, autoAlpha:0, stagger: 0.08 }, ">-0.2")
//                                                            ^^^^^^
//                                          ">" = after previous ends
//                                          "-0.2" = 0.2s before it ends
//                                          so they slightly overlap
```

Common position values:
```javascript
">"        // start after previous animation ends
"<"        // start at the same time as previous
">-0.2"    // start 0.2s before previous ends (overlap)
"+=0.5"    // start 0.5s after previous ends (gap)
2          // start at exactly 2 seconds on the timeline
"myLabel"  // start at a named label
```

---

### Timeline labels

Labels are named bookmarks on a timeline. Useful when your timeline gets long:

```javascript
const tl = gsap.timeline()
tl.from(".nav-item", { y:-40, opacity:0, stagger: 0.1 })
tl.add("heroStart")   // drop a label here
tl.from(".word", { y:100, autoAlpha:0 }, "heroStart")
tl.from(".hero-sub", { opacity:0 }, "heroStart+=0.3")  // 0.3s after label
```

---

## The word reveal mask — how it works

### HTML structure
```html
<span class="word-wrapper">   ← the mask (overflow: hidden)
  <span class="word">We</span>  ← what GSAP animates
</span>
```

### CSS
```css
.word-wrapper {
  display: inline-block;
  overflow: hidden;      /* clips anything outside its bounds */
  vertical-align: bottom;
}

.word {
  display: inline-block; /* needed for transform to work on a span */
}
```

### Why it works

When GSAP animates `.word` from `y: 100`, the word starts 100px below
its natural position. The `.word-wrapper` clips it — you can't see it
below the line. As it rises up into the wrapper's bounds it becomes
visible. This creates the "rising from the baseline" effect without
needing any masking library.

You only ever animate `.word`. The wrapper just sits there and clips.

---

## Bugs I hit and fixed

### 1. `require()` in browser code
```javascript
// WRONG — require() is Node.js only, crashes in the browser
const { SplitText } = require("gsap/all")

// This killed ALL code below it with:
// ReferenceError: require is not defined
```
Delete any `require()` when writing plain browser JavaScript.

### 2. CSS transition conflicting with GSAP
```css
/* WRONG — this fights GSAP when it animates opacity */
.nav-cta {
  transition: opacity 0.2s;
}
```
GSAP and CSS transitions both trying to control `opacity` at the
same time causes conflicts. GSAP loses. The button appeared to not
animate at all.

```css
/* RIGHT — only transition properties GSAP isn't touching */
.nav-cta {
  transition: background 0.2s;
}
```

**Rule:** never put a CSS `transition` on the same property GSAP is animating.
The worst offender is `transition: all` — it catches everything.

### 3. `.to()` instead of `.from()`
```javascript
// animated items away — they disappeared
gsap.to(".nav-item", { y:-40, opacity:0 })

// correct — items start hidden and animate in
gsap.from(".nav-item", { y:-40, opacity:0 })
```

---
