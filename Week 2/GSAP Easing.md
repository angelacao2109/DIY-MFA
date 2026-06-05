# GSAP Easing

An ease is a mathematical curve that maps *time* to *progress*. Without easing, an element moves at a perfectly constant rate — like a robot. Easing adds acceleration and deceleration that mimics how things move in the real world.

**ease.in**

**Starts** **slow**, **ends** **fast**. Feels like launching. Good **for** **exits**.

**ease.out**

**Starts fast, decelerates to rest.** Natural, satisfying landing. **Use this for most entrances.**

**ease.inOut**

**Slow-fast-slow.** Good for **transitions** **between two states** (hero section revealing then settling).


⚡ **Power eases**

| **Ease** | **Feel** | **When to use** |
| --- | --- | --- |
| power1.out | Subtle, gentle deceleration | Small UI micro-interactions |
| power2.out | Natural, clean deceleration | Most everyday animations |
| power3.out | Punchy, confident entry | Text reveals, card entrances |
| power4.out | Fast snap into place, dramatic | Hero entrances, bold page transitions |
| power4.inOut | Smooth acceleration + strong settle | Section-to-section transitions |

✅ **Default rule:** start with `power2.out` for everything. If it feels too gentle, go to `power3.out`. If it still feels cheap, try `power4.out`. You'll develop instinct for which to use after this week.

🎯 **Special eases — use sparingly**

| **Ease** | **Feel** | **Caution** |
| --- | --- | --- |
| elastic.out(1, 0.3) | Springy overshoot — bounces past destination then settles | Fun in playful UIs. Looks cheap on serious sites. Very noticeable. |
| bounce.out | Literal rubber ball bounce | Rarely professional. Use only for game-like or very playful contexts. |
| back.out(1.7) | Slight overshoot then settle (less dramatic than elastic) | Good for button presses, drawer menus — adds personality without chaos. |
| circ.out | Very fast at start, extremely gentle at end | Great for moving elements sideways, horizontal swipes. |
| expo.out | Explosive start, whisper landing | Premium feel for large-scale movements. |

✏️ **CustomEase — design your own curve**

CustomEase lets you define any curve using SVG path notation. Usually done by copying from a tool like linear-easing-generator or the GSAP ease visualizer's custom mode.

```jsx
// Register the plugin first
gsap.registerPlugin(CustomEase);

// Create a named ease from an SVG path
CustomEase.create('signature', 'M0,0 C0.5,0 0.3,1 1,1');

// Use it anywhere
gsap.to('.hero', { y: 0, opacity: 1, ease: 'signature', duration: 1.2 });
```

💡Most studios have a "house ease" — a CustomEase that appears on every transition and gives the site its distinctive character.

---

# GSAP Ease Cheat Sheet

> **The one rule:** entrance → `.out` / exit → `.in` / state switch → `.inOut`
Power number = intensity. 1 = whisper, 4 = bold. **When unsure: `power2.out`.**
> 

---

## 🖱️ Hover & Micro-interactions

### `power1.out`

**Feel:** Whisper. Barely there.
The animation feels invisible — just *responsive*. Best when motion should be felt, not consciously seen.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Button hover states | Hero entrances |
| Subtle text / color shifts | Page transitions |
| Small icon nudges | Anything that needs to register |

---

### `power2.out` ⭐ the default

**Feel:** Natural. Arrives with quiet confidence.
The CSS `ease-out` equivalent. Universal baseline — this is never wrong.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Scroll-triggered card reveals | Hero titles (not punchy enough) |
| Hover states (scale, color) | Primary hero animations |
| Most everyday animations |  |

---

## 🟢 Entrances

### `power3.out`

**Feel:** Punchy. Decisive. Arrives on purpose.
Noticeably snappy without theatrics. When something "feels polished," this ease is usually why.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Text reveals | Hover states (too heavy) |
| Card entrances on scroll |  |
| Modal open, CTA elements |  |

