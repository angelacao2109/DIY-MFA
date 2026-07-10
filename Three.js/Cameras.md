# Cameras
The Camera class is what we call an abstract class. You're not supposed to use it directly, but you can inherit from it to have access to common properties and methods. Some of the following classes inherit from the Camera class.

#### **ArrayCamera**

The ArrayCamera is **used** to **render** your **scene** **multiple** **times by using multiple camera**s. **Each camera will render a specific area of the canvas.** You can imagine this looking like old school console multiplayer games where we had to share a split-screen.

#### **StereoCamera**

The StereoCamera is used to render the scene through **two cameras that mimic the eyes in order to create what we call a parallax effect that will lure your brain into thinking that there is depth.** You **must have** the adequate equipment like a **VR headset or red and blue glasses to see the result.**

#### **CubeCamera**

The CubeCamera is used to get a **render** **facing each direction** (f**orward, backward, leftward, rightward, upward, and downward**) to create a render of the surrounding. You can use it to **create an environment map for reflection or a shadow map.** We'll talk about those later.

#### **OrthographicCamera**

The OrthographicCamera is used to create orthographic renders of your scene without perspective. It's useful if you make an RTS game like Age of Empire. **Elements will have the same size on the screen regardless of their distance from the camera.**

#### **PerspectiveCamera**

The PerspectiveCamera is the one we already used and simulated a real-life camera with perspective.

---

## **PerspectiveCamera**

#### ( fov : number, aspect : number, near : number, far : number )

Constructs a new perspective camera.

| **fov** | The vertical field of view.
Default is `50`. |
| --- | --- |
| **aspect** | The aspect ratio.
Default is `1`. |
| **near** | The camera's near plane.
Default is `0.1`. |
| **far** | The camera's far plane.
Default is `2000`. |

As for choosing the right field of view, you'll have to try things out. I usually use a field of view between **`45`** and **`75`**.

The third and fourth parameters called **near** and **far**, correspond to how close and how far the camera can see. Any object or part of the object closer to the camera than the **`near`** value or further away from the camera than the **`far`** value will not show up on the render.

As for choosing the right field of view, you'll have to try things out. I usually use a field of view between **`45`** and **`75`**.

While you might be tempted to use very small and very large values like **`0.0001`** and **`9999999`** you might end up with a bug called z-fighting where two faces seem to fight for which one will be rendered above the other.

Try to use reasonable values and increase those only if you need it. In our case, we can use **`0.1`** and **`100`**.

---

## **OrthographicCamera**

Its lack of perspective, meaning that the objects will have the same size regardless of their distance from the camera.

### ( left : number, right : number, top : number, bottom : number, near : number, far : number )

Constructs a new orthographic camera.

| **left** | The left plane of the camera's frustum.
Default is `-1`. |
| --- | --- |
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

We need to use the canvas ratio (width by height). Let's create a variable named **`aspectRatio`** (just like the PerspectiveCamera) and store that ratio in it:

```jsx
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
```

What we want to do now is control the camera with our mouse. First of all, we want to know the mouse coordinates. We can do that using native JavaScript by listening to the **`mousemove`** event with **`addEventListener`**.

The coordinates will be located in the argument of the callback function as **`event.clientX`** and **`event.clientY`**:

```jsx
// Cursor
window.addEventListener('mousemove', (event) =>
{
    console.log(event.clientX, event.clientY)
})
```

We could use those values, but I recommend adjusting them. By adjusting, I mean to have a **`1`** amplitude and that the value can be both negative and positive.

Just like the **`size`** variable, we will create a **`cursor`** variable with default **`x`** and **`y`** properties and then update those properties in the **`mousemove`** callback:

```jsx
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

Dividing **`event.clientX`** by **`sizes.width`** will give us a value between **`0`** and **`1`** (if we keep the cursor above the canvas) while subtracting **`0.5`** will give you a value between **`- 0.5`** and **`0.5`**.

You now have the mouse position stored in the **`cursor`** object variable, and you can update the position of the camera in the **`tick`** function:

Finally, you can increase the amplitude by multiplying the **`cursor.x`** and **`cursor.y`** and ask the camera to look at the mesh using the **`lookAt(...)`** method:

```jsx
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

