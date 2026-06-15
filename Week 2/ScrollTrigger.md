# ScrollTrigger

---

## What is GSAP ScrollTrigger?

**GSAP** (GreenSock Animation Platform) is a JavaScript animation library.
**ScrollTrigger** is a plugin that links animations to the user's scroll position.

---

## 1. Setup

```jsx
gsap.registerPlugin(ScrollTrigger)
```

Must be called once before using ScrollTrigger. Activates the plugin.

---

## 1b. `ScrollTrigger.defaults()` — Global Settings

Set properties once and every ScrollTrigger created after it inherits them automatically. Saves you repeating the same values on every single instance.

```jsx
// Call this right after registerPlugin, before creating any ScrollTriggers
ScrollTrigger.defaults({
  start: "top 80%",
  toggleActions: "play none none reverse",
})

// Now every ScrollTrigger gets those values for free
ScrollTrigger.create({ trigger: ".box-1" })  // inherits start + toggleActions
ScrollTrigger.create({ trigger: ".box-2" })  // same
ScrollTrigger.create({ trigger: ".box-3", start: "top 50%" })  // overrides start only
```

**Any property can be a default:**

| Common default | Why you'd set it |
| --- | --- |
| `start: "top 80%"` | Consistent trigger point across all entrance animations |
| `toggleActions: "play none none reverse"` | Standard play/reverse behaviour everywhere |
| `scroller: ".smooth-scroll"` | Using Locomotive/Lenis — set once, don't repeat on every ST |
| `markers: true` | Turn on all markers at once during development |

**The override rule:** if a specific ScrollTrigger sets the same property, it wins over the default. Defaults are fallbacks, not locks.

```jsx

// Real-world example — Locomotive Scroll setup

ScrollTrigger.defaults({
  scroller: ".smooth-scroll"   // every ST watches this container, not the window
})

// You no longer need scroller: on every individual ScrollTrigger
gsap.from(".card", {
  y: 40,
  scrollTrigger: {
    trigger: ".card",
    start: "top 85%"
    // scroller is inherited from defaults — no need to repeat it
  }
})
```

---

## 2. `gsap.from()` vs `gsap.to()`

| Method | Behavior |
| --- | --- |
| `gsap.from()` | Animates **FROM** given values → to current/natural state |
| `gsap.to()` | Animates **FROM** current state → TO given values |
| `gsap.fromTo()` | You define both start and end values |

---

## 3. Basic ScrollTrigger Example

```html
<div class="animation">
  <img class="herman" src="herman.svg" />
</div>
```

```jsx
gsap.from(".herman", {
  duration: 10,
  x: "-50vw",       // starts 50% viewport width to the left
  rotation: -360,   // starts rotated -360° (one full counterclockwise spin)
  ease: "linear",   // constant speed, no acceleration

  scrollTrigger: {
    trigger: ".herman",
    markers: true,          // shows debug lines — remove in production
    start: "top 75%",       // when top of .herman hits 75% down the viewport
    end: "bottom 25%",      // when bottom of .herman hits 25% down the viewport
    toggleActions: "restart complete reverse reset"
  }
})
```

Herman slides in from the left while spinning, ending at its natural position.

---

## ⚠️ Don't Use the Animated Element as the Trigger

> You may be tempted to use the element you are animating as the ScrollTrigger
trigger element. This can cause unexpected results.
> 

**Two reasons to avoid it:**

**1. The trigger enters the viewport before the element is visible.**
ScrollTrigger fires based on the trigger element's position in the DOM — but if
that element is currently off-screen (because the animation moved it), the trigger
can fire while nothing is actually visible yet. You end up animating things the
user can't see.

**2. It can break on resize.**
ScrollTrigger records the start/end values based on the trigger element's size and
position. If the trigger element is also being animated, it may be mid-motion when
a `refresh()` fires (e.g. on window resize), which causes ScrollTrigger to record
bad values and get out of sync.

**✅ The fix:** use a parent wrapper as the trigger, animate children inside it.