---

### `power4.out`

**Feel:** Explosive start. Snaps into place.
Covers ~80% of the distance in the first 25% of time. **Maximum authority.** The ease you see on Awwwards hero sections.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Hero titles | Small UI (effect is invisible at small scale) |
| Page-load primary entrances | Hover states |
| Full-viewport reveals |  |

---

### `expo.out`

**Feel:** Even faster than power4. Instant, then stillness.
Arrives almost immediately, then barely moves for the rest of the duration. Creates a "pulled from nowhere" effect.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Giant hero elements | Small elements (effect invisible) |
| Full-viewport panel slides | Anything subtle |
| When `power4` still feels slow |  |

---

## 🔴 Exits

> **Why `.in` for exits?** `.in` = acceleration. Things leaving a scene should speed up as they go — the same physics that makes `.out` feel natural for arrivals.
> 

### `power2.in`

**Feel:** Reluctant start, speeds away.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Elements leaving the viewport | Entrances (slow start = hesitation) |
| Closing animations |  |
| Page transition: leave phase |  |

---

### `power3.in`

**Feel:** Nearly still... then sharp departure.
Stays almost motionless, then shoots away. Creates a moment of tension before exit.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Dramatic exits | Entrances |
| Page transitions (leave phase) | Anything that should feel gentle |
| Overlay dismiss |  |

---

## 🔵 Transitions (switching between two states)

> Use `.inOut` when both states matter equally — neither "from" nor "to" dominates.
> 

### `power2.inOut`

**Feel:** Smooth. Equal weight to both ends.
An S-curve — both endpoints decelerate.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Carousel slides | Entrances (slow start = lag) |
| Tab content switching | Primary hero animations |
| Parallax section changes |  |

---

### `power4.inOut`

**Feel:** Decisive pause → explosive middle → settled landing.
Extended S-curve with strong deceleration at both ends. Makes transitions feel **cinematic**.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Full-page transitions | Buttons / hover states |
| Full-screen overlays | Small UI elements |
| Large scene changes |  |

---

## ✨ Use With Intent

### `back.out`

**Feel:** Springy. Overshoots then settles.
Goes past the destination then snaps back. Adds personality. **Once per page at most** — gets annoying fast.

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Playful notification pops | Serious portfolios |
| Game-like interactions | Text reveals |
| Floating action buttons | Most professional contexts |

---

## 🚫 Avoid in Professional Work

### `elastic.out`

**Feel:** Bouncy. Multi-overshoot spring.
Very high personality, very low professionalism. **If you have to ask whether it fits — it doesn't.**

| ✅ Use for | ❌ Avoid |
| --- | --- |
| Playful app loading states | Professional portfolios |
| Games and cartoon UIs | Agency sites |
|  | Almost everything else |

---

## ⚡ Quick Decision Guide

| Situation | Answer |
| --- | --- |
| Is this an entrance? | `.out` — decelerating arrival feels natural |
| Is this an exit? | `.in` — acceleration as it leaves |
| Switching between two equal states? | `.inOut` — both sides get equal weight |
| How dramatic should it be? | Start at `power2`, go up until it feels right |
| Hover state? | `power2.out` max — anything heavier feels sluggish |
| Completely unsure? | `power2.out`. Safe always. Adjust from there. |

---

## 🏆 The 2-Ease Rule

Most premium studios pick **two eases** and use them across the whole project:

```
Entrances / primary animations  →  power3.out or power4.out
Hover states / micro-interactions  →  power2.out
```

Consistency reads as a design system. Using six different eases on one page reads as noise — even if each individual choice is technically correct.

---

## Reference: Power Scale

```
power1  →  barely noticeable curve  →  micro-interactions
power2  →  natural, clean           →  everyday default
power3  →  punchy, snappy           →  text and card reveals
power4  →  dramatic, bold           →  hero sections
expo    →  extreme                  →  giant-scale elements only
```
