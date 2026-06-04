# Filter Cards Notes + Intersection Observer

---

## 1. `data-*` Attributes

### What they are

Custom HTML attributes for storing extra information on elements that has no visual representation. Any attribute starting with `data-` is a data attribute.

```html
<article data-category="design" data-year="2024">...</article>
<button data-filter="all">All</button>
```

### Reading them in JS — two ways

```jsx
// Option 1 — getAttribute (what you used today)
card.getAttribute("data-category")   // → "design"

// Option 2 — dataset (camelCase conversion)
card.dataset.category                // → "design"
card.dataset.indexNumber             // data-index-number → camelCase
```

### Reading them in CSS

```css
/* target elements by their data attribute value */
.card[data-category="design"] .card-stripe { background: red; }

/* use the value as content */
.card::before { content: attr(data-category); }
```

### Rules

- Values are always **strings** — compare with `===` to a string, not a number
- Don't store content that should be visible to screen readers — assistive tech may not access it
- Don't use for search-indexable content — crawlers ignore data attribute values

---

## 2. Event Delegation

Instead of attaching a listener to every button, attach **one listener to the parent** and check what was clicked.

```jsx
// ❌ one listener per button — wasteful
buttons.forEach(btn => btn.addEventListener("click", fn))

// ✅ one listener on the parent — event delegation
document.querySelector(".filters").addEventListener("click", fn)
```

### Checking the target inside the handler

```jsx
function filterFunction(e) {
  if (e.target.tagName !== "BUTTON") return  // clicked the gap, bail early
  const filter = e.target.getAttribute("data-filter")
}
```

`e.target` is the actual element clicked. `e.currentTarget` is the element the listener is attached to.

---

## 3. classList API

Takes **bare class names only** — no dot, no CSS selector syntax.

```jsx
el.classList.add("active")       // ✅
el.classList.add(".active")      // ❌ looks for a class literally named ".active"

el.classList.remove("hidden")
el.classList.toggle("open")
el.classList.contains("active")  // → true / false
```

### The active button pattern

```jsx
// 1. wipe active from all buttons
document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"))

// 2. set active on the clicked one only
e.target.classList.add("active")
```

---

## 4. Filter Logic — the full pattern

```jsx
card_grid.forEach(card => {
  if (filter === "all") {
    card.classList.remove("hidden")       // show all
  } else if (card.getAttribute("data-category") === filter) {
    card.classList.remove("hidden")       // show match
  } else {
    card.classList.add("hidden")          // hide non-match
  }
})
```

**Key insight:** Check `filter === "all"` against the **button's value**, not the card's category — no card has `data-category="all"`.

---

## 5. Intersection Observer API

Lets you **asynchronously** watch when elements enter or leave the viewport — without scroll event listeners.

### Why asynchronous matters

The callback fires **after** the browser has already painted. This means:

- `io-init` (the invisible starting state) must be added **synchronously before the first paint**
- The callback handles the **end state** (`io-visible`) when the card scrolls in

```
Page load → io-init added (sync) → browser paints cards as invisible
           → observer fires (async) → io-visible added → card animates in
```

### Setup pattern

```jsx
// Step 1 — set starting state before observer exists
card_grid.forEach(card => card.classList.add("io-init"))

// Step 2 — configure options
const options = {
  root: null,        // null = use the browser viewport
  rootMargin: "0px", // no extra margin
  threshold: 0.1     // fire when 10% of card is visible
}

// Step 3 — define the callback
const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("io-init")  // remove start state
      entry.target.classList.add("io-visible")   // add end state
      observer.unobserve(entry.target)           // animate once only
    }
  })
}

// Step 4 — create observer and watch every card
const observer = new IntersectionObserver(callback, options)
card_grid.forEach(card => observer.observe(card))
```

### entry vs entry.target

`entry` is the **observation record** (metadata). The actual DOM element is at `entry.target`.

```jsx
entry.isIntersecting   // true/false — is it in the viewport?
entry.target           // the DOM element being observed
entry.boundingClientRect  // size + position info
```

### threshold

```jsx
threshold: 0.0   // fires when even 1px is visible
threshold: 0.1   // fires when 10% is visible  ← good for scroll animations
threshold: 1.0   // fires only when 100% is visible (may never fire for tall elements)
```

### unobserve — always call it for one-shot animations

```jsx
observer.unobserve(entry.target)  // stops watching this card after it animates in
observer.disconnect()              // stops watching ALL targets at once
```

---

## 6. Mistakes Made & Fixed

| Mistake | Why it was wrong | Fix |
| --- | --- | --- |
| `card.classList.add(".active")` | classList takes a name, not a CSS selector | `classList.add("active")` |
| `card.getAttribute("data-category") === all` | `all` is an undefined variable | `button_data_filter === "all"` |
| Adding `io-init` inside the filter function | Callback is async — too late | Add it once, outside, before the observer |
| `entry.classList.add(...)` | `entry` is metadata, not a DOM node | `entry.target.classList.add(...)` |
| Checking `card.category === "all"` | No card has that value — it's a button value | Check the button's filter value instead |

---

## 7. My Code — What I Built & Fixed

### The project

A filterable portfolio card grid with:

- Filter buttons (All / Design / Dev / Motion)
- Cards that show/hide based on active filter
- Scroll-in animation using IntersectionObserver

---

### Bug 1 — buttons accumulating `.active` instead of switching

**What was happening:** Every button clicked kept its active state, so after clicking a few filters all buttons looked selected.

**Root cause:** `.active` was being added to the clicked button but never removed from the others.

