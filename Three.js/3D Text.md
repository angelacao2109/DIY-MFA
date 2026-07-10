# 3D Text

Three.js already supports 3D text geometries with the TextGeometry class. 

- The problem is that you must specify a font, and this font must be in a particular json format called typeface.

## Need to do

First, you can convert your font with converters like this one: https://gero3.github.io/facetype.js/. You have to provide a file and click on the convert button.

To load the font, we must use a new loader class called FontLoader.

```jsx
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        console.log('loaded')
    }
)
```

 TextGeometry

```jsx
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
```

Make sure to write your code inside the success function:

```jsx
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial = new THREE.MeshBasicMaterial()
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)
```

add **`wireframe: true`** to your material.

```jsx
const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
```

You can now see how the geometry is generated, and there are a lot of triangles. Creating a text geometry is long and hard for the computer. Avoid doing it too many times and keep the geometry as low poly as possible by reducing the **`curveSegments`** and **`bevelSegments`** properties.

---

### Center text

There are several ways to center the text. One way of doing it is by using bounding. The bounding is the information associated with the geometry that tells what space is taken by that geometry. It can be a box or a sphere.

!image.png

By **default**, **Three.js is using sphere bounding.** What we want is a box bounding, to be more precise. To do so, we can ask Three.js to calculate this box bounding by calling **`computeBoundingBox()`** on the geometry:

```jsx
textGeometry.computeBoundingBox()
```

The result is an object called Box3 that has a **`min`** property and a **`max`** property. The **`min`** property isn't at **`0`** as we could have expected. That is due to the **`bevelThickness`** and **`bevelSize`**, but we can ignore this for now.

Now that we have the measures, we can move the object. Instead of moving the mesh, we are going to move the whole geometry. This way, the mesh will still be in the center of the scene, but the text geometry will also be centered inside our mesh.

To do this, we can use the **`translate(...)`** method on our geometry right after the **`computeBoundingBox()`** method:

```jsx
textGeometry.translate(
    - textGeometry.boundingBox.max.x * 0.5,
    - textGeometry.boundingBox.max.y * 0.5,
    - textGeometry.boundingBox.max.z * 0.5
)
```

The text should be centered but if you want to be very precise, you should also subtract the **`bevelSize`** which is **`0.02`**:

```jsx
textGeometry.translate(
    - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
    - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
    - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
)
```

**What we did here can actually be done much faster by calling the `center()` method on the geometry:**

```jsx
textGeometry.center()
```

---

## **Add a matcap material**

 We are going to use a MeshMatcapMaterial because it looks cool, and it has great performance.

You can also download one from this repository https://github.com/nidorx/matcaps. Don't spend too much time choosing it! If it's not for personal usage, make sure you have the right to use it. You don't need a high-resolution texture and **`256x256`** should be more than enough.

We can now load the texture by using the TextureLoader already in the code:

```jsx
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
```

Textures used as **`map`** and **`matcap`** are supposed to be encoded in **`sRGB`** and we need to inform Three.js of this by setting their **`colorSpace`** to **`THREE.SRGBColorSpace`**:

```jsx
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
```

We can now replace our ugly MeshBasicMaterial by a beautiful MeshMatcapMaterial and use our **`matcapTexture`** variable with the **`matcap`** property:

```jsx
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
```

You should have a lovely text with a cool looking material on it.

## **Add objects**

Let's add objects floating around. To do that, we will create one donut but inside a loop function.

In the success function, right after the **`text`** part, add the loop function:

```jsx
for(let i = 0; i < 100; i++)
{

}
```

We could have done this outside of the success function but we are going to need the text and the objects being created together for a good reason that you'll see a little later.

In this loop, create a TorusGeometry (such a technical name for a donut), the same material as for the text and the Mesh:

```jsx
for(let i = 0; i < 100; i++)
{
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    scene.add(donut)
}
```

![](https://threejs-journey.com/assets/lessons/13/006.png)

You should get 100 donuts all in the same place.

Let's add some randomness for their position:

```jsx
donut.position.x = (Math.random() - 0.5) * 10
donut.position.y = (Math.random() - 0.5) * 10
donut.position.z = (Math.random() - 0.5) * 10
```

You should get the 100 donuts dispersed on the scene.

Add randomness to the rotation. No need to rotate all 3 axes, and because the donut is symmetric, half of a revolution is enough:

```jsx
donut.rotation.x = Math.random() * Math.PI
donut.rotation.y = Math.random() * Math.PI
```

The donuts should have rotate in all directions.

Finally, we can add randomness to the scale. Be careful, though; we need to use the same value for all 3 axes (**`x`**, **`y`**, **`z`**):

```jsx
const scale = Math.random()
donut.scale.set(scale, scale, scale)
```

---

## **Optimize**

Our code isn't very optimized. As we saw in a previous lesson, we can use the same material on multiple Meshes, but we can also use the same geometry.

Move the **`donutGeometry`** and the **`donutMaterial`** out of the loop:

```jsx
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

for(let i = 0; i < 100; i++)
{
    // ...
}
```

You should get the same result, but we can go even further. The material of the **`text`** is the same as for the **`donut`**.

Let's remove the **`donutMaterial`**, rename the **`textMaterial`** by **`material`** and use it for both the **`text`** and the **`donut`**:

```jsx
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

// ...

const text = new THREE.Mesh(textGeometry, material)

// ...

for(let i = 0; i < 100; i++)
{
    const donut = new THREE.Mesh(donutGeometry, material)

    // ...
}
```

We could go even further, but there is a dedicated lesson about optimizations.
