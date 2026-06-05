
    /*
     * ── 1. NAV STAGGER ─────────────────────────────────────────
     *
     *  Target   →  '.nav-item'          (5 elements)
     *  Animate  →  from y:-20, opacity:0  →  natural position
     *  Stagger  →  0.1s between each item
     *
     *  Hint: create a gsap.timeline(), add a .from() to it.
     *  The timeline keeps everything one coordinated sequence.
     *
     *  YOUR CODE ↓
     */


    /*
     * ── 2. HERO WORD REVEAL ────────────────────────────────────
     *
     *  Animate  →  from y:50, opacity:0  →  natural position
     *  Stagger  →  0.08s between each word
     *
     *  How the mask works:
     *    .word-wrapper { overflow: hidden }  ← clips the word
     *    .word          { display: inline-block } ← what moves
     *    GSAP moves .word upward — the wrapper edge hides
     *    it until it rises into view. You don't touch the
     *    wrapper. Just animate .word.
     *
     *  YOUR CODE ↓
     */


    /*
     * ── BONUS (try these once the above work) ──────────────────
     *
     *  a) Chain the hero animation AFTER the nav on the timeline
     *     so they play in sequence, not at the same time.
     *     Hint: timeline position parameter  ">-0.2"
     *
     *  b) Add .hero-eyebrow and .hero-sub to the sequence.
     *     Fade them in after the words finish.
     *
     *  c) Try adding  ease: "power3.out"  to both animations.
     *     Swap it for  ease: "back.out(1.7)"  — notice the
     *     overshoot on the words.
     */




let animation=gsap.timeline()
.from(".nav-item",{y:-40, opacity:0,stagger: 0.1 })
.from(".word",{y:100, autoAlpha:0,stagger: 0.08 },">-0.2")


