---
notion-url: https://www.notion.so/391c3dcfa16e80f39af2f41be8cb90e8
title: How to transform an object
date: '2026-07-02 17:27:00.000'
from_notion: https://app.notion.com/p/How-to-transform-an-object-391c3dcfa16e80f39af2f41be8cb90e8
author: Angela Cao
last_edited_time: '2026-07-02 19:41:00.000'
---
<br/>

- `**position**` (to move the object)

- `**scale**` (to resize the object)

- `**rotation**` (to rotate the object)

- `**quaternion**` (to also rotate the object; more about that later)

<br/>

# Position

<br/>


```javascript
console.log(mesh.position.length())
```


```javascript
console.log(mesh.position.distanceTo(camera.position))
```


```javascript
console.log(mesh.position.normalize())
```

<br/>

# Rotation


```javascript
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```

# **Scale **


```javascript
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
```

<br/>


```javascript
import * as THREE from 'three'

// Canvas
// Grabs the real <canvas class="webgl"> from index.html — everything below
// needs an actual DOM element to draw into.
const canvas = document.querySelector('canvas.webgl')

// Scene
// The empty container. Nothing exists in the 3D world until it's added here.
const scene = new THREE.Scene()

/**
 * Axes Helper
 */
// Debugging visual only — draws the x/y/z axes as red/green/blue lines,
// 2 units long, meeting at the origin. Doesn't affect rendering logic at all.
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper) // building it isn't enough — still invisible until it's added

/**
 * Objects
 */
// An empty container with its own position/rotation/scale — same properties
// as a Mesh — it just holds other objects instead of holding geometry.
const group = new THREE.Group()
group.scale.y = 2       // the group's own y-scale — invisible until it holds something
group.rotation.y = 0.2  // ~11.5°, also invisible for now
scene.add(group)        // order doesn't matter here — it's still empty at this point

// Same Mesh recipe as the very first cube — geometry + material — just built
// inline as constructor arguments instead of getting named variables first.
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1) // child of the GROUP, not the scene — this is why it inherits the group's transform

// Same pattern, centered
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

// Same pattern again, mirrored to the right
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)

/**
 * Sizes
 */
// Plain JavaScript, not three.js — one source of truth reused below so the
// camera's aspect ratio and the renderer's output size can never drift apart.
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // 75° field of view
camera.position.z = 3 // backs the camera away from the origin, where everything else sits
// camera.lookAt(new THREE.Vector3(0, - 1, 0)) // inactive — would aim the camera at a point without manual rotation math
scene.add(camera) // optional; not required for rendering, harmless either way

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas // connects the renderer to the real canvas grabbed at the top of the file
})
renderer.setSize(sizes.width, sizes.height) // output resolution, same sizes object again
renderer.render(scene, camera) // the only line that actually produces pixels — everything above is setup
```

