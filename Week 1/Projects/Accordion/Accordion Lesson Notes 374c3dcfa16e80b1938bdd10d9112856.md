# Accordion Lesson Notes

---

## Bug fixes from this session

### 1. Reading vs writing attributes ✅ fixed

`getAttribute()` only *reads* an attribute — it doesn't change anything.

`setAttribute('name', 'value')` *writes* it. Always takes two arguments: the attribute name and the new value.

```jsx
// Wrong
button.getAttribute('aria-expanded') = 'false'

// Right
button.setAttribute('aria-expanded', 'false')
```

---

### 2. `e.target` vs `e.target.tagName` ✅ fixed

`e.target` is the DOM element — it has methods like `setAttribute()`.

`e.target.tagName` is just a string like `"BUTTON"` — strings don't have DOM methods.

```jsx
// Wrong
e.target.tagName.setAttribute(...)

// Right
e.target.setAttribute(...)
```

---

### 3. `classList.toggle` vs `classList.add` ✅ fixed

`toggle` adds a class if absent, removes it if present — unpredictable after a reset loop.

Since you already remove `"active"` from everything first, the class is always absent when you get to the clicked panel. `toggle` would just re-add it every time, making it impossible to close.

```jsx
// Wrong
classList.toggle("active")  // after a remove-all loop

// Right
classList.add("active")  // always intentional
```

---

### 4. CSS `transition` missing on `.accordion-panel` ✅ fixed

Without `transition`, when JS adds the `active` class, CSS just *snaps* from `max-height: 0` to `max-height: 500px` instantly. The `transition` property tells the browser to smoothly animate any change to `max-height` over 0.3 seconds.

```css
.accordion-panel {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease; /* 👈 this was missing */
}

.accordion-panel.active {
  max-height: 500px;
  /* removed display: block — it was doing nothing */
}
```

**Why it works — the flow:**

1. JS adds `.active` → `max-height` changes from `0` to `500px`
2. CSS sees that change and animates it smoothly over `0.3s`

The `ease` part means it starts fast and slows down at the end. You can also try `ease-in-out` or `linear` and see the difference.

> **The clue was already in your own code** — `.accordion` already had `transition: 0.4s` on it. Same property, different element.
> 

Also removed `display: block` from `.accordion-panel.active` — a `<div>` is already `display: block` by default. The panel is hidden by `max-height: 0`, not by `display: none`, so that line was doing nothing.

---

## Concepts you applied correctly

### Event delegation

One `addEventListener` on the container, not one per button. Use `e.target` to figure out what was actually clicked. Saves memory and works for dynamically added elements too.

### Close-all-then-open pattern

Loop through every panel and remove `"active"` first, then open only the clicked one. This guarantees only one panel is ever open at a time — no need to track which one was previously open.

---

## Bonus challenge (when you're ready)

**Toggle-to-close:** right now clicking an open panel keeps it open. To allow closing it, you'd need to remember which panel was active *before* the reset loop runs — then skip the `add` if it was the same one that was just clicked.

---

## What We Built

An accordion component that:

- Uses **event delegation** — one listener on the container, not one per button
- Traverses the DOM to find the right panel
- Toggles a class to show/hide content

---

## Event Delegation

Instead of adding a click listener to every button, you add **one listener to the parent container**. When anything inside it is clicked, the event "bubbles up" to the container. `e.target` tells you exactly what was clicked.

This is why you guard with:

```jsx
if (e.target.tagName === "BUTTON")
```

Because anything inside the container could be clicked — paragraphs, divs, etc.

---

## DOM Traversal — Going Up and Down the Tree

Think of your HTML as a **family tree**. Every element has relatives:

```
.accordion           → grandparent
  .accordion-item    → parent
    button           → sibling
    .accordion-panel → sibling
```

### Going UP ⬆️

`.parentElement` is a **real built-in DOM property**. Every element in the DOM automatically has it. It always points to the element directly above it in the HTML tree.

```jsx
e.target                → the button you clicked
e.target.parentElement  → .accordion-item (one level up)
```

You can even chain it to go up multiple levels:

```jsx
e.target.parentElement.parentElement  → .accordion (two levels up)
```

### Going DOWN ⬇️

`.querySelector()` searches **inside** any element — not just `document`. You've used it on `document` before, but it works on any element as the starting point.

```jsx
accordion.querySelector(...)            → searches whole accordion
e.target.parentElement.querySelector()  → searches only inside THIS accordion-item
```

That second one is key — it's why you find the *right* panel and not just the first one on the page.

### The Full Chain You Wrote

```jsx
e.target.parentElement.querySelector(".accordion-panel")
```

Reading it left to right:

1. `e.target` — the clicked button
2. `.parentElement` — climb up to `.accordion-item`
3. `.querySelector(".accordion-panel")` — find the panel inside that item

---

## Other DOM Traversal Properties Worth Knowing

| Property | What it does |
| --- | --- |
| `.parentElement` | Goes up one level |
| `.children` | All direct children (as a collection) |
| `.firstElementChild` | First direct child |
| `.lastElementChild` | Last direct child |
| `.nextElementSibling` | The element immediately after |
| `.previousElementSibling` | The element immediately before |

In your accordion, you could have also reached the panel using `.nextElementSibling` on the button — since the panel sits directly after the button in the HTML. Both approaches work!

---

## CSS `max-height` Trick

`display: none` **cannot animate** — it's either on or off instantly. The workaround:

- Start at `max-height: 0` + `overflow: hidden` → content is hidden and clipped
- Transition to a large `max-height` pixel value → appears to grow open smoothly
- `transition` property on the panel makes it animate between the two states