# Three.js Setup

# File Setup

1.  **New project folder** — just a folder on your machine. Open a terminal, `cd` into it.

2. **package.json** — `npm init -y` generates a starter one. Then `npm install three vite` pulls in both packages and creates `node_modules` + a lockfile. **Then by hand, add the two scripts:**

`"scripts": {
  "dev": "vite",
  "build": "vite build"
}` 

3. **index.html** — needs a canvas and a script tag pointing at your entry file:

`<canvas class="webgl"></canvas>
<script type="module" src="./script.js"></script>`

4. `type="module"`  it's what lets `script.js` use `import` syntax at all.

5. **script.js** — this is the four pieces we've already gone through: **Scene, Object, Camera, Renderer**, in that order, because each one depends on the last existing first.

6. **`npm run dev`** — starts Vite's local server and prints a `localhost` link in your terminal. Open it, and you're looking at whatever `renderer.render()` drew.

7. **Instantiating lil-gui** 

To add lil-gui to our project, we can use the dependency manager provided with Node.js called NPM (just like we did for GSAP in a previous lesson).

In your terminal (while the server is not running or by using another terminal window in the same folder) run **`npm install lil-gui`**

lil-gui is now available in the **`node_modules/`** folder and we can import it into our **`script.js`**. Don't forget to relaunch the server:

```jsx
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

// ...
```

You can now instantiate lil-gui in a **`gui`** variable and we can do that at the very beginning, right after the imports:

```jsx
/**
 * Debug
 */
const gui = new GUI()
```

In the rest of the course, you might see something more like this:

```jsx
import * as dat from 'lil-gui'

// ...

const gui = new dat.GUI()
```

It basically boils down to the same thing. Feel free to use whatever solution you prefer.

## **The different types of tweaks**

On the top right corner of the experience, you can see an empty panel. There are different types of tweaks you can add to that panel:

- **Range** —for numbers with minimum and maximum value
- **Color** —for colors with various formats
- **Text** —for simple texts
- **Checkbox** —for booleans (**`true`** or **`false`**)
- **Select** —for a choice from a list of values
- **Button** —to trigger functions

https://threejs-journey.com/lessons/debug-ui#tweaking-the-geometry

---

# Three JS Code

To actually be able to display anything with three.js, we need three things:  **scene, camera** and **renderer**

<img width="636" height="501" alt="image (2)" src="https://github.com/user-attachments/assets/e9685881-a05a-4b51-b6f1-58f92f44478d" />

## Scene — somewhere to put things

A `Scene` by itself is an empty container. You place your objects, models, particles, lights, etc. in it, and at some point, you ask Three.js to render that scene.

```jsx
const scene = new THREE.Scene()
```

## Objects

Objects can be many things. You can have primitive geometries, imported models, particles, lights, and so on.

```jsx
// Object
// width, height, depth
const geometry = new THREE.BoxGeometry(1, 1, 1) 

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

const mesh = new THREE.Mesh(geometry, material)
```

There are many geometries and many materials, but we will keep things simple for now and create a BoxGeometry and a MeshBasicMaterial.

To create the **geometry**, we use the BoxGeometry class with the first 3 parameters that correspond to the box's size.

To create the **material**, we use the MeshBasicMaterial class with one parameter: an object **`{}`** containing all the options. All we need is to specify its **`color`** property.

- There are many ways to specify a color in Three.js. You can send it as a JS hexadecimal **`0xff0000`**, you can send it as a string hexadecimal **`'#ff0000'`**, you can use color names like **`'red'`**, or you can send an instance of the Color class

We need to create a type of object named **Mesh**. A Mesh is the combination of a geometry (the shape) and a material (how it looks). To create the final mesh, we use the Mesh class and send the **`geometry`** and the **`material`** as parameters.

You can now add your mesh to the scene by using the **`add(...)`** method:

```jsx
scene.add(mesh)
```

If you don't add an object to the scene, you won't be able to see it.

## **Camera**

When we will do a render of your scene, it will be from that camera's point of view.

You can have multiple cameras just like on a movie set, and you can switch between those cameras as you please. Usually, we only use one camera.

There are different types of cameras. For now, we simply need a camera that handles perspective (making close objects look more prominent than far objects).

To create the camera, we use the PerspectiveCamera class.

There are two essential parameters we need to provide. (field of view, aspect ratio)

```jsx
// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

scene.add(camera)
```

**The field of view**

The field of view is how large your vision angle is. If you use a very large angle, you'll be able to see in every direction at once but with much distortion, because the result will be drawn on a small rectangle. If you use a small angle, things will look zoomed in. The field of view (or **`fov`**) is expressed in **degrees** and **corresponds to the vertical vision angle**.

**The aspect ratio**

In most cases, the **aspect ratio** is the **width of the canvas divided by its height.** 

Don't forget to add your camera to the scene. Everything should work without adding the camera to the scene, but it might result in bugs later:

## **Renderer**

The renderer's job is to do the render. 

We will simply ask the renderer to render our scene from the camera's point of view, and the result will be drawn into a canvas. You can create the canvas by yourself, or let the renderer generate it and then add it to your page. For this exercise, we will add the canvas to the HTML and send it to the renderer.

In **`index.html`**, instead of the **`<h1>`**, create the **`<canvas>`** element **before** you load the scripts and give it a class:

```html
<canvas class="webgl"></canvas>
```

To create the renderer, we use the WebGLRenderer class with one parameter: an object **`{}`** containing all the options. We need to specify the **`canvas`** property corresponding to the **`<canvas>`** we added to the page.

Create a **`canvas`** variable at the start of the code, then fetch and store in it the element we created in the HTML using **`document.querySelector(...)`**.

It's better to assign the canvas to a variable because we'll use it for other purposes in the next lessons.

We also need to update the size of your renderer with the **`setSize(...)`** method using the **`sizes`** object we created earlier.

The **`setSize(...)`** method will automatically resize our **`<canvas>`** accordingly:

```jsx
// Canvas
const canvas = document.querySelector('canvas.webgl')

// scene, object, camera 

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
```

Right now, you won’t be able to see anything, but your canvas is there and has been resized accordingly. 

### **First render**

It's time to work on our first render. Call the **`render(...)`** method on the renderer and send it the **`scene`** and the **`camera`** as parameters:

```jsx
renderer.render(scene, camera)
```

![](https://threejs-journey.com/assets/lessons/3/008.jpg)

**Here's the issue:** we **haven't specified our object's position, nor our camera's**. Both are in the **default position, which is the center of the scene and we can't see an object from its inside (by default).**

We need to move things.

To do that, we have access to multiple properties on each object, such as **`position`**, **`rotation`**, and **`scale`**. For now, use the **`position`** property to move the camera backward.

The **`position`** property is an object with three relevant properties: **`x`**, **`y`** and **`z`**. By default, Three.js considers the forward/backward axis to be **`z`**.

**To move the camera backward, we need to provide a positive value to that property.** You can do that anywhere once you've created the **`camera`** variable, yet it has to happen before you do the render:

```jsx
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)
```

![](https://threejs-journey.com/assets/lessons/3/009.jpg)
