# JS Events & ARIA Tabs — Study Notes

---

## 1. Event Bubbling

When an event fires on an element, it first runs handlers on **that element**, then **travels up the DOM** through every parent all the way to the document root.

```html
<div id="parent">
  <button id="child">Click</button>
</div>
```

```js
parent.addEventListener("click", () => console.log("parent clicked"));
child.addEventListener("click",  () => console.log("child clicked"));

// Click the button → console shows:
// child clicked
// parent clicked
```

**Travel path for `FORM > DIV > P` — clicking `<P>`:**
```
P → DIV → FORM → BODY → HTML → document
```

**Why it exists:** Handle events higher up, avoid adding listeners to every element, and handle elements added dynamically later.

> Almost all events bubble. Notable exception: `focus` does **not** bubble.

---

## 2. Event Capturing

There's a lesser-used phase that happens **before** bubbling — the event travels *down* from the root to the target first.

### The 3 Phases of Event Propagation

1. **Capturing** — event travels *down* from root to the target element.
2. **Target** — event reaches the target element.
3. **Bubbling** — event travels *up* from the target back to the root.

By default, handlers only run during the **bubbling** phase (phases 2 & 3).

To listen during the **capturing** phase, pass `true` as the third argument:

```js
elem.addEventListener("click", handler, true);   // capture phase
elem.addEventListener("click", handler, false);  // bubbling phase (default)
```

> To remove a capturing handler, `removeEventListener` must also pass `true`.

- `event.eventPhase` → returns `1` (capturing), `2` (target), or `3` (bubbling)

---

## 3. `event.target` vs `event.currentTarget`

```js
list.addEventListener("click", (e) => {
  console.log(e.target);        // element actually clicked
  console.log(e.currentTarget); // element with the listener on it (same as `this`)
});
```

| Property | Meaning |
|---|---|
| `event.target` | The **deepest** element that was actually clicked — doesn't change during bubbling |
| `event.currentTarget` / `this` | The element whose handler is **currently running** |

---

## 4. Stopping Propagation

```js
e.stopPropagation();          // stops bubbling up — other handlers on same element still run
e.stopImmediatePropagation(); // stops bubbling + prevents ALL other handlers on same element
```

> ⚠️ **Use sparingly.** Stopping propagation can silently break analytics, document-level listeners, and other features.

**Good use cases:**
- A click inside **modal content** shouldn't close the modal overlay.
- A click inside a **dropdown** shouldn't close outer containers.

**The band-aid problem:** If you're calling `stopPropagation()` everywhere, it usually means your structure needs rethinking.

```
✅ Let bubbling happen
🛑 Only stop it when truly necessary
```

---

## 5. `preventDefault` — Stops Built-in Browser Behaviour

Some elements have default browser actions that fire with no JS needed. `preventDefault()` blocks those.

```js
e.preventDefault(); // stops what the ELEMENT does — not where the event travels
```

### Common defaults you might want to block:

**Links & Navigation**
```
<a href="/page">        → navigates to URL
<a href="/page">        → middle-click opens new tab
```

**Forms**
```
<form>                  → submits and refreshes the page
<input type="submit">   → submits the form
<input type="reset">    → clears all fields
```

**Inputs & Controls**
```
<input type="checkbox"> → checks/unchecks
<input type="text">     → typing inserts characters
<select>                → opens dropdown
<input type="number">   → scroll wheel changes value
```

**Keyboard**
```
Space                   → scrolls page down
Arrow keys              → scrolls page
Tab                     → moves focus to next element
Ctrl+S                  → saves page
Ctrl+P                  → prints page
Ctrl+F                  → opens find bar
Backspace               → goes back a page
```

**Mouse**
```
Right-click             → opens context menu
Double-click text       → selects a word
Triple-click text       → selects a line
Drag image              → drags image
```

**Touch (Mobile)**
```
Pinch                   → zooms page
Swipe                   → scrolls
Double-tap              → zooms in
```

**Copy/Paste**
```
Ctrl+C                  → copies selected text
Ctrl+V                  → pastes
Ctrl+X                  → cuts
```

> A plain `<button>` has **no** default behaviour — `preventDefault` does nothing on it.

---

## 6. `preventDefault` vs `stopPropagation`

They solve **completely different problems:**

```js
e.preventDefault()    // stops what the ELEMENT does (built-in browser action)
e.stopPropagation()   // stops where the EVENT travels (bubbling up the DOM)
```

| Method | Stops | Example |
|---|---|---|
| `preventDefault` | Built-in browser action | Stop `<a>` from navigating |
| `stopPropagation` | Event bubbling up the DOM | Stop click from reaching a parent |

---

## 7. Event Delegation

> Put **one listener on a parent** — let bubbling do the rest.

### ❌ Bad (many listeners)

```js
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});
```

Problems: many listeners, breaks for future elements, worse performance.

### ✅ Good (delegation)

```js
const list = document.querySelector(".list");

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.toggle("active");
  }
});
```

One listener, works for dynamically added elements, uses bubbling instead of fighting it.

---

### Handling Nested Children with `closest()`

The click might land on a **child** of the element you care about. Use `closest()` to walk up and find the right ancestor:

```js
table.onclick = function(event) {
  let td = event.target.closest('td'); // find the nearest <td>
  if (!td || !table.contains(td)) return;
  highlight(td);
};
```

`elem.closest(selector)` — walks up the DOM and returns the nearest ancestor matching the selector (including the element itself).

---

### Pattern: `data-action` Attribute

Use `data-*` attributes to describe what each element should do — no messy if/else chains:

```html
<button data-action="save">Save</button>
<button data-action="load">Load</button>
```

