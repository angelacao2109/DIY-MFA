# ScrollTrigger.batch() Notes

---

## What is it?

`ScrollTrigger.batch()` watches a group of elements and fires callbacks when they enter or leave the viewport **in groups** — batching together elements that cross the threshold at roughly the same time.

Think of it as a smarter `forEach`. Instead of attaching an individual ScrollTrigger to every element, batch handles all of them with one declaration and groups elements that enter together so you can animate them as a unit.

---

## Why not just use forEach?

```jsx
// ❌ forEach — each card fires independently, even cards in the same row
document.querySelectorAll('.card').forEach(card => {
  ScrollTrigger.create({
    trigger: card,
    onEnter: () => gsap.to(card, { opacity: 1 })
  })
})

// ✅ batch — cards in the same row enter together and animate as a group
ScrollTrigger.batch('.card', {
  onEnter: (batch) => gsap.to(batch, { opacity: 1, stagger: 0.1 })
})
```

With `forEach`, cards in the same grid row trigger at slightly different times — stagger feels random and choppy. Batch groups them intentionally so a full row animates together with a clean, deliberate stagger.

---

## Basic Syntax

```jsx
// Step 1 — set initial state BEFORE batch fires
gsap.set('.project-card', { opacity: 0, y: 40 })

// Step 2 — batch watches all matching elements
ScrollTrigger.batch('.project-card', {
  onEnter:     (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }),
  onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 40, stagger: 0.05, duration: 0.4 }),
  start:    'top 85%',  // fires when top of element hits 85% down the viewport
  batchMax: 3,          // max elements per batch — match your grid column count
})
```

---

## The Callbacks

| Callback | When it fires |
| --- | --- |
| `onEnter` | Batch scrolls into view going **down** |
| `onLeave` | Batch scrolls out of view going **down** past end |
| `onEnterBack` | Batch comes back into view scrolling **up** |
| `onLeaveBack` | Batch scrolls out of view going **up** past start |

Each callback receives `batch` — an **array** of the elements in that group. Pass it directly to `gsap.to()` as the target.

```jsx
onEnter: (batch) => gsap.to(batch, { opacity: 1, stagger: 0.1 })
//                             ↑
//                  batch is an array of elements — gsap handles it
```

---

## `batchMax`

Controls how many elements can be in one batch. Set it to match your CSS grid column count.

```jsx
// 3-column grid → batchMax: 3
// Each row of 3 enters as one batch and staggers cleanly together
ScrollTrigger.batch('.card', {
  batchMax: 3,
  onEnter: (batch) => gsap.to(batch, { opacity: 1, stagger: 0.1 })
})
```

Without `batchMax`, GSAP groups based on timing alone. Setting it explicitly locks rows together regardless of slight timing differences.

---

## Play Once vs Play Every Time

```jsx
// Play once — no onLeaveBack, cards stay visible after animating in
ScrollTrigger.batch('.card', {
  onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
})

// Play every time — onLeaveBack resets cards when scrolling back up
ScrollTrigger.batch('.card', {
  onEnter:     (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
  onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 40 }),
})
```

---

## Always Set Initial State First

```jsx
// gsap.set() must come BEFORE ScrollTrigger.batch()
gsap.set('.card', { opacity: 0, y: 40 })

ScrollTrigger.batch('.card', { ... })
```

If you skip `gsap.set()`, cards are fully visible on load and then suddenly disappear when batch fires — users see a flash.

---

## batch vs forEach — When to Use Which

| Situation | Use |
| --- | --- |
| Grid of cards, rows should animate together | `batch` |
| Each element needs its own unique timing | `forEach` + `ScrollTrigger.create()` |
| Elements need different animations per item | `forEach` |
| Simple list, any stagger is fine | either works |

---

## Tips

- `batchMax` should always match your CSS grid column count.
- `gsap.set()` must always come before `ScrollTrigger.batch()` — order matters.
- The `batch` argument in callbacks is a plain array — you can use `gsap.to(batch, {...})` directly.
- Omit `onLeaveBack` for a play-once effect. Include it to reset on scroll up.
- `start: "top 85%"` is a good default for card reveals — fires before the card is fully visible so the animation is already playing as it enters.
