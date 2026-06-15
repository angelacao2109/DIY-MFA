# Three Ways to Create a ScrollTrigger

---

## Pattern 1 — `ScrollTrigger.create()`

**Use when:** you only need scroll behaviour — no animation. Just a pin, or watching scroll position with callbacks. No `gsap.to()` needed because nothing is being animated.

```js
ScrollTrigger.create({
  trigger: ".sticky-inner",
  pin: ".sticky-left",
  start: "top 20%",
  end: "bottom 80%",
  pinSpacing: false,
})
```

---

## Pattern 2 — Timeline + `ScrollTrigger.create(animation:)`

**Use when:** you have a complex sequence of animations (multiple tweens in a specific order) that you want tied to scroll. Build the timeline separately, then hand it to ST via `animation:`. Keeps animation logic and scroll logic readable and separate.

```js
let tl = gsap.timeline()

tl.fromTo(".scrub-line-fill", { width: "0%" }, { width: "100%", duration: 4 }, 0)
// ... rest of tweens

ScrollTrigger.create({
  trigger: "#scrub",
  pin: true,
  scrub: 1,
  animation: tl   // ← the named timeline gets passed in here
})
```

---

## Pattern 3 — Inline `scrollTrigger` inside `gsap.to()`

**Use when:** you have ONE animation tied to scroll. Simplest syntax — everything lives in one place. The `scrollTrigger` config sits inside the vars object alongside the animation properties (`x`, `y`, `opacity` etc.)

```js
gsap.to(".horiz-track", {
  x: -(document.getElementById('horiz-track').scrollWidth - window.innerWidth),
  scrollTrigger: {          // ← nested directly inside gsap.to()
    trigger: "#horiz-outer",
    pin: true,
    scrub: 1,
    end: "+=" + (document.getElementById('horiz-track').scrollWidth - window.innerWidth),
  }
})
```

---

## Quick Decision Guide

| Situation | Pattern to use |
| --- | --- |
| No animation, just scroll behaviour (pin, callbacks) | `ScrollTrigger.create()` |
| Multiple animations in sequence tied to scroll | Timeline + `ScrollTrigger.create(animation:)` |
| Single animation tied to scroll | Inline `scrollTrigger` inside `gsap.to()` |