```jsx
// ❌ Risky — animating the trigger element itself
gsap.from(".card", {
  y: 100,
  scrollTrigger: { trigger: ".card" }
})

// ✅ Safe — trigger is the wrapper, animate the child
gsap.from(".card", {
  y: 100,
  scrollTrigger: { trigger: ".card-wrapper" }
})
```

---

## 4. `start` and `end` Syntax

Format: `"[trigger position] [viewport position]"`

```
start: "top 75%"
        ↑       ↑
   element   viewport
   edge      position
```

| Value | Meaning |
| --- | --- |
| `"top top"` | Top of element meets top of viewport |
| `"top center"` | Top of element meets center of viewport |
| `"top 75%"` | Top of element meets 75% down the viewport |
| `"bottom 25%"` | Bottom of element meets 25% down the viewport |
| `"+=500"` | 500px after the start point |

---

## 5. `toggleActions`

Controls what happens at **4 scroll events**, in this order:

```
toggleActions: "onEnter  onLeave  onEnterBack  onLeaveBack"
```

| Event | When it fires |
| --- | --- |
| `onEnter` | Scrolling **down** past `start` |
| `onLeave` | Scrolling **down** past `end` |
| `onEnterBack` | Scrolling **up** past `end` |
| `onLeaveBack` | Scrolling **up** past `start` |

### Available actions:

`play` `pause` `resume` `reset` `restart` `complete` `reverse` `none`

### Common patterns:

```jsx
// Play once, do nothing on scroll back
toggleActions: "play none none none"

// Play forward and backward with scroll
toggleActions: "play none reverse none"

// Full interactive — restart every time
toggleActions: "restart complete reverse reset"
```

---

## 6. Pin

**Pinning** freezes an element on screen while the user continues to scroll.
The element stays in place until the pin zone ends, then scrolls away normally.

```jsx
gsap.to(".box", {
  scrollTrigger: {
    trigger: ".box",
    start: "top top",
    end: "+=500",      // pin lasts for 500px of scrolling
    pin: true,
    markers: true
  }
})
```

### Pin options:

| Syntax | Behavior |
| --- | --- |
| `pin: true` | Pins the trigger element itself |
| `pin: ".sidebar"` | Pins a different element |
| `pinSpacing: true` | (default) Adds space below to prevent layout jump |
| `pinSpacing: false` | Removes spacing — content may overlap |

### Visual flow:

```
Normal scroll
     ↓
Element hits start  →  PIN starts (element freezes)
     ↓
User keeps scrolling (animation plays if scrub is on)
     ↓
End point reached  →  UNPIN (element scrolls away normally)
```

---

## 7. `scrub`

Ties the animation progress directly to the scroll position.

| Value | Behavior |
| --- | --- |
| `scrub: true` | Animation linked 1:1 to scroll |
| `scrub: 1` | 1-second smoothing/lag — feels more polished |
| No scrub | Animation plays freely at its own speed |

```jsx
gsap.to(".text", {
  x: 500,
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "+=800",
    pin: true,
    scrub: 1,
  }
})
```

---

## 8. Horizontal Scroll Pattern (Pin + Scrub)

A common real-world use: scroll down, but content moves sideways.

```jsx
gsap.to(".cards", {
  x: () => -(cards.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".cards-wrapper",
    start: "top top",
    end: "+=2000",
    pin: true,
    scrub: 1,
  }
})
```

```
User scrolls DOWN ↓  →  content moves LEFT →

[ Card 1 ] [ Card 2 ] [ Card 3 ] [ Card 4 ]
           ← ← ← ← ← ← ←

Section stays pinned until all cards have passed.
```

---

## 9. `ScrollTrigger.create()` — Separate Pattern

Instead of embedding `scrollTrigger: {}` inside a tween, you can create the
ScrollTrigger separately and pass it a pre-built animation via `animation:`.

**Why use this pattern:**

- Keeps animation logic and scroll logic decoupled
- Easier when reusing the same timeline across multiple elements
- Cleaner inside `forEach` loops when animating many repeated elements

