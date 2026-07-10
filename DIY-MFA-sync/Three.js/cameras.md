---
notion-url: https://www.notion.so/393c3dcfa16e80d68f6de92ef7e36dad
title: Cameras
date: '2026-07-04 13:36:00.000'
from_notion: https://app.notion.com/p/Cameras-393c3dcfa16e80d68f6de92ef7e36dad
author: Angela Cao
last_edited_time: '2026-07-04 14:38:00.000'
---
<br/>

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

---

<br/>

## **PerspectiveCamera**

[//]: # (heading_4 is not supported)

 | **fov** | The vertical field of view.
Default is `50`. | 
 | ---- | ---- | 
 | **aspect** | The aspect ratio.
Default is `1`. | 
 | **near** | The camera's near plane.
Default is `0.1`. | 
 | **far** | The camera's far plane.
Default is `2000`. | 

---

<br/>

## **OrthographicCamera**

<br/>

### ( left : number, right : number, top : number, bottom : number, near : number, far : number )

 | **left** | The left plane of the camera's frustum.
Default is `-1`. | 
 | ---- | ---- | 
 | **right** | The right plane of the camera's frustum.
Default is `1`. | 
 | **top** | The top plane of the camera's frustum.
Default is `1`. | 
 | **bottom** | The bottom plane of the camera's frustum.
Default is `-1`. | 
 | **near** | The camera's near plane.
Default is `0.1`. | 
 | **far** | The camera's far plane.
Default is `2000`. | 


```javascript
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
```

<br/>


```javascript
// Cursor
window.addEventListener('mousemove', (event) =>
{
    console.log(event.clientX, event.clientY)
})
```

<br/>


```javascript
// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})
```


```javascript
const tick = () =>
{
    // ...

    // Update camera
    camera.position.x = cursor.x * 5
    camera.position.y = cursor.y * 5
    camera.lookAt(mesh.position)

    // ...
}
```

<br/>


```javascript
const tick = () =>
{
    // ...

    // Update camera
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)

    // ...
}

tick()
```

---

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

[//]: # (heading_4 is not supported)

---

## **OrbitControls **

### **Instantiating**


```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```


```javascript
// Controls
const controls = new OrbitControls(camera, canvas)
```

### **Target**


```javascript
controls.target.y = 2
```


```javascript
controls.target.y = 2
controls.update()
```

### **Damping**


```javascript
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// ...

const tick = () =>
{
    // ...

    // Update controls
    controls.update()

    // ...
}
```

