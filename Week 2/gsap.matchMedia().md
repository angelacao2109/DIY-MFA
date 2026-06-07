# gsap.matchMedia()

doc: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/

**`gsap.matchMedia()`** lets you tuck setup code into a function that only executes when a particular **media query** matches and then when it no longer matches, all the GSAP animations and **ScrollTriggers** created during that function's execution get **reverted automatically**! Customizing for mobile/desktop or **`prefers-reduced-motion`** accessibility is remarkably simple.

```jsx
// create
let mm = gsap.matchMedia();

// add a media query. When it matches, the associated function will run
mm.add("(min-width: 800px)", () => {

  // this setup code only runs when viewport is at least 800px wide
  gsap.to(...);
  gsap.from(...);
  ScrollTrigger.create({...});

  return () => { // optional
    // custom cleanup code here (runs when it STOPS matching)
  };
});

// later, if we need to revert all the animations/ScrollTriggers...
mm.revert();
```


### **Simplistic desktop/mobile example**

```jsx
let mm= gsap.matchMedia();mm.add("(min-width: 800px)",()=>{// desktop setup code here...});mm.add("(max-width: 799px)",()=>{// mobile setup code here...});
```

```jsx
let mm = gsap.matchMedia(),
  breakPoint = 800;

mm.add(
  {
    // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
    isDesktop: `(min-width: ${breakPoint}px)`,
    isMobile: `(max-width: ${breakPoint - 1}px)`,
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
    let { isDesktop, isMobile, reduceMotion } = context.conditions;

    gsap.to(".box", {
      rotation: isDesktop ? 360 : 180, // spin further if desktop
      duration: reduceMotion ? 0 : 2, // skip to the end if prefers-reduced-motion
    });

    return () => {
      // optionally return a cleanup function that will be called when none of the conditions match anymore (after having matched)
      // it'll automatically call context.revert() - do NOT do that here . Only put custom cleanup code here.
    };
  }
);
```