```js
class Menu {
  constructor(elem) {
    elem.onclick = this.onClick.bind(this);
  }
  save() { /* ... */ }
  load() { /* ... */ }
  onClick(event) {
    const action = event.target.dataset.action;
    if (action) this[action]();
  }
}
```

---

### Pattern: "Behavior" via Attributes

Attach a document-level handler that responds to any element with a specific `data-*` attribute — no per-element JS needed:

```js
// Auto-increment any button with data-counter
document.addEventListener('click', function(event) {
  if (event.target.dataset.counter !== undefined) {
    event.target.value++;
  }
});
```

> 💡 For document-level handlers, **always use `addEventListener`**, not `document.onclick`, to avoid overwriting other handlers.

---

### Limitations of Event Delegation

- The event **must bubble** — won't work for non-bubbling events (e.g., `focus`).
- Avoid `stopPropagation()` inside delegated elements — it breaks the chain.
- Slight CPU overhead since the parent fires for all events in the container (usually negligible).

---

## 8. State

> **State = data in JS that represents the current situation of the UI.**

```js
const state = {
  isLoggedIn: false,
  activeTab: null,
  cartCount: 0,
};
```

### State controls the UI — not the other way around

```
❌ "The UI decides what's active"
✅ "State decides what the UI looks like"
```

### The pattern

```
Event → update state → re-render UI
```

```js
button.addEventListener("click", () => {
  state.isLoggedIn = !state.isLoggedIn; // update state
  render();                              // re-render
});

function render() {
  status.textContent = state.isLoggedIn ? "Welcome" : "Please log in";
}
```

---

## 9. Full Pattern — Delegation + State

```html
<ul id="todo">
  <li data-id="1">Task 1</li>
  <li data-id="2">Task 2</li>
</ul>
```

```js
const state = { completed: {} };

// one delegated listener
todo.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  state.completed[id] = !state.completed[id]; // update state
  render();                                     // re-render
});

function render() {
  document.querySelectorAll("#todo li").forEach(li => {
    const id = li.dataset.id;
    li.classList.toggle("done", state.completed[id]);
  });
}
```

### The model

```
User action
    ↓
Event bubbles
    ↓
Delegated handler runs
    ↓
State updates
    ↓
UI re-renders
```

---

## 10. ARIA Tabs Pattern
> Source: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

### What are Tabs?

A tabbed interface shows one content panel at a time, with tab labels along one edge (usually the top). Activating a tab hides the current panel and reveals the one linked to that tab.

**Key terms:**
- **Tab List** — container holding all tab buttons (`role="tablist"`)
- **Tab** — a single clickable label (`role="tab"`)
- **Tab Panel** — the content area revealed when its tab is active (`role="tabpanel"`)

---

### Keyboard Interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus into the tab list (lands on the active tab); then Tab again moves to the panel |
| `Left Arrow` | Previous tab (wraps to last if on first) |
| `Right Arrow` | Next tab (wraps to first if on last) |
| `Space` / `Enter` | Activates the focused tab (if not auto-activated on focus) |
| `Home` *(optional)* | Moves focus to the first tab |
| `End` *(optional)* | Moves focus to the last tab |
| `Delete` *(optional)* | Closes/removes the current tab and its panel |
| `Shift + F10` | Opens an associated popup menu if the tab has one |

**For vertical tab lists:** `Down Arrow` = `Right Arrow`, `Up Arrow` = `Left Arrow`.

---

### Auto vs Manual Activation

- **Automatic** — panel displays as soon as the tab receives focus. Use when content loads instantly.
- **Manual** — user must press `Space`/`Enter` to show the panel. Use when loading content is slow, to avoid laggy navigation.

---

### Required ARIA Roles, States & Properties

| Element | Role / Attribute | Notes |
|---|---|---|
| Tab container | `role="tablist"` | Wraps all tab elements |
| Tab container | `aria-labelledby` or `aria-label` | Labels the tab list |
| Each tab | `role="tab"` | Must be inside `tablist` |
| Each tab | `aria-controls="[panelId]"` | Links tab to its panel |
| Active tab | `aria-selected="true"` | All others set to `false` |
| Each panel | `role="tabpanel"` | The content area |
| Each panel | `aria-labelledby="[tabId]"` | Links panel back to its tab |
| Vertical list | `aria-orientation="vertical"` | Default is `horizontal` |
| Panel with no focusable children | `tabindex="0"` | Makes the panel itself focusable |
| Tab with popup menu | `aria-haspopup="menu"` | If tab opens a submenu |

---

### HTML Structure Example

```html
<div role="tablist" aria-label="Sample Tabs">
  <button role="tab" aria-selected="true"  aria-controls="panel-1" id="tab-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Tab 2</button>
</div>

<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Content for Tab 1
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
  Content for Tab 2
</div>
```

---

## Quick Reference Cheatsheet

| Concept | Key Takeaway |
|---|---|
| Bubbling | Events travel up: child → parent → document |
| Capturing | Events travel down: document → parent → child (rarely used) |
| `event.target` | The element that was actually interacted with |
| `event.currentTarget` | The element whose handler is currently running |
| `stopPropagation()` | Stops the event travelling upward |
| `stopImmediatePropagation()` | Stops bubbling + all other handlers on same element |
| `preventDefault()` | Stops built-in browser behaviour (link nav, form submit, etc.) |
| Event Delegation | One parent listener handles events for all children via bubbling |
| `closest(selector)` | Walks up the DOM to find the nearest matching ancestor |
| State pattern | Event → update state → re-render UI |
| ARIA `role="tablist"` | Container for tab buttons |
| ARIA `role="tab"` | Individual tab button |
| ARIA `role="tabpanel"` | Content shown by the tab |
| `aria-selected="true"` | Marks the currently active tab |
| `aria-controls` | Links a tab to its panel |
| `aria-labelledby` | Links a panel back to its tab (and labels the tablist) |
