# Animation
Every time `tick` fires, it logs a string and reschedules itself.

```jsx
/**
 * Animate
 */
const tick = () =>
{
    console.log('tick')

    window.requestAnimationFrame(tick)
}

tick()
```

---

The problem is, if you test this code on a computer with high frame rate, the cube will rotate faster, and if you test on a lower frame rate, the cube will rotate slower.

```jsx
/**
 * Animate
 */
const tick = () =>
{
    // Update objects
    mesh.rotation.y += 0.01

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

---

To adapt the animation to the framerate, we need to know how much time it's been since the last tick.

First, we need a way to measure time. In native JavaScript, you can use **`Date.now()`** to get the current timestamp:

The timestamp corresponds to how much time has passed since the 1st of January 1970 (the beginning of time for Unix). In JavaScript, its unit is in milliseconds.

What you need now is to subtract the current timestamp to that of the previous frame to get what we can call the **`deltaTime`** and use this value when animating objects:

```jsx
/**
 * Animate
 */
let time = Date.now()

const tick = () =>
{
		// Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    // Update objects
    mesh.rotation.y += 0.01 * deltaTime

    // ...
}

tick()
```

---

Three.js named Clock that will handle the time calculations.

You simply have to instantiate a Clock variable and use the built-in methods like **`getElapsedTime()`**. This method will return how many **seconds** have passed since the Clock was created.

You can use this value to rotate the object:

```jsx
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime

    // ...
}

tick()
```

---

You can also use it to move things with the **`position`** property. If you combine it with **`Math.sin(...)`** you can get a pretty good result: (Moving up and down)

```jsx
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.position.x = Math.cos(elapsedTime)
    mesh.position.y = Math.sin(elapsedTime)

    // ...
}

tick()
```
