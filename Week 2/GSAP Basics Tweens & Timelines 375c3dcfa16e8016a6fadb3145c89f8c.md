# GSAP Basics: Tweens & Timelines

The **GSAP object** is your access point to everything the engine does.

- Create animations
- Configure settings
- Register plugins, ease, and effects
- Global control over all animations

The **GSAP object** provides **three main methods** for creating tweens (and optionally adding them to timelines):

```jsx
gsap.to()
gsap.from()
gsap.fromTo()
```

A Tween can:

- Animate **one property** of a single object
- Animate **multiple properties** of a single object
- Animate **multiple properties** of multiple objects
    - Multiple objects can have staggered start times

### Example

```jsx
// Rotate and move elements with class "box" over 1 second
// "x" is a shortcut for translateX()

gsap.to(".box", { rotation:27, x:100, duration:1 });
```

**Parameters**

1. **targets** - the object(s) whose properties you want to animate. This can be selector text like **`".class"`**, **`"#id"`**, etc. (GSAP uses [**`document.querySelectorAll()`**](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) internally) or it can be direct references to elements, generic objects, or even an array of objects.
2. **vars** - an object containing all the properties/values you want to animate, along with any special properties like **`ease`**, **`duration`**, **`delay`**, or **`onComplete`** ([listed below](https://gsap.com/docs/v3/GSAP/gsap.to()/?ref=6234#special-properties)).

---

## What Is a Timeline?

A **Timeline** is a container for multiple tweens.

It allows you to:

- Sequence animations
- Overlap animations
- Control multiple tweens as a group

---

## Basic Tween

```jsx
gsap.to(".fred", {x:400});
 // animates the element with a class of “fred” to an x position of 400.
 // default duration is 500ms / half a second

```

## Performance Best Practices

For the **best performance**, animate **CSS transform properties** and **opacity** whenever possible:

### Recommended Properties

1. `x`
2. `y`
3. `rotation`
4. `rotationX`
5. `rotationY`
6. `skewX`, `skewY`
7. `scale`, `scaleX`, `scaleY`

## Animating Other Properties

GSAP can animate **any numeric property**.

### Examples

1. `width`, `height`
2. `backgroundColor`
    - Hyphenated CSS properties must be written in **camelCase**
3. `color`
4. `padding`
5. `left`, `top`
    - Requires `position: relative | absolute | fixed`
6. `vh`, `vw`

---

# Differences Between `to()`, `from()`, and `fromTo()`

### `gsap.to()`

docs: https://gsap.com/docs/v3/GSAP/gsap.to()/

Animate **from current values → to the values you define**.

### `gsap.from()`

docs: https://greensock.com/docs/v3/GSAP/gsap.from()?ref=6234

Animate **from the values you define → to current values**.

(Like running a tween backwards.)

```jsx
gsap.from(".fred", {x:400, y:400});
```

### `gsap.fromTo()`

docs:https://gsap.com/docs/v3/GSAP/Timeline/fromTo()/

You define **both starting and ending values**.

```jsx
gsap.fromTo(".fred", {x:400, y:400}, {x:200, y:200});

gsap.fromTo(".fred", 
    {x:700, y:400, scale:1, opacity:0},
		{x:400, y:200, scale:3, opacity:1, duration:3});
```

---

# **Special Properties: Delay and Repeat**

Special properties define how the animation should run and what it should do. Special properties are not animated.

**delay**: how much time should transpire before animation begins

**repeat**: how many times the animation should repeat

**yoyo**: when set to true the animation will play back and forth

**repeatDelay**: how much time should transpire between each repeat

An animation will **repeat indefinitely** if you set **repeat:-1**

```jsx
gsap.to(".fred", {x:300, repeat:-1, yoyo:true, repeatDelay:1});
```

---

# **Special Property: Ease and Using the Ease Visualizer**

docs:https://gsap.com/docs/v3/Eases/?ref=6234

An ease **controls the rate of change** as your animation plays.

In simple uses an ease will control whether your animation **slows down** or **speeds up**.

An ease can be applied on the way out (default), on the way in, or both directions.

The steeper the curve the faster change is taking place.

**ease:”bounce”** will bounce on the way out

**ease:”bounce.in**” will bounce on the way in

**ease:”bounce.inOut”** will bounce on the way in and out

Some eases can be configured

**ease:”back.config(6)”** will have a stronger overshoot

---

# **Stagger**

The stagger property allows you to offset the start time of multiple targets in a single tween.

```jsx
// each image will start 0.2 seconds after the previous one starts.
gsap.to("#freds img", {y:-100, stagger:0.2});
```

A stagger object gives you greater control over where the staggers start from and how the timing is dispersed.

```jsx
gsap.to("#freds img", {y:-50, stagger:{
  each:0.2, //0.2 seconds **between** each animation.
  from:"end"
  }
});

gsap.to("#freds img", {y:-50, stagger:{
  amount:0.2, //all animations will share 0.2 seconds.
  from:"end" // start from the end 
  }
});
```

**each:0.2** means there will be 0.2 seconds **between** the start of each animation.

If instead you use **amount:0.2** then all animations will start **within** 0.2 seconds.

from:  **“edges”, “center”,** **“end”**.

- edges- start from out outer edges
- center- start from the center
- end- start from the end

---

# **Tween Control**

Tween’s have a number of methods for controlling playback.

**In order to control a tween** you need have way to **reference** it. Below we set up a variable to reference our tween.

```jsx
var tween = gsap.to("#fred", {x:600});
```

- You can use **let** or **const** instead of var based on your preference and level of comfort with JS.

To prevent a tween from playing automatically you can set its **paused** special property to true.

```jsx
var tween = gsap.to("#fred", {x:600, paused:true});
```

To play that tween you can later call:

```jsx
tween.play();
```

```jsx
<img class="fred green" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/32887/fred.svg" alt="" width="150">

<div id="nav">
<button id="play">play</button>
<button id="pause">pause</button>
<button id="reverse">reverse</button>
<button id="restart">restart</button>
</div>

document.addEventListener('click', function (event) {
  if (event.target.matches('button')) {
    event.target.focus()
  }
})

var tween = gsap.to(".green", {duration:3, x:600, ease:"linear", paused:true});

document.getElementById("play").onclick = ()=> tween.play();
document.getElementById("pause").onclick = ()=> tween.pause();
document.getElementById("reverse").onclick = ()=> tween.reverse();
document.getElementById("restart").onclick = ()=> tween.restart();

```

---

## How to stop () Tweens Glitch

```jsx

* {
	position:relative;
}

body, html {
	width:100%;
	height:100%;
	overflow:hidden;
}

body {
	display:flex;
	align-items:center;
	justify-content:center;
}
.button {
	cursor:pointer;
	display:flex;
	align-items:center;
	justify-content:center;
	background-color:darkblue;
	border:1vmin solid black;
	
}

.circle {
	width:50vmin;
	height:50vmin;
	border-radius:50%;
}

.circle span {
	color:white;
	font-weight:800;
	font-family: sans-serif;
	font-size:13vmin;
}

.bg {
	position:absolute;
	background:white;
	opacity:0.3;
	will-change:transform;
}

<div class="circle button">
	<div class="circle bg"></div>
	<span>hover<span>
</div>

const button = document.querySelector(".button")
const bg = document.querySelector(".bg")

button.addEventListener("mouseenter", function(){
	gsap.from(bg, {scale:0, duration:1, ease:"circ"})
})
```

1. `gsap.from()` → `gsap.fromTo()` — you now own *both* endpoints. The `to` value is always `scale: 1`, never a mystery.
    1. When you hover mid-animation (say the circle is at scale `0.4`), a new `gsap.from({scale:0})` reads the current scale as its destination. So it animates `0 → 0.4` instead of `0 → 1`. Each rapid hover "traps" the circle at a lower value.
    
2. Creating the tween once *outside* the event listener means no new objects are spawned. GSAP's internal conflict between competing tweens disappears.
3. `tween.restart()` rewinds the existing tween to its `from` state and plays from there — a clean, predictable reset every single hover.

```jsx
const button = document.querySelector(".button")
const bg = document.querySelector(".bg")

const tween = gsap.fromTo(bg, {scale:0}, 
					{scale:1, ease:"circ", duration:1})

button.addEventListener("mouseenter", function(){
	tween.restart()
})

OR

const button = document.querySelector(".button")
const bg = document.querySelector(".bg")

button.addEventListener("mouseenter", function(){
 gsap.fromTo(bg, {scale:0, duration:1}, 
					{scale:1, ease:"circ"})
})
```

---

# **transformOrigin**

transformOrigin values are set with a pair of **horizontal** (x) and **vertical** (y) values as a single string.

The values are *commonly* set in **pixels**, **percents**, or using the **css keywords**: left, center, right, top, bottom.

![Screenshot 2026-02-25 at 9.07.32 PM.png](GSAP%20Basics%20Tweens%20&%20Timelines/Screenshot_2026-02-25_at_9.07.32_PM.png)

![Screenshot 2026-02-25 at 9.07.44 PM.png](GSAP%20Basics%20Tweens%20&%20Timelines/Screenshot_2026-02-25_at_9.07.44_PM.png)

![Screenshot 2026-02-25 at 9.10.22 PM.png](GSAP%20Basics%20Tweens%20&%20Timelines/Screenshot_2026-02-25_at_9.10.22_PM.png)

---

# Timeline

A timeline is created with `gsap.timeline();`
All tweens in a timeline naturally play one after the other.

### Why use `gsap.timeline()`?

- Cleaner, readable sequencing.
- One place to control a whole animation.
- Easy overlapping and precise timing.
- Named labels & reusable scenes.
- Plays nicely with scroll/scrubbing and complex UI flows.
- Much easier to maintain and tweak over time.

```jsx
gsap.timeline()
  .from("#demo", {autoAlpha:0})
  .from("#title", {opacity:0, scale:0, ease:"back"})
  .from("#freds img", {y:160, stagger:0.1, duration:0.8, ease:"back"})
  .from("#time", {xPercent:100, duration:0.2})
```

## **Position Parameter**

```jsx
var animation=gsap.timeline();

animation
.to("#star"  , { duration: 2, x: 1150 })          // starts at 0s, runs 0 → 2
.to("#circle", { duration: 3, x: 1150 }, "+=1")   // start 1s *after previous ends*
.to("#square", { duration: 1, x: 1150 }, "<")     // start at same time as previous
```

```jsx
.to("#star"  , { duration: 2, x: 1150 })       // 0 → 2
.to("#circle", { duration: 3, x: 1150 }, 1)    // start at time 1 on the timeline
.to("#square", { duration: 1, x: 1150 }, 4)    // start at time 4 on the timeline
```

```jsx
.to("#star"  , { duration: 2, x: 1150 })          // 0 → 2
.to("#circle", { duration: 3, x: 1150 }, 1)       // 1 → 4
.to("#square", { duration: 1, x: 1150 }, "<0.5")  // 0.5s before circle starts
```

```jsx
var tl = gsap.timeline();
  tl.to(object, {y:300}, "+=1")  // start 1 second after previous tween ends
  tl.to(object, {x:300}, "-=1")  // start 1 second before previous tween ends
  tl.to(object, {rotation:90}, "<")  // start when previous tween begins
  tl.to(object, {opacity:0.5}, "<1") // start 1 second after previous tween begins
  tl.to(object2, {x:200}, 1) // start exactly at a time of 1

```

docs: [https://greensock.com/docs/v3/GSAP/gsap.timeline()](https://greensock.com/docs/v3/GSAP/gsap.timeline())

### Quick cheat-sheet for position parameters

- `"+=1"` → 1 second **after previous tween ends**
- `"-=0.5"` → 0.5 seconds **before previous tween ends**
- `"<"` → align with **previous tween’s start**
- `"<0.5"` → 0.5 seconds **before** previous tween’s start
- `">"` → align with **previous tween’s end**
- Number (e.g. `3`) → **absolute time** on the timeline

You can add a label to a timeline using the **add()** method

```jsx

document.addEventListener('click', function (event) {
  if (event.target.matches('button')) {
    event.target.focus()
  }
})

var animation = gsap.timeline()
    .from("#demo", {duration:1, opacity:0})
    .from("#title", {opacity:0, duration:3, scale:0, ease:"back"})
    .from("#freds img", {y:160, stagger:0.5, duration:0.8, ease:"back"}, "+=0.5")
    .add("test") // adding a label called test
    .from("#time", {xPercent:100, duration:1, ease:"bounce"});

document.getElementById("play").onclick = ()=> animation.play();
document.getElementById("pause").onclick = ()=> animation.pause();
document.getElementById("reverse").onclick = ()=> animation.reverse();
document.getElementById("restart").onclick = ()=> animation.restart();
document.getElementById("test").onclick = ()=> animation.play("test"); //play where marker is

gsap.set("#wrapper", {scale:0.8, visibility:"visible"});
```