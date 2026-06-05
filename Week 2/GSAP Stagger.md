# GSAP Stagger

Simple stagger is a number. Advanced stagger is an object. Know the difference.

🌊**Simple stagger — a number**

```jsx
// Each element starts 0.1s after the previous one
gsap.from('.nav-item', {
  opacity: 0,
  y: -20,
  duration: 0.5,
  ease: 'power2.out',
  stagger: 0.1,    // ← 0.1s between each
});
```

If you have 5 nav items, item 0 starts at 0s, item 1 at 0.1s, item 2 at 0.2s, etc. Total spread = items × stagger value.

🎛️**Stagger object — advanced control**

```jsx
gsap.from('.card', {
  opacity: 0,
  y: 40,
  duration: 0.6,
  stagger: {
    amount: 1.2,      // total seconds to spread across ALL elements
    from: 'center',   // start from center and spread outward
    ease: 'power2.in', // curve of the stagger distribution (not the animation)
  },
});
```

| **from value** | **What it does** |
| --- | --- |
| 'start' | First element first (default) |
| 'end' | Last element first |
| 'center' | Middle elements first, spreads to edges |
| 'edges' | Edge elements first, converges to center |
| 'random' | Random order — feels organic, not robotic |
| 3 | Start from element at index 3, spread from there |

💡`amount` vs a plain number: `stagger: 0.1` means 0.1s between each, so 20 cards = 2s total spread. `stagger: {amount: 1}` means the total spread is always 1s regardless of how many cards there are. Use `amount` when the total spread matters more than per-item delay.

⬛**Grid stagger — 2D layouts**

For a card grid, you can stagger in 2D — elements closest to the starting point animate first, propagating outward like a wave.

```jsx
gsap.from('.card', {
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  stagger: {
    amount: 1.5,
    grid: [3, 4],     // [rows, columns] — must match your grid layout
    from: 'center',   // or 'start', 'edges', etc.
    axis: 'y',        // restrict wave to vertical direction only
  },
});
```

⚠️The `grid` values must match your actual grid layout. If you have 3 columns, `grid: 'auto'` lets GSAP measure the grid automatically. Use `'auto'` if your column count might change.

🔔**Callbacks inside stagger**

```jsx
gsap.from('.item', {
  opacity: 0,
  stagger: 0.1,
  onComplete: function() {
    // `this.targets()[0]` = the specific element that just finished
    this.targets()[0].classList.add('animated');
  },
  onStart: function() {
    console.log('element started animating');
  }
});
```

💡Inside `onComplete`/`onStart`, `this` refers to the tween instance. `this.targets()[0]` gives you the specific element that tween was for. Arrow functions lose `this`, so use `function()` syntax for callbacks when you need to access the target.
