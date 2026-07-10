---
notion-url: https://www.notion.so/391c3dcfa16e802b9181e78809d3b59c
title: 'Animation '
date: '2026-07-02 19:45:00.000'
from_notion: https://app.notion.com/p/Animation-391c3dcfa16e802b9181e78809d3b59c
author: Angela Cao
last_edited_time: '2026-07-04 13:30:00.000'
---

```javascript
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

<br/>


```javascript
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

<br/>


```javascript
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


```javascript
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


```javascript
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

