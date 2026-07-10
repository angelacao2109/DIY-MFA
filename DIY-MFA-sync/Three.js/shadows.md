---
notion-url: https://www.notion.so/395c3dcfa16e8081a722de97338a4e63
title: Shadows (Need to do)
date: '2026-07-06 13:28:00.000'
from_notion: https://app.notion.com/p/Shadows-Need-to-do-395c3dcfa16e8081a722de97338a4e63
author: Angela Cao
last_edited_time: '2026-07-10 14:07:00.000'
---
<br/>

![shadow_map_light_as_camera_mechanism](dd9a8059_shadow_map_light_as_camera_mechanism.png)

<br/>


```javascript
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
```

<br/>

<br/>

- [PointLight](https://threejs.org/docs/index.html#api/en/lights/PointLight)

- [DirectionalLight](https://threejs.org/docs/index.html#api/en/lights/DirectionalLight)

- [SpotLight](https://threejs.org/docs/index.html#api/en/lights/SpotLight)

<br/>


```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.castShadow = true
```


```javascript
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
```

<br/>


```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
// ...

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
```

<br/>

### **Amplitude**


```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
```

<br/>

## Blur


```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.radius = 10
```

---

<br/>

- **THREE.BasicShadowMap: **Very performant but lousy quality

- **THREE.PCFShadowMap: **Less performant but smoother edges

- **THREE.PCFSoftShadowMap: **Less performant but even softer edges

- **THREE.VSMShadowMap: **Less performant, more constraints, can have unexpected results


```javascript
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

