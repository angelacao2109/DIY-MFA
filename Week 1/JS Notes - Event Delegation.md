---

## 1. Event Bubbling

When an event fires on an element, it **travels up the DOM** to every parent.

```html
<div id="parent">
  <button id="child">Click</button>
</div>
```

```jsx
parent.addEventListener("click", () => console.log("parent clicked"));
child.addEventListener("click",  () => console.log("child clicked"));

// Click the button → console shows:
// child clicked
// parent clicked
```

**The travel path:**

```
button → div → body → document
```

**Why it exists:** So you can handle events higher up, avoid adding listeners to every element, and handle elements added later.

---

## 2. Event Delegation

> Put one listener on a parent — let bubbling do the rest.
> 

### Bad (many listeners)

```jsx
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});
```

Problems: many listeners, breaks for future elements, worse performance.

### Good (delegation)

```jsx
const list = document.querySelector(".list");

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.toggle("active");
  }
});
```

One listener, works for future elements, uses bubbling instead of fighting it.

---

## 3. `event.target` vs `event.currentTarget`

```jsx
list.addEventListener("click", (e) => {
  console.log(e.target);        // element actually clicked
  console.log(e.currentTarget); // element with the listener on it
});
```

| Property | Meaning |
| --- | --- |
| `event.target` | Actual clicked element |
| `event.currentTarget` | Element handling the event |

---

## 4. `stopPropagation` — Stops the Event Travelling

```jsx
e.stopPropagation(); // event stops here, doesn't bubble up
```

### Use sparingly — only when a parent listener would fire and you don't want it to.

Good use cases:

- Click inside **modal content** shouldn't close the modal overlay
- Click inside a **dropdown menu** shouldn't close outer containers

### The band-aid problem

If you're calling `stopPropagation()` everywhere, it usually means your structure needs rethinking — not more propagation stops.

```
✅ Let bubbling happen
🛑 Only stop it when truly necessary
```

---

## 5. `preventDefault` — Stops Built-in Browser Behaviour

Some elements do things on their own without any JS:

### Links & Navigation

```
<a href="/page">         → navigates to URL
<a href="/page">         → middle-click opens new tab
history back/forward     → browser arrow buttons
```

### Forms

```
<form>                   → submits and refreshes page
<input type="submit">    → submits form
<input type="reset">     → clears all fields
```

### Inputs & Controls

```
<input type="checkbox">  → checks/unchecks
<input type="text">      → typing inserts characters
<select>                 → opens dropdown
<input type="number">    → scroll wheel changes value
```

### Keyboard

```
Space                    → scrolls page down
Arrow keys               → scrolls page
Tab                      → moves focus to next element
Ctrl+S                   → saves page
Ctrl+P                   → prints page
Ctrl+F                   → opens find bar
Backspace                → goes back a page
```

### Mouse

```
Right-click              → opens context menu
Double-click text        → selects a word
Triple-click text        → selects a line
Drag image               → drags image
```

### Touch (Mobile)

```
Pinch                    → zooms page
Swipe                    → scrolls
Double-tap               → zooms in
```

### Copy/Paste

```
Ctrl+C                   → copies selected text
Ctrl+V                   → pastes
Ctrl+X                   → cuts
```

---

## 6. `preventDefault` vs `stopPropagation`

They solve **completely different problems:**

```jsx
e.preventDefault()     // stops what the ELEMENT does (built-in browser action)
e.stopPropagation()    // stops where the EVENT travels (bubbling)
```

| Method | Stops | Example |
| --- | --- | --- |
| `preventDefault` | Built-in browser action | Stop `<a>` from navigating |
| `stopPropagation` | Event bubbling up DOM | Stop click reaching parent |

A plain `<button>` has no default behaviour — `preventDefault` does nothing on it.

---

## 7. State

> **State = data in JS that represents the current situation of the UI**
> 

```jsx
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

```jsx
button.addEventListener("click", () => {
  state.isLoggedIn = !state.isLoggedIn; // update state
  render();                              // re-render
});

function render() {
  status.textContent = state.isLoggedIn ? "Welcome" : "Please log in";
}
```

---

## 8. Full Pattern — Delegation + State

```html
<ul id="todo">
  <li data-id="1">Task 1</li>
  <li data-id="2">Task 2</li>
</ul>
```

```jsx
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
