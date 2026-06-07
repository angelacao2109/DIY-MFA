# gsap.context()

doc: https://gsap.com/docs/v3/GSAP/gsap.context()/

A **`gsap.context()`** offers two key benefits:

- **Collects all GSAP animations and ScrollTriggers** that are created within the supplied function so that you can easily **`revert()`** or **`kill()`ALL** of them at once. No need to keep track of a bunch of variables, Arrays, etc. This is particularly useful in React modules or anywhere you need to be able to "clean up" by reverting elements to their original state.

- [optionally] **Scopes all selector text to a particular Element or Ref**. This can help simplify your code quite a bit and avoid needing to create lots of **Refs** in React/Angular. Any GSAP-related selector text inside the supplied function will only apply to descendants of the Element/Ref.
