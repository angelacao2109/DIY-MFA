---
notion-url: https://www.notion.so/393c3dcfa16e80c88cd3eed0725d2704
title: Fullscreen and resizing
date: '2026-07-04 14:49:00.000'
from_notion: https://app.notion.com/p/Fullscreen-and-resizing-393c3dcfa16e80c88cd3eed0725d2704
author: Angela Cao
last_edited_time: '2026-07-04 15:07:00.000'
---
## **Fit in the viewport**


```javascript
// ...

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ...
```

<br/>


```css
*
{
    margin: 0;
    padding: 0;
}
```


```css
.webgl
{
    position: fixed;
    top: 0;
    left: 0;
	  outline: none;
}
```

<br/>


```css
html,
body
{
    overflow: hidden;
}
```

---

## **Handle resize**


```javascript
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
})
```


```javascript
window.addEventListener('resize', () =>
{
    // ...

    // Update camera
    camera.aspect = sizes.width / sizes.height
})
```


```javascript
window.addEventListener('resize', () =>
{
    // ...

    camera.updateProjectionMatrix()
})
```


```javascript
window.addEventListener('resize', () =>
{
    // ...

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})
```


```javascript
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})
```

---

## **Handle pixel ratio **

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)


```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```


```javascript
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
```

---

## **Handle fullscreen **


```javascript
window.addEventListener('dblclick', () =>
{
    console.log('double click')
})
```

- A way to know if it's already in fullscreen

- A method to go to the fullscreen mode

- A method to leave the fullscreen mode


```javascript
window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        console.log('go fullscreen')
    }
    else
    {
        console.log('leave fullscreen')
    }
})
```


```javascript
window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        console.log('leave fullscreen')
    }
})
```


```javascript
window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})
```


```javascript
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})
```

<br/>

