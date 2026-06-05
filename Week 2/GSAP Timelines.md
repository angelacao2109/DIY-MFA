# GSAP Timelines

🎯**The Position Parameter — the hard part**

Every method on a timeline (`.to()`, `.from()`, `.fromTo()`, `.add()`) accepts an optional **position parameter** as the last argument. It controls *when in the timeline* that tween starts.

Think of the timeline as a ruler measured in seconds. The position param places a tween at a specific mark on that ruler.

| **Position value** | **What it means** |
| --- | --- |
| (nothing) | Start immediately after the previous tween ends — the default |
| "<" | Start at the same time the previous tween STARTED (overlap) |
| ">" | Start when previous ENDS — same as default but explicit |
| "-=0.3" | Start 0.3s BEFORE previous ends (creates overlap) |
| "+=0.5" | Start 0.5s AFTER previous ends (creates gap) |
| "<+=0.2" | Start 0.2s after previous STARTS |
| 1.5 | Start at exactly the 1.5 second mark in the timeline |
| "myLabel" | Start at a named label you placed in the timeline |

```jsx
const tl = gsap.timeline();

tl.from('.logo',  { opacity: 0, duration: 0.6 })
  .from('.nav',   { opacity: 0, duration: 0.4 }, '<')       // same time as logo
  .from('.hero',  { y: 40, opacity: 0, duration: 0.8 }, '-=0.2')  // 0.2s before logo ends
  .from('.cta',   { opacity: 0, duration: 0.4 }, '+=0.1')    // 0.1s gap after hero
  .addLabel('afterIntro')
  .from('.cards', { y: 30, opacity: 0, stagger: 0.1 }, 'afterIntro');
```

⚠️ **"<" is the most used position param.** It means "start this at the same time as the previous tween." Without it, everything plays sequentially. The real world uses "<" constantly to run things in parallel.

**Timeline Defaults**

Pass a `defaults` object to the timeline constructor and every child tween inherits those values — unless it overrides them. This is huge for keeping your code DRY.

```jsx
const tl = gsap.timeline({
  defaults: {
    duration: 0.6,
    ease: 'power2.out',
  },
  paused: true,       // don't play until you call tl.play()
  repeat: -1,          // repeat forever
  onComplete: () => console.log('done'),
});

// All these inherit duration: 0.6, ease: 'power2.out'
tl.from('.a', { opacity: 0 })       // 0.6s, power2.out
  .from('.b', { y: 20 })            // 0.6s, power2.out
  .from('.c', { x: -30, duration: 1 }); // overrides duration only
```