```jsx
// ❌ first attempt — only adds, never removes
e.target.classList.add("active")
```

**The fix — wipe all first, then add to just the one clicked:**

```jsx
// ✅ fixed
document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"))
e.target.classList.add("active")
```

**Lesson:** Whenever you're toggling an "only one at a time" state, always clear all first, then set the one you want.

---

### Bug 2 — CSS selector syntax inside classList

**What was happening:** The active class wasn't being applied or removed at all.

**Root cause:** Passing a CSS selector string instead of a class name.

```jsx
// ❌ broken — classList doesn't understand dots
button.classList.remove("filter-btn.active")
e.target.classList.add("filter-btn.active")
```

**The fix:**

```jsx
// ✅ just the class name, no dot
button.classList.remove("active")
e.target.classList.add("active")
```

**Lesson:** `classList` only takes the bare name. Dots are CSS syntax, not JS syntax.

---

### Bug 3 — checking the wrong thing for "all"

**What was happening:** The "All" button wasn't showing all cards.

**Root cause:** Checking the *card's* data-category against `"all"` — but no card has that value. Only the button does.

```jsx
// ❌ wrong — checks the card's category, which is never "all"
else if (card.getAttribute("data-category") === "all")

// ❌ also wrong — `all` without quotes is a JS variable (undefined)
else if (card.getAttribute("data-category") === all)
```

**The fix — check what the button said, not what the card says:**

```jsx
// ✅ check button_data_filter, which holds the button's value
if (button_data_filter === "all") {
  card.classList.remove("hidden")
}
```

**Lesson:** Always ask "where does this value actually live?" The `"all"` value comes from the button, not the card.

---

### Bug 4 — cards staying at bottom of grid when filtered

**What was happening:** Clicking "Motion" hid the other cards but they still took up space, pushing Motion cards to the bottom.

**Root cause:** `.hidden` only set `opacity: 0` — the cards were invisible but still in the grid flow.

```css
/* ❌ invisible but still occupying space */
.card.hidden {
  opacity: 0;
  transform: scale(0.95);
}
```

**The fix — remove them from the layout entirely:**

```css
/* ✅ removed from grid flow */
.card.hidden {
  display: none;
  opacity: 0;
  transform: scale(0.95);
}
```

**Lesson:** `opacity: 0` hides visually but the element still takes up space. `display: none` removes it from the layout entirely. Trade-off: you lose CSS transitions when using `display: none`.

---

### Bug 5 — `io-init` inside the filter function

**What was happening:** Cards were flashing visible on page load instead of animating in.

**Root cause:** `io-init` was added inside `filterFunction`, so it only ran on button click — not on page load before the first paint.

```jsx
// ❌ wrong place — only runs when a button is clicked
function filterFunction(e) {
  card_grid.forEach(card => card.classList.add("io-init")) // ← inside function
}
```

**The fix — run it once, synchronously, before the observer:**

```jsx
// ✅ outside the function — runs immediately on page load
card_grid.forEach(card => card.classList.add("io-init"))

const observer = new IntersectionObserver(callback, options)
```

**Lesson:** JS runs top to bottom synchronously. Code outside functions runs immediately. The observer fires asynchronously later. `io-init` needs to be set *before* the browser paints — so it goes outside, at the top level.

---

### Bug 6 — `entry.classList` instead of `entry.target.classList`

**What was happening:** `TypeError: entry.classList is undefined`

**Root cause:** The observer callback receives `entry` — an object describing the intersection event, not the element itself.

```jsx
// ❌ entry is the report, not the element
entry.classList.add("io-visible")
```

**The fix:**

```jsx
// ✅ the actual DOM element lives at entry.target
entry.target.classList.add("io-visible")
```

**Lesson:** When the browser gives you an event or observation object, the element is always one level deeper at `.target`. Same pattern appears in click events (`e.target`), mutation observers (`record.target`), and here.

---

### The final working code

```jsx
// ─── PART 1 — FILTER ───────────────────────────

const buttons   = document.querySelectorAll(".filter-btn")
const card_grid = document.querySelectorAll(".card")

buttons.forEach(button => button.addEventListener("click", filterFunction))

function filterFunction(e) {
  if (e.target.tagName !== "BUTTON") return

  const button_data_filter = e.target.getAttribute("data-filter")

  // update active button
  buttons.forEach(button => button.classList.remove("active"))
  e.target.classList.add("active")

  // show / hide cards
  card_grid.forEach(card => {
    if (button_data_filter === "all") {
      card.classList.remove("hidden")
    } else if (card.getAttribute("data-category") === button_data_filter) {
      card.classList.remove("hidden")
    } else {
      card.classList.add("hidden")
    }
  })
}

// ─── PART 2 — INTERSECTION OBSERVER ────────────

// runs once on load — before first paint
card_grid.forEach(card => card.classList.add("io-init"))

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1
}

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("io-init")
      entry.target.classList.add("io-visible")
      observer.unobserve(entry.target)
    }
  })
}

const observer = new IntersectionObserver(callback, options)
card_grid.forEach(card => observer.observe(card))
```

---

## 8. Quick Reference

```jsx
// Select one
document.querySelector(".card")

// Select all → returns NodeList (use forEach, not filter/map)
document.querySelectorAll(".card")

// Read data attribute
el.getAttribute("data-category")
el.dataset.category

// Toggle classes
el.classList.add("name")
el.classList.remove("name")
el.classList.toggle("name")
el.classList.contains("name")  // → boolean

// Intersection Observer
const observer = new IntersectionObserver(callback, { threshold: 0.1 })
observer.observe(el)
observer.unobserve(el)
```