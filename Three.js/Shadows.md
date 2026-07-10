# Shadows

The back of the objects are indeed in the dark, and this is called the **core shadow**. What we are missing is the **drop shadow**, where objects create shadows on the other objects.

<img width="2720" height="1360" alt="shadow_map_light_as_camera_mechanism (1)" src="https://github.com/user-attachments/assets/5a15a116-c95e-4bb4-8eaf-29a34818bcbe" />


```jsx
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
```

`receiveShadow` means "test this object's surface against the shadow map when drawing."

`castShadow` means "include this object in the light's secret depth render." 

activate the shadows on the light with the **`castShadow`** property.

Only the following types of lights support shadows:

- PointLight
- DirectionalLight
- SpotLight

```jsx
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.castShadow = true
```

**`mapSize`** — the *resolution* of the shadow map image. You used 256; Bruno's notes default to 1024. Bigger = crisper shadow edges, more expensive. 

```jsx
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
```

**`camera.near` / `camera.far`** — the same clipping planes as a normal camera, because the shadow render *is* a camera. Anything nearer than `near` or farther than `far` is ignored by the depth render. These fix bugs (shadow missing or cropped), not quality.

To help us debug the camera and preview the **`near`** and **`far`**, we can use a CameraHelper with the camera used for the shadow map located in the **`directionalLight.shadow.camera`** property:

```jsx
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
// ...

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
```

### **Amplitude**

With the camera helper we just added, we can see that the camera's amplitude is too large.

Because we are using a DirectionalLight, Three.js is using an OrthographicCamera. If you remember from the Cameras lesson, we can control how far on each side the camera can see with the **`top`**, **`right`**, **`bottom`**, and **`left`** properties. Let's reduce those properties:

```jsx
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
```

## Blur

You can control the shadow blur with the **`radius`** property:

```jsx
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
// ...
directionalLight.shadow.radius = 10
```

---

- **THREE.BasicShadowMap:** Very performant but lousy quality
- **THREE.PCFShadowMap:** Less performant but smoother edges
- **THREE.PCFSoftShadowMap:** Less performant but even softer edges
- **THREE.VSMShadowMap:** Less performant, more constraints, can have unexpected results

To change it, update the **`renderer.shadowMap.type`** property. The default is **`THREE.PCFShadowMap`** but you can use **`THREE.PCFSoftShadowMap`** for better quality.

```jsx
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```