We can go even further by doing a full rotation of the camera around the mesh by using **`Math.sin(...)`** and **`Math.cos(...)`**.

**`sin`** and **`cos`**, when combined and used with the same angle, enable us to place things on a circle. To do a full rotation, that angle must have an amplitude of 2 times π (called "pi"). Just so you know, a full rotation is called a "tau" but we don't have access to this value in JavaScript and we have to use π instead.

You can access an approximation of π in native JavaScript using **`Math.PI`**.

To increase the radius of that circle, you can simply multiply the result of **`Math.sin(...)`** and **`Math.cos(...)`**:

```jsx
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

#### **FlyControls**

FlyControls enable moving the camera like if you were on a spaceship. You can rotate on all 3 axes, go forward and go backward.

#### **FirstPersonControls**

FirstPersonControls is just like FlyControls, but with a fixed up axis. You can see that like a flying bird view where the bird cannot do a barrel roll. While the FirstPersonControls contains "FirstPerson," it doesn't work like in FPS games.

#### **PointerLockControls**

PointerLockControls uses the pointer lock JavaScript API. This API hides the cursor, keeps it centered, and keeps sending the movements in the **`mousemove`** event callback. With this API, you can create FPS games right inside the browser. While this class sounds very promising if you want to create that kind of interaction, it'll only handle the camera rotation when the pointer is locked. You'll have to handle the camera position and game physics by yourself.

#### **OrbitControls**

OrbitControls is very similar to the controls we made in the previous lesson. You can rotate around a point with the left mouse, translate laterally using the right mouse, and zoom in or out using the wheel.

#### **TrackballControls**

TrackballControls is just like OrbitControls but there are no limits in terms of vertical angle. You can keep rotating and do spins with the camera even if the scene gets upside down.

#### **TransformControls**

TransformControls has nothing to do with the camera. You can use it to add a gizmo to an object to move that object.

#### **DragControls**

Just like the TransformControls, DragControls has nothing to do with the camera. You can use it to move objects on a plane facing the camera by drag and dropping them.

We will only use the OrbitControls but feel free to test the other classes.

---

## **OrbitControls**

### **Instantiating**

First, we need to instantiate a variable using the OrbitControls class. While you might think you can use **`THREE.OrbitControls`** here, you are unfortunately mistaken.

The OrbitControls class is part of those classes that are not available by default in the **`THREE`** variable. That decision helps to reduce the weight of the library. And this is where our Vite template comes in.

The **`OrbitControls`** class may not be available in the **`THREE`** variable; it is still located in the dependencies folder. To import it, you must provide the path from inside the **`/node_modules/`** folder, which is **`/three/examples/jsm/controls/OrbitControls.js`**:

```jsx
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```

You can now instantiate a variable using the class **`OrbitControls`** (without the **`THREE.`**) and make sure to do that after creating the camera.

For it to work, you must provide the camera and the element in the page that will handle the mouse events as parameters:

```jsx
// Controls
const controls = new OrbitControls(camera, canvas)
```

You can now drag and drop using both the left mouse or the right mouse to move the camera, and you can scroll up or down to zoom in or out.

It's much easier than our custom code, and it comes with more controls. But let's go a little further.

### **Target**

By default, the camera is looking at the center of the scene. We can change that with the **`target`** property.

This property is a Vector3, meaning that we can change its **`x`**, **`y`** and **`z`** properties.

If we want the OrbitControls to look above the cube by default, we just have to increase the **`y`** property:

```jsx
controls.target.y = 2
```

But this won’t work just like that because we need to tell the **`OrbitControl`** to update itself. And we can do that by calling the **`update`** method right after:

```jsx
controls.target.y = 2
controls.update()
```

This is not very useful in our case so let's comment this part.

### **Damping**

If you read the documentation of OrbitControls there are mentions of **`damping`**. The damping will smooth the animation by adding some kind of acceleration and friction formulas.

To enable damping, switch the **`enableDamping`** property of **`controls`** to **`true`**.

In order to work properly, the controls also needs to be updated on each frame by calling **`controls.update()`**. You can do that on the **`tick`** function:

```jsx
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

You'll see that the controls are now a lot smoother.

You can use many other methods and properties to customize your controls such as the rotation speed, zoom speed, zoom limit, angle limit, damping strength, and key bindings (because yes, you can also use your keyboard).
