In Three.js, geometries are composed of vertices (point coordinates in 3D spaces) and faces (triangles that join those vertices to create a surface).

All the built-in geometries we are going to see inherit from the BufferGeometry class. This class has many built in methods like **`translate(...)`**, **`rotateX(...)`**, **`normalize()`**, etc. but we are not going to use them in this lesson.

Most of the geometries documentation pages have examples.

- BoxGeometry To create a box.
- PlaneGeometry To create a rectangle plane.
- CircleGeometry To create a disc or a portion of a disc (like a pie chart).
- ConeGeometry To create a cone or a portion of a cone. You can open or close the base of the cone.
- CylinderGeometry To create a cylinder. You can open or close the ends of the cylinder and you can change the radius of each end.
- RingGeometry To create a flat ring or portion of a flat circle.
- TorusGeometry To create a ring that has a thickness (like a donut) or portion of a ring.
- TorusKnotGeometry To create some sort of knot geometry.
- DodecahedronGeometry To create a 12 faces sphere. You can add details for a rounder sphere.
- OctahedronGeometry To create a 8 faces sphere. You can add details for a rounder sphere.
- TetrahedronGeometry To create a 4 faces sphere (it won't be much of a sphere if you don't increase details). You can add details for a rounder sphere.
- IcosahedronGeometry To create a sphere composed of triangles that have roughly the same size.
- SphereGeometry To create the most popular type of sphere where faces looks like quads (quads are just a combination of two triangles).
- ShapeGeometry To create a shape based on a path.
- TubeGeometry To create a tube following a path.
- ExtrudeGeometry To create an extrusion based on a path. You can add and control the bevel.
- LatheGeometry To create a vase or portion of a vase (more like a revolution).
- TextGeometry To create a 3D text. You'll have to provide the font in typeface json format.

If you need a particular geometry that is not supported by Three.js, you can create your own geometry in JavaScript, or you can make it in a 3D software, export it and import it into your project. 

---

The BoxGeometry has 6 parameters:

- **`width`**: The size on the **`x`** axis
- **`height`**: The size on the **`y`** axis
- **`depth`**: The size on the **`z`** axis
- **`widthSegments`**: How many subdivisions in the **`x`** axis
- **`heightSegments`**: How many subdivisions in the **`y`** axis
- **`depthSegments`**: How many subdivisions in the **`z`** axis

Subdivisions correspond to how much triangles should compose the face. By default it's **`1`**, meaning that there will only be 2 triangles per face. If you set the subdivision to **`2`**, you'll end up with 8 triangles per face:

```jsx
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
```

A good solution is to add **`wireframe: true`** to our material. The wireframe will show the lines that delimit each triangle:

```jsx
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```

!image.png

As you can see, there are 8 triangles by face.

SphereGeometry:

```jsx
const geometry = new THREE.SphereGeometry(1, 32, 32)
```

![](https://threejs-journey.com/assets/lessons/9/001.png)

The more subdivisions we add, the less we can distinguish the faces. But keep in mind that too many vertices and faces will affect performances.

---

# **Creating your own buffer geometry**

```jsx

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()
```

To add vertices to a BufferGeometry you must start with a Float32Array.

Float32Array are native JavaScript typed array. You can only store floats inside, and the length of that array is fixed.

To create a Float32Array, you can specify its length and then fill it later:

```jsx
const positionsArray = new Float32Array(9)

// First vertice
positionsArray[0] = 0
positionsArray[1] = 0
positionsArray[2] = 0

// Second vertice
positionsArray[3] = 0
positionsArray[4] = 1
positionsArray[5] = 0

// Third vertice
positionsArray[6] = 1
positionsArray[7] = 0
positionsArray[8] = 0
```

**Or** you can pass an array:

```jsx
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])
```

The array is a one-dimensional array where you specify the **`x`**, **`y`**, and **`z`** of the first vertex, followed by the **`x`**, **`y`**, and **`z`** of the second vertex, and so on.

```jsx
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
```

Then we can add this attribute to our BufferGeometry using the **`setAttribute(...)`** method. The first parameter is the name of this attribute and the second parameter is the value:

```jsx
geometry.setAttribute('position', positionsAttribute)
```

We chose **`'position'`** as the name because Three.js internal shaders will look for that value to position the vertices. We will see more about that in the shaders lessons.

All together:

```jsx
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```

!image.png

We can also create a bunch of random triangles:

```jsx
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```

![](https://threejs-journey.com/assets/lessons/9/003.png)

The only difficulty might be the **`count * 3 * 3`** part but it's quite simple to explain: We need **`50`** triangles. Each triangle is composed of **`3`** vertices and each vertex is composed of **`3`** values (**`x`**, **`y`**, and **`z`**).
