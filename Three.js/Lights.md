# Lights 
1. **Direct lighting**: light rays that come directly from the bulb and hit an object.
2. **Indirect lighting**: light rays that have bounced off the walls and other objects in the room before hitting an object, changing color, and losing intensity with each bounce.

Matching these, the light classes in three.js are split into two types:

1. **Direct lights**, which simulate direct lighting.
2. **Ambient lights**, which are a cheap and *somewhat* believable way of faking indirect lighting.

<img width="2720" height="1880" alt="six_threejs_light_emission_shapes" src="https://github.com/user-attachments/assets/c5d07a9a-9178-4f1a-aaf5-5b793badbf1b" />


**`AmbientLight`** — fills everything, equally, from no direction

 **`DirectionalLight`**:This light type mimics rays from a faraway light source like the **sun**. Only its *direction* matters, set by `position` relative to the target

**`PointLight`** — radiates outward from a single point in all directions, like a **light** **bulb**, and fades with distance. Needs a real position

**`HemisphereLight`** — like ambient, but *two* colors

```jsx
new THREE.HemisphereLight(skyColor, groundColor, intensity)
```

**`RectAreaLight`** — a glowing rectangle, like a photographer's softbox. A mix of directional and diffuse — soft, flattering light spilling off a panel.

```jsx
new THREE.RectAreaLight(color, intensity, width, height)
```

it **only works with `MeshStandardMaterial` and `MeshPhysicalMaterial`**

```jsx
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())   // aim at the center (0,0,0)
```

**SpotLight** — a cone, like a flashlight or stage **spotlight**. 

```jsx
new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
```

- `angle` — how wide the cone opens
- `penumbra` — how soft/blurry the cone's edge is (0 = sharp circle, 1 = very feathered)
- `distance`/`decay` — same fade concepts as PointLight

## **Performance**

Try to add as few lights as possible and try to use the lights that cost less.

Minimal cost:

- AmbientLight
- HemisphereLight

Moderate cost:

- DirectionalLight
- PointLight

High cost:

- SpotLight
- RectAreaLight

---

Positioning and orienting the lights is hard. To assist us, we can use helpers. Only the following helpers are supported:

- HemisphereLightHelper
- DirectionalLightHelper
- PointLightHelper
- RectAreaLightHelper
- SpotLightHelper

To use them, simply instantiate those classes. Use the corresponding light as a parameter, and add them to the scene. The second parameter enables you to change the helper's **`size`**:

```jsx
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
```<img width="2720" height="1880" alt="six_threejs_light_emission_shapes" src="https://github.com/user-attachments/assets/f7b70859-c3eb-4dc8-b3e7-89ec0479dc3f" />
