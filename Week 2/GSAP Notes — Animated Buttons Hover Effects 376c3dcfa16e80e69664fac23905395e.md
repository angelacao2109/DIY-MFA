# GSAP Notes — Animated Buttons: Hover Effects

# GSAP Notes — Animated Buttons: Hover Effects

---

## The core pattern for all hover animations

Create the timeline **paused**, then use mouse events to control it:

```jsx
// 1. create it paused — nothing plays yet
const tl = gsap.timeline({ paused: true }).to(...)

// 2. mouse events tell it what to do
item.addEventListener("mouseenter", () => tl.play())
item.addEventListener("mouseleave", () => tl.reverse())
```

This is the opposite of the page-load animations (which autoplay).
Hover animations always start paused and are driven by events.

---

## Lesson 1 — Simple Rollover / Hover Effect

```jsx
const item = document.querySelector(".item")
gsap.defaults({ duration: 0.3 })

const tl = gsap
  .timeline({ paused: true })
  .to(".text", { color: "white", x: 10 })
  .to(".dot",  { backgroundColor: "#F93", scale: 1.5 }, 0)

item.addEventListener("mouseenter", () => tl.play())
item.addEventListener("mouseleave", () => tl.reverse())
```

### What to notice

**`gsap.defaults({ duration: 0.3 })`** — sets duration for every tween
in the file so you don't have to repeat it. Put it once at the top.

**`.to(".dot", { ... }, 0)`** — the `0` is the position parameter.
It makes the dot animation start at 0 seconds (same time as the text),
so both animate simultaneously even though they're separate `.to()` calls.

**`tl.reverse()`** on mouseleave — plays the timeline backwards from
wherever the playhead currently is. If the user quickly moves the mouse
out, it reverses from the middle of the animation, not from the end.
This is what makes the transition feel smooth rather than snapping.

---

## Lesson 2 — Hover Effects for Multiple Elements

The problem with a single selector: if you attach one timeline to
`.item`, all items animate together when any one is hovered.

**The fix:** `querySelectorAll` + `forEach` — each item gets its
own independent timeline.

```jsx
const items = document.querySelectorAll(".item")
gsap.defaults({ duration: 0.3 })

items.forEach(function(item) {

  // timeline is scoped INSIDE the loop
  // each item gets its own separate tl
  const tl = gsap
    .timeline({ paused: true })
    .to(item.querySelector(".text"), {   // ← scoped to THIS item
      color: "white",
      x: 10,
      scale: 1.2,
      transformOrigin: "left center"
    })
    .to(item.querySelector(".dot"), { backgroundColor: "#F93", scale: 1.5 }, 0)

  item.addEventListener("mouseenter", () => tl.play())
  item.addEventListener("mouseleave", () => tl.reverse())
})
```

### Key concept — `item.querySelector()` vs `document.querySelector()`

```jsx
// WRONG — finds the FIRST .text on the whole page
.to(document.querySelector(".text"), { ... })

// RIGHT — finds .text only inside the current item
.to(item.querySelector(".text"), { ... })
```

Scoping the selector to `item` is what keeps each hover isolated.
Without it, hovering any item would animate the same elements every time.

### Why the timeline lives inside the loop

```jsx
items.forEach(function(item) {
  const tl = gsap.timeline({ paused: true }) // ← new tl each iteration
  // ...
})
```

Each loop iteration creates a fresh `tl` variable. By the time the loop
finishes, there are 4 separate timeline objects — one per item. Each
`mouseenter` listener closes over its own `tl`, so they never interfere.

---

## Lesson 3 — Constant Hover Pulse with Smooth Reset

A pulsing animation that runs continuously on hover, then smoothly
returns to normal when the mouse leaves.

```jsx
const cta = document.querySelector(".cta")

// repeating tween — starts paused
const scaleTween = gsap.to(cta, {
  scale: 1,
  repeat: -1,   // repeat forever
  yoyo: true,   // ping-pong back and forth
  paused: true
})

cta.addEventListener("mouseenter", () => scaleTween.restart())

cta.addEventListener("mouseleave", () => {
  scaleTween.pause()                  // stop the repeating tween
  gsap.to(cta, { scale: 0.8 })       // smoothly return to start size
})
```

### New properties

**`repeat: -1`** — repeat forever. Any positive number repeats that
many times. `-1` means infinite.

**`yoyo: true`** — after each repeat, plays backwards then forwards.
Creates the ping-pong pulse effect. Without it, the element would
jump back to the start each loop.

**`scaleTween.restart()`** — rewinds to the beginning and plays.
Used here instead of `play()` so that if the user re-hovers before
the reset tween finishes, the pulse starts cleanly from the beginning
rather than resuming from a weird mid-state.

**`scaleTween.pause()`** — freezes wherever the tween currently is.
Then a separate `gsap.to()` takes over to smoothly animate back to `0.8`.

### Why a separate tween for the exit

```jsx
cta.addEventListener("mouseleave", () => {
  scaleTween.pause()           // stop pulsing — but element is stuck mid-scale
  gsap.to(cta, { scale: 0.8 }) // ← new tween handles the return smoothly
})
```

You can't use `reverse()` here because the tween repeats infinitely —
reversing an infinite tween doesn't work as expected. Instead: pause
it, then fire a fresh one-shot tween to return to the resting state.

---

## The 4 edge cases a good hover animation handles

The teacher's checklist for bulletproof hover animations:

| Situation | What should happen |
| --- | --- |
| mouseleave while enter animation is still playing | reverse from current position, not from end |
| mouseenter while exit animation is reversing | interrupt and play forward again |
| mouseleave after enter animation fully completed | reverse smoothly from end |
| mouseleave while exit animation is already playing | nothing weird — keep reversing |

**`play()` and `reverse()` handle all four automatically** because they
operate from the current playhead position. This is why the paused
timeline + play/reverse pattern is the standard approach.

---