```jsx
// Each .banner gets its own timeline + its own ScrollTrigger
let banners = document.querySelectorAll(".banner")

banners.forEach((element) => {
  // Scope child selectors to THIS banner, not the whole page
  let background = element.querySelector(".background")
  let headings   = element.querySelectorAll("h1, h2")

  // Build the timeline independently — no scrollTrigger inside it
  let tl = gsap.timeline()
    .from(background, { backgroundPosition: "60% 0%", filter: "brightness(0.1)", duration: 1 })
    .from(headings,   { y: 200, stagger: 0.1 }, 0)  // ← 0 = start at same time as previous

  // Attach the timeline to a ScrollTrigger separately
  ScrollTrigger.create({
    trigger: element,          // wrapper is the trigger (not the animated children)
    start: "top 70%",
    toggleActions: "play none none reverse",
    animation: tl              // pass the timeline in here
  })
})
```

### Key things happening here:

| Detail | Why |
| --- | --- |
| `element.querySelector()` | Scopes selection to the current banner — avoids grabbing the wrong `.background` from another section |
| `trigger: element` | The wrapper div is the trigger, not the elements being animated (see ⚠️ warning above) |
| `animation: tl` | Links the pre-built timeline to this ScrollTrigger |
| `toggleActions: "play none none reverse"` | Plays forward on scroll down, reverses on scroll back up, ignores the middle two events |
| Second `0` argument in `.from(headings, {...}, 0)` | Position parameter — starts headings at time 0 in the timeline (same as background) |

---

## 10. `ScrollTrigger.scrollerProxy()` — Custom Scroll Containers

### The problem it solves

ScrollTrigger reads scroll position from `window.scrollY` by default. Smooth scroll
libraries (Locomotive Scroll, Smooth Scrollbar, etc.) work by **hijacking the native
scroll** — they intercept the user's scroll input and instead move a wrapper `<div>`
using CSS `transform`. This means `window.scrollY` stays at `0` the whole time.

ScrollTrigger has no idea scrolling is happening. Animations never fire.

```
Native scroll:    window.scrollY changes  →  ScrollTrigger reads it  ✅
Smooth scroll:    window.scrollY = 0      →  ScrollTrigger reads 0   ❌
                  library moves a div via transform instead
```

`scrollerProxy()` is the bridge. You tell ScrollTrigger:

> "Don't read from the window. Read from this element instead.
Here's how to get its scroll position."
> 

---

### Syntax

```jsx
ScrollTrigger.scrollerProxy(element, {
  scrollTop(value) { ... },        // getter AND setter for vertical scroll
  scrollLeft(value) { ... },       // getter AND setter for horizontal (if needed)
  getBoundingClientRect() { ... }, // size/position of the container
  pinType: "transform" | "fixed"   // how pinned elements should be positioned
})
```

---

### Full setup with Locomotive Scroll

```jsx
gsap.registerPlugin(ScrollTrigger)

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".smooth-scroll"),
  smooth: true
})

// 1. Every time Locomotive scrolls, tell ScrollTrigger to update
locoScroll.on("scroll", ScrollTrigger.update)

// 2. Tell ScrollTrigger how to read/set scroll values for this container
ScrollTrigger.scrollerProxy(".smooth-scroll", {

  // arguments.length === 0 → getter (return current scroll position)
  // arguments.length === 1 → setter (scroll to the given value)
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)   // set
      : locoScroll.scroll.instance.scroll.y // get
  },

  // Tell ScrollTrigger the size of the "viewport" (usually just the window)
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
  },

  // Locomotive uses CSS transforms to move things — pins need to match
  pinType: document.querySelector(".smooth-scroll").style.transform
    ? "transform"
    : "fixed"
})

// 3. When ScrollTrigger refreshes (e.g. on resize), update Locomotive too
ScrollTrigger.addEventListener("refresh", () => locoScroll.update())

// 4. Do this last — recalculates all positions with the proxy in place
ScrollTrigger.refresh()
```

---

