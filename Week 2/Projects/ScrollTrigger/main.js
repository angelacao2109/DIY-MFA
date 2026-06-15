// ─────────────────────────────────────────────────────────────
// GSAP + ScrollTrigger are loaded via CDN in index.html
// Always register ScrollTrigger before using it

//const { ScrollTrigger } = require("gsap/all")

// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger)




// ═══════════════════════════════════════════════════════════════
// BUILD 01 — STICKY SIDE BY SIDE
// ═══════════════════════════════════════════════════════════════
//
// Goal:
//   Pin .sticky-left while .sticky-right scrolls normally past it.
//
// Approach:
//   Use ScrollTrigger.create() — no animation needed, just a pin.
//
// Key properties:
//   trigger    → ".sticky-inner"       the whole two-column layout
//   pin        → ".sticky-left"        the column that freezes
//   start      → "top top"             when the section reaches the top of the viewport
//   end        → "bottom bottom"       when the bottom of .sticky-inner leaves the viewport
//   pinSpacing → false                 the right column provides the scroll distance already
//
// Optional bonus:
//   Inside the ST onUpdate callback, read self.progress (0 → 1)
//   and use it to set the width of #sticky-progress
//   → that's the little green bar on the left panel
//
// ═══════════════════════════════════════════════════════════════

// YOUR CODE HERE ↓



ScrollTrigger.create({
  trigger: ".sticky-inner",
  start: "top 20%",
    end: "bottom 80% ",
    pin: ".sticky-left",
    pinSpacing: false,
     
})


// ═══════════════════════════════════════════════════════════════
// BUILD 02 — SCRUBBED TIMELINE
// ═══════════════════════════════════════════════════════════════
//
// Goal:
//   Build a gsap.timeline() and tie its playback progress directly
//   to scroll position using scrub. Pin the section so the page
//   stays still while the user scrubs through the animation.
//
// Approach:
//   gsap.timeline({ scrollTrigger: { scrub, pin, ... } })
//   Then .to() your elements in sequence inside the timeline.
//
// Key properties:
//   trigger  → "#scrub"
//   pin      → true             freeze the section
//   start    → "top top"
//   end      → "+=2000"         gives 2000px of scroll to scrub through — adjust as needed
//   scrub    → 1                1s smoothing lag, feels polished
//
// Suggested timeline sequence:
//   1. .scrub-line-fill   → width from 0% to 100%       (the green progress bar)
//   2. #scrub-step-1      → opacity 0.25 → 1             (activate first milestone)
//   3. #scrub-step-2      → opacity 0.25 → 1             etc.
//   4. #scrub-step-3      → opacity 0.25 → 1
//   5. #scrub-step-4      → opacity 0.25 → 1
//   The .step-dot background can also go from var(--bdr) → var(--green)
//
// Hint — animating backgroundColor:
//   gsap can animate colours: { backgroundColor: '#88ce02' }
//
// ═══════════════════════════════════════════════════════════════

// YOUR CODE HERE ↓

let tl = gsap.timeline()

// position 0 = start at second 0 on the timeline ruler
// runs for 4 seconds — spans the entire timeline so it grows alongside all 4 steps
tl.fromTo(".scrub-line-fill", {width:"0%"},{width:"100%", duration: 4 }, 0  )
.fromTo("#scrub-step-1  ", {opacity:"0.25"},{opacity:"1", duration: 1}, "<") // "<" = start at the same time as the previous tween started (second 0)
.fromTo("#scrub-step-1 .step-dot ", {backgroundColor:"#0a0a0a"},{backgroundColor:"#88ce02"}, "<")
.fromTo("#scrub-step-2 ", {opacity:"0.25"},{opacity:"1", duration: 1} ,1) // 1 = start at second 1 on the timeline ruler
.fromTo("#scrub-step-2 .step-dot ", {backgroundColor:"#0a0a0a"},{backgroundColor:"#88ce02"}, "<")
.fromTo("#scrub-step-3 ", {opacity:"0.25"},{opacity:"1" ,duration: 1},2 ) // 2 = start at second 2 on the timeline ruler
.fromTo("#scrub-step-3 .step-dot ", {backgroundColor:"#0a0a0a"},{backgroundColor:"#88ce02"}, "<")
.fromTo("#scrub-step-4 ", {opacity:"0.25"},{opacity:"1", duration: 1},3)
.fromTo("#scrub-step-4 .step-dot ", {backgroundColor:"#0a0a0a"},{backgroundColor:"#88ce02"}, "<")



 ScrollTrigger.create({
    trigger: "#scrub",          // wrapper is the trigger (not the animated children)
   pin:true,
   start: "top top",
   end: "+=2000",
   scrub: 1, // 1 = 1 second of lag/smoothing between scroll position and animation — feels more polished than scrub: true (instant)
    animation: tl              // pass the timeline in here
  })




