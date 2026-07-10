---
notion-url: https://www.notion.so/394c3dcfa16e8007a83ff764491b5a63
title: Textures
date: '2026-07-05 17:40:00.000'
from_notion: https://app.notion.com/p/Textures-394c3dcfa16e8007a83ff764491b5a63
author: Angela Cao
last_edited_time: '2026-07-06 01:34:00.000'
---
---

![texture_loading_steps](3402c7ef_texture_loading_steps.png)

### **Color (or albedo) **

![000](cd0fdabf_000.jpg)

### **Alpha **

![001](fb57ce10_001.jpg)

### **Height **

![002](24c08d02_002.png)

### **Normal **

![003](300ea1f6_003.jpg)

### **Ambient occlusion **

![004](9ce82703_004.jpg)

### **Metalness **

![005](dc2f0650_005.jpg)

### **Roughness **

![006](1e810ff1_006.jpg)

### **PBR **

- [https://marmoset.co/posts/basic-theory-of-physically-based-rendering/](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)

- [https://marmoset.co/posts/physically-based-rendering-and-you-can-too/](https://marmoset.co/posts/physically-based-rendering-and-you-can-too/)

---

## **How to load textures**

### **Getting the URL of the image **


```javascript
import imageSource from './image.png'

console.log(imageSource)
```


```javascript
const imageSource = '/image.png'

console.log(imageSource)
```

### **Loading the image **

[//]: # (heading_4 is not supported)


```javascript
const image = new Image()
image.addEventListener('load', () =>
{
    const texture = new THREE.Texture(image)
})
image.src = '/textures/door/color.jpg'
```


```javascript
const image = new Image()
const texture = new THREE.Texture(image)

image.addEventListener('load', () =>
{
    texture.needsUpdate = true
})
image.src = '/textures/door/color.jpg'
```


```javascript
const material = new THREE.MeshBasicMaterial({ map: texture })
```

![007](8f342e4b_007.png)


```javascript
const texture = new THREE.Texture(image)
texture.colorSpace = THREE.SRGBColorSpace
```

![008](bd67de68_008.png)

<br/>

## **Using TextureLoader **


```javascript
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/door/color.jpg')
texture.colorSpace = THREE.SRGBColorSpace
```

- `**load**` when the image loaded successfully

- `**progress**` when the loading is progressing

- `**error**` if something went wrong


```javascript
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
    '/textures/door/color.jpg',
    () =>
    {
        console.log('loading finished')
    },
    () =>
    {
        console.log('loading progressing')
    },
    () =>
    {
        console.log('loading error')
    }
)
texture.colorSpace = THREE.SRGBColorSpace
```

[//]: # (heading_4 is not supported)


```javascript
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
```


```javascript
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
```


```javascript
// ...

const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
```


```javascript
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
```

---

## **UV unwrapping **


```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Or
const geometry = new THREE.SphereGeometry(1, 32, 32)

// Or
const geometry = new THREE.ConeGeometry(1, 1, 32)

// Or
const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)
```

![009](4446e716_009.png)


```javascript
console.log(geometry.attributes.uv)
```

![010](a7153b4d_010.png)

## **Transforming the texture **

### **Repeat **


```javascript
const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
```

![011](70756e13_011.png)

- `**wrapS**` is for the `**x**` axis

- `**wrapT**` is for the `**y**` axis


```javascript
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
```

![012](611cd2a9_012.png)


```javascript
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
```

![013](810e7aae_013.png)

### **Offset **


```javascript
colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5
```

![014](e1c772df_014.png)

### **Rotation **


```javascript
colorTexture.rotation = Math.PI * 0.25
```

![015](09f8d0b2_015.png)

![016](ef43ccce_016.png)


```javascript
colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
```

![017](ecc57857_017.png)

## **Filtering and Mipmapping **

![018](3c838b17_018.png)

### **Minification filter **

- `**THREE.NearestFilter**`

- `**THREE.LinearFilter**`

- `**THREE.NearestMipmapNearestFilter**`

- `**THREE.NearestMipmapLinearFilter**`

- `**THREE.LinearMipmapNearestFilter**`

- `**THREE.LinearMipmapLinearFilter**`


```javascript
colorTexture.minFilter = THREE.NearestFilter
```


```javascript
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
```

### **Magnification filter **


```javascript
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
```

![021](24e8af4a_021.png)

- `**THREE.NearestFilter**`

- `**THREE.LinearFilter**`


```javascript
colorTexture.magFilter = THREE.NearestFilter
```

![022](e71ac470_022.png)


```javascript
const colorTexture = textureLoader.load('/textures/minecraft.png')
```

![023](ce7216e1_023.png)


```javascript
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
```

## **Texture format and optimisation **

- The weight

- The size (or the resolution)

- The data

### **The weight **

### **The size **

### **The data **

## **Where to find textures **

- [poliigon.com](http://poliigon.com/)

- [3dtextures.me](http://3dtextures.me/)

- [arroway-textures.ch](http://arroway-textures.ch/)

---


```javascript
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()

//fires once, at the very first load, across all textures.
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
//Fires exactly once, only once everything sharing this manager has finished.
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
// fires once per file as each one completes; up to seven times below.
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
// fires per file that fails.
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}


const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const colorTexture = textureLoader.load(
    '/textures/minecraft.png',
    () =>
    {
        console.log('textureLoader: loading finished')
    },
    () =>
    {
        console.log('textureLoader: loading progressing')
    },
    () =>
    {
        console.log('textureLoader: loading error')
    }
)
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