### The `scrollTop` getter/setter trick

The `scrollTop` method acts as both a getter and a setter using `arguments.length`:

```jsx
scrollTop(value) {
  return arguments.length
    ? locoScroll.scrollTo(value, 0, 0)    // called with a value → SET
    : locoScroll.scroll.instance.scroll.y  // called with no value → GET
}
```

ScrollTrigger calls it both ways internally — as a getter to read where things are,
and as a setter to programmatically scroll (e.g. when a link jumps to an anchor).

---

### Using `scroller` in individual ScrollTriggers

Once the proxy is set up, each ScrollTrigger instance also needs to know
**which element is the scroller** via the `scroller` property:

```jsx
gsap.from(".box", {
  x: -200,
  scrollTrigger: {
    trigger: ".box",
    scroller: ".smooth-scroll",  // ← tell it to watch the custom container
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
})
```

You can set this once globally to avoid repeating it everywhere:

```jsx
ScrollTrigger.defaults({ scroller: ".smooth-scroll" })
```

---

### `pinType` — why it matters

When Locomotive (or any transform-based library) moves the page, it does so with
`transform: translateY(...)` on the wrapper. CSS `position: fixed` is relative to
the viewport, not the transformed container — so pinned elements end up in the
wrong place.

Setting `pinType: "transform"` tells ScrollTrigger to pin using `transform` instead
of `fixed`, which keeps everything in sync with the library's movement.

```jsx
// Auto-detect which to use:
pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
```

---

### Modern alternative: Lenis

Lenis is a newer smooth scroll library with a much simpler GSAP integration —
**no `scrollerProxy` needed**:

```jsx
const lenis = new Lenis()

// Just hook Lenis into GSAP's ticker
lenis.on("scroll", ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

Lenis is generally the recommended choice for new projects. `scrollerProxy` is
still the right tool when working with Locomotive Scroll or Smooth Scrollbar.

---

### Summary

| Step | What it does |
| --- | --- |
| `ScrollTrigger.scrollerProxy(el, {...})` | Tells ST how to read scroll values from the custom container |
| `locoScroll.on("scroll", ScrollTrigger.update)` | Keeps ST in sync as the library scrolls |
| `ScrollTrigger.addEventListener("refresh", ...)` | Keeps the library in sync when ST recalculates |
| `ScrollTrigger.refresh()` | Recalculates all positions after setup — call this last |
| `scroller: ".smooth-scroll"` | Tells each ScrollTrigger instance which element to watch |
| `ScrollTrigger.defaults({ scroller: ... })` | Sets the scroller once globally |

---

## 11. `toggleClass`

Instead of controlling a tween or timeline, `toggleClass` uses the scroll trigger
to **add and remove a CSS class** on the trigger element. The class is added when the
trigger is active, removed when it isn't.

Useful for:

- Showing/hiding UI elements via CSS (no GSAP tween needed)
- Triggering CSS transitions driven by class state
- Keeping animation logic in CSS where it belongs

```jsx
ScrollTrigger.create({
  trigger: "body",
  start: "75% bottom",
  toggleClass: "active"
})
```

By default the class is added to the **trigger element itself**. To target a
different element, use the object form:

```jsx
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  toggleClass: { targets: ".message", className: "active" }
})
```

### Demo — fixed "back to top" bar

`body` is a valid trigger. `"75% bottom"` means: when the point 75% down the body
crosses the bottom of the viewport — i.e. the user is near the end of the page.
`active` is toggled on `body`, and a CSS descendant rule shows the bar.

```html
<div class="message">
  <a href="#top">back to top</a>
</div>
<div class="fullscreen light">Scroll Down</div>
<div class="fullscreen dark">Section 2</div>
<div class="fullscreen light">Section 3</div>
<div class="fullscreen pink">Section 4</div>
```

```css
.message {
  visibility: hidden;
  background: black;
  padding: 20px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 8px 8px 0 0;
}

/* ← .active on body cascades down to .message */
.active .message {
  visibility: visible;
}

