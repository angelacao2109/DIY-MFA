# GSAP TextPlugin vs SplitText

**Official docs**

- TextPlugin — https://gsap.com/docs/v3/Plugins/TextPlugin/
- SplitText — https://gsap.com/docs/v3/Plugins/SplitText/
- gsap.registerPlugin() — https://gsap.com/docs/v3/GSAP/gsap.registerPlugin()/

---

## The core difference

|  | TextPlugin | SplitText |
| --- | --- | --- |
| What it does | Changes the text content itself | Splits existing text into animatable pieces |
| The text | Literally changes character by character | Stays the same — just wrapped in spans |
| Good for | Typewriter, text swapping, erasing | Reveals, stagger entrances, scroll triggers |

---

## TextPlugin

Swaps characters in and out of an element over time. The text content itself is the animation.

### Setup

```jsx
gsap.registerPlugin(TextPlugin)  // always register first
```

### Basic typewriter

```jsx
gsap.to("p", {
  text: "Hello world",
  duration: 2,
  ease: "power1.in"
})
// types out "Hello world" from left to right
```

### Erase effect

```jsx
gsap.to("p", {
  text: "",
  duration: 1.5,
  ease: "power1.in"
})
// deletes existing text character by character
```

### Type and erase loop (yoyo)

```jsx
gsap.to("p", {
  text: "Creative technology.",
  duration: 2,
  repeat: -1,   // infinite
  yoyo: true,   // reverses back (erases)
  repeatDelay: 0.4,
  ease: "power1.in"
})
```

### Swap between strings

```jsx
const tl = gsap.timeline({ repeat: -1 })
tl.to("p", { text: "We design.",   duration: 1.5, ease: "none" })
  .to("p", { text: "",             duration: 0.8, ease: "none" }, "+=0.5")
  .to("p", { text: "We build.",    duration: 1.5, ease: "none" }, "+=0.3")
  .to("p", { text: "",             duration: 0.8, ease: "none" }, "+=0.5")
  .to("p", { text: "We ship.",     duration: 1.5, ease: "none" }, "+=0.3")
```

### Options

```jsx
gsap.to("p", {
  text: {
    value: "Hello world",
    delimiter: " ",    // split by word instead of character
    padSpace: true,    // preserve space at the end
  },
  duration: 2
})
```

---

## SplitText

Takes existing text and wraps each character, word, or line in its own `<span>`. You then animate those spans with GSAP like any other element.

### Setup

```jsx
gsap.registerPlugin(SplitText)  // always register first
```

### Split by characters

```jsx
const split = new SplitText("h1", { type: "chars" })
// split.chars = array of every character as a <span>

gsap.from(split.chars, {
  opacity: 0,
  y: 20,
  stagger: 0.04,
  duration: 0.4,
  ease: "back.out(1.7)"
})
```

**Best for: dramatic titles, scramble effects, loading screens.**

### Split by words

```jsx
const split = new SplitText("h1", { type: "words" })
// split.words = array of every word as a <span>

gsap.from(split.words, {
  opacity: 0,
  y: 40,
  stagger: 0.12,
  duration: 0.6,
  ease: "power3.out"
})
```

**Best for: hero headlines, impact statements, poetry, brand copy.**

### Split by lines

```jsx
const split = new SplitText("p", { type: "lines" })
// split.lines = array of every line as a <span>
// lines are determined by the current container width

gsap.from(split.lines, {
  opacity: 0,
  y: 24,
  stagger: 0.15,
  duration: 0.6,
  ease: "power2.out"
})
```

**Best for: body copy reveals, paragraph animations, editorial layouts.**

### Split all three at once

```jsx
const split = new SplitText("h1", { type: "chars,words,lines" })

// Now you have access to all three arrays:
split.chars   // every character
split.words   // every word
split.lines   // every line
```

### Reverse / cleanup

```jsx
split.revert()
// removes all the spans and restores the original text
// important if the container resizes (line breaks change)
```

### With ScrollTrigger

```jsx
const split = new SplitText(".headline", { type: "words" })

gsap.from(split.words, {
  opacity: 0,
  y: 50,
  stagger: 0.1,
  duration: 0.7,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".headline",
    start: "top 80%",
    once: true        // only plays once
  }
})
```

---

## What SplitText actually does to the DOM

Before:

```html
<h1>Hello World</h1>
```

After `new SplitText("h1", { type: "words" })`:

```html
<h1>
  <div class="SplitText-word">Hello</div>
  <div class="SplitText-word">World</div>
</h1>
```

After `new SplitText("h1", { type: "chars" })`:

```html
<h1>
  <div class="SplitText-char">H</div>
  <div class="SplitText-char">e</div>
  <div class="SplitText-char">l</div>
  <div class="SplitText-char">l</div>
  <div class="SplitText-char">o</div>
  ...
</h1>
```

GSAP then gives you arrays of those elements to animate however you want.

---

## When to use which

### Use TextPlugin when:

- You want a typewriter effect
- You want to swap between different strings over time
- Building a terminal / code typing scene
- The text itself changing IS the animation
- You want to erase text

### Use SplitText when:

- Text already exists on the page and you want it to animate in
- Building hero section headline reveals
- Scroll-triggered text animations
- You want words flying in from different directions
- You want staggered character/word/line entrances

### Use both together:

```jsx
// Type in with TextPlugin, then split and animate out with SplitText
const tl = gsap.timeline()

tl.to("h1", { text: "Hello World", duration: 1.5 })
  .add(() => {
    const split = new SplitText("h1", { type: "chars" })
    gsap.to(split.chars, {
      y: -40,
      opacity: 0,
      stagger: 0.03,
      ease: "power2.in"
    })
  }, "+=0.5")
```

---

## Key things to remember

- TextPlugin changes the text content — SplitText splits existing text into pieces
- TextPlugin is free — SplitText is Club GSAP (paid, free on CodePen)
- Always `gsap.registerPlugin()` before using either
- SplitText `type: "lines"` depends on container width — call `split.revert()` on resize
- chars stagger = small (0.02–0.05), words stagger = medium (0.08–0.15), lines stagger = larger (0.12–0.2)
- SplitText gives you plain arrays — animate them exactly like any other element