// ═══════════════════════════════════════════════════════════════
// BUILD 03 — PARALLAX HERO
// ═══════════════════════════════════════════════════════════════
//
// Goal:
//   Move #parallax-bg at ~0.5× the scroll speed of the page,
//   creating a depth illusion as the section scrolls past.
//
// Approach:
//   gsap.to('#parallax-bg', { y: ..., scrollTrigger: { scrub: true } })
//   The background is already taller than its container (inset: -20% 0 in CSS)
//   and the parent has overflow: hidden — so it clips as the bg moves.
//
// Key properties:
//   trigger  → "#parallax"        the section itself
//   start    → "top top"
//   end      → "bottom top"       when the section fully leaves the viewport
//   scrub    → true               link 1:1 with scroll
//
// The y value:
//   How far should it move? A common formula:
//     y: "30%"     — moves 30% of its own height downward as the section scrolls
//   The lower the percentage vs the page scroll, the slower it appears.
//   Try: y: "20%" and see how it feels. Adjust up for more parallax effect.
//
// Optional bonus — individual shape speeds:
//   Give each .para-shape a slightly different y value
//   for a layered depth effect:
//     #shape-a → y: "15%"    (slowest, furthest back)
//     #shape-b → y: "30%"    (medium)
//     #shape-c → y: "50%"    (fastest, closest to viewer)
//
// ═══════════════════════════════════════════════════════════════

// YOUR CODE HERE ↓
let parallaxscroll = gsap.timeline()
parallaxscroll.to('#parallax-bg',{y: "50%"})

 ScrollTrigger.create ({ 
    trigger: "#parallax",
    start:"top top",
    end: "bottom top",
    scrub: true,
animation: parallaxscroll,
  markers: true    })


// ═══════════════════════════════════════════════════════════════
// BUILD 04 — BATCH CARD REVEAL
// ═══════════════════════════════════════════════════════════════
//
// Goal:
//   Cards stagger in as they enter the viewport in batches.
//   ScrollTrigger.batch() groups elements that enter at the same
//   time and lets you animate them together.
//
// Step 1 — set the initial state (invisible + offset):
//   gsap.set('.project-card', { opacity: 0, y: 40 })
//
// Step 2 — use ScrollTrigger.batch():
//   ScrollTrigger.batch('.project-card', {
//     onEnter:     (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, ... }),
//     onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 40, stagger: 0.05, ... }),
//     start:   "top 85%",    // fire when card top hits 85% down the viewport
//     batchMax: 3,           // 3 per row — matches the CSS grid column count
//   })
//
// Hint — batchMax:
//   Set this to match your grid's column count (3 in this case).
//   It ensures a full row animates together instead of staggering individually.
//
// Hint — onLeaveBack:
//   This resets cards when the user scrolls back up — so they can
//   re-enter and animate again. Remove it if you want a play-once effect.
//
// ═══════════════════════════════════════════════════════════════

// Step 1: set initial state
// gsap.set('.project-card', { ... })

 gsap.set('.project-card', { opacity: 0, y: 40 })


 // Step 2: YOUR CODE HERE ↓
ScrollTrigger.batch(".project-card",{
     onEnter:(batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration:1,ease: "power1.out"}),
     //onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 40, stagger: 0.05,duration:1,ease: "power1.out"}),
   start:   "top 85%",    // fire when card top hits 85% down the viewport
     batchMax: 3,           // 3 per row — matches the CSS grid column count
   })








// ═══════════════════════════════════════════════════════════════
// BUILD 05 — HORIZONTAL SCROLL
// ═══════════════════════════════════════════════════════════════
//
// Goal:
//   Pin .horiz-outer so it stays fixed on screen, then translate
//   .horiz-track on the X axis as the user scrolls down —
//   creating the illusion that the panels scroll sideways.
//
// Approach:
//   gsap.to('#horiz-track', { x: ..., scrollTrigger: { pin, scrub, ... } })
//
// Key properties:
//   trigger   → "#horiz-outer"
//   pin       → true                   freeze the container
//   start     → "top top"
//   end       → "+=<total scroll distance>"
//   scrub     → 1
//   ease      → "none"                 linear — no easing on scrubbed scroll
//
// The x value (how far to translate):
//   You need to move the track left by the width of all panels except the first.
//   The cleanest way is a function that calculates it at runtime:
//
//     x: () => -(document.getElementById('horiz-track').scrollWidth - window.innerWidth)
//
//   This reads the actual rendered width so it's responsive-safe.
//
// The end value:
//   end: () => "+=" + (document.getElementById('horiz-track').scrollWidth - window.innerWidth)
//   This matches the scroll distance to the translation distance exactly.
//   Or: use a fixed value like "+=3000" and adjust until it feels right.
//
// ═══════════════════════════════════════════════════════════════

// YOUR CODE HERE ↓

gsap.to(".horiz-track", {x:-(document.getElementById('horiz-track').scrollWidth - window.innerWidth),
  scrollTrigger: {
    trigger: "#horiz-outer", 
  pin:true,
  start:"top top",
  end: "+=" + (document.getElementById('horiz-track').scrollWidth - window.innerWidth),
  scrub: 1,
  ease: "linear", 
  }
  
});