.fullscreen {
  height: 100vh;
  display: flex;
  align-items: center;
  padding-left: 10vw;
  font-size: 8vw;
  font-family: Kanit, sans-serif;
}
.dark  { background: #333; color: #ccc; }
.light { background: #ccc; }
.pink  { background: #fcf; }

a { color: #f60; }
```

```jsx
ScrollTrigger.create({
  trigger: "body",
  start: "75% bottom",
  toggleClass: "active"
})
```

```
User at top of page   →  body has no .active  →  .message is hidden
User scrolls to 75%+  →  body gets .active    →  .message is visible
User scrolls back up  →  .active is removed   →  .message is hidden again
```

> **Note on using `body` as the trigger:** `body` works fine — it's just a DOM element
like any other. The same rule from section ⚠️ still applies though: don't use it as
the trigger if `body` itself is the thing being animated.
> 

---

## 12. `fastScrollEnd`

**New in GSAP 3.8**

When a user scrolls very quickly through a trigger zone, the animation may not
reach its natural end state — they fly past the `end` point before the tween
finishes playing. `fastScrollEnd` fixes this by **snapping the animation to
complete or reset** when the user exits the trigger area at a speed greater than
**2500px/sec**.

```jsx
ScrollTrigger.create({
  trigger: ".section",
  start: "top 80%",
  end: "bottom 20%",
  fastScrollEnd: true,
  toggleActions: "play none none reverse"
})
```

| Value | Behavior |
| --- | --- |
| `fastScrollEnd: true` | Snaps at the default threshold (2500px/sec) |
| `fastScrollEnd: 3000` | Custom threshold — higher = less sensitive |

**Without `fastScrollEnd`:** rapid scroll leaves elements frozen mid-animation,
since the tween never reached its end state before the trigger exited.

**With `fastScrollEnd`:** GSAP detects the fast exit and immediately completes
or reverses the animation to a clean state.

Most useful when combined with `toggleActions` that includes `reverse` — without
snapping, a fast upward scroll could leave a reversed animation stuck halfway.

---

## 13. Quick Reference

| Property | Type | Purpose |
| --- | --- | --- |
| `trigger` | String / Element | Element that drives the animation |
| `start` | String | When the animation begins |
| `end` | String | When the animation ends |
| `markers` | Boolean | Show debug start/end lines |
| `pin` | Boolean / String | Freeze element on screen |
| `pinSpacing` | Boolean | Add space to prevent layout jump |
| `scrub` | Boolean / Number | Tie animation to scroll position |
| `toggleActions` | String | 4 actions for 4 scroll events |
| `toggleClass` | String / Object | Add/remove a CSS class instead of running a tween |
| `fastScrollEnd` | Boolean / Number | Snap animation to end/start on fast scroll exit (GSAP 3.8+) |
| `animation` | GSAP tween / timeline | Link a pre-built animation (used with `ScrollTrigger.create()`) |
| `scroller` | String / Element | Custom scroll container (needed with `scrollerProxy`) |

---

## 14. Tips

- Always remove `markers: true` before going to production.
- Use `scrub` with `pin` for interactive scroll-driven animations.
- `ease: "none"` or `"linear"` works best with `scrub` — no acceleration curve fighting the scroll.
- `end: "+=Npx"` is the most reliable way to control pin duration.
- **Don't use the animated element as the trigger** — use a parent wrapper instead.
- When looping over repeated elements with `forEach`, scope child selectors with `element.querySelector()` not `document.querySelector()`.
- When using a smooth scroll library, set up the proxy **before** creating any ScrollTriggers, and always call `ScrollTrigger.refresh()` last.
- Prefer `toggleClass` over a tween when the end result is a simple class-driven CSS change — it's less code and keeps styling in CSS.
- Add `fastScrollEnd: true` whenever you use `toggleActions` with `reverse` — it prevents elements getting stuck mid-animation on fast scrolls.
- `body` is a valid ScrollTrigger trigger for page-level events (e.g. "show this UI after the user is 75% through the page").
