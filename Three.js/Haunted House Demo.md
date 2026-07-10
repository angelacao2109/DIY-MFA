# Haunted House Demo 

<img width="2720" height="1680" alt="house_vertical_stacking_math" src="https://github.com/user-attachments/assets/4c5a6f5e-6632-4c5a-954e-31d9d6f85969" />

**`position`** — *where* is it? (location in space)

**`rotation`** — *which way is it turned?* (orientation)

**`scale`** — *how big* is it? (size)

## 1. Imports and setup

```jsx
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
```

`Timer` is the newer replacement for `THREE.Clock`. Functionally similar for your purposes (it tracks elapsed time), but it handles tab-switching and delta more gracefully. Note that right now you compute `elapsedTime` in the loop but never use it — that's fine, it's scaffolding for the animation lessons ahead (ghosts orbiting).

The four pillars are all here: `scene`, and later `camera`, `renderer`, plus the `canvas` you're rendering into.

## 2. The floor

```jsx
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ alphaMap: floorAlphaTexture, transparent: true })
)
floor.rotation.x = -Math.PI * 0.5
```

 A `PlaneGeometry` is born lying in the **XY plane**, standing upright like a picture on a wall.

Rotate about the X axis. Using the right-hand rule (thumb along +X), a **positive** rotation sweeps +Z toward −Y — that would make the plane face *down*. So you need the **negative** quarter-turn: `-Math.PI * 0.5` sweeps the normal from +Z to +Y. That's why it's negative, not positive. If it were positive, the floor would technically be there but its lit face would point at the ground and you'd see the dark backside.

!rotation_x_floor_plane_quarter_turn.png

Now the "quarter turn" part is just the *amount*:

- A full turn = 2π
- Half turn = π
- **Quarter turn = π / 2**, which is `Math.PI * 0.5`

`alphaMap` + `transparent: true` lets the black/white texture carve the square plane into a soft circular patch (white = opaque, black = invisible). Transparency does nothing unless `transparent` is `true` — that pairing is mandatory.

## 3. The house group

```jsx
const house = new THREE.Group()
```

Everything house-related gets parented here so you could move/rotate the whole structure as one unit later. Since `house` sits at the origin with no transform, **local coordinates equal world coordinates** for its children — which is why the bush positions "just work" without compensating for a parent offset.

## 4. Walls

```jsx
new THREE.BoxGeometry(4, 2.5, 4)   // width, height, depth
walls.position.y += 1.25
```

A `BoxGeometry` is **centered on its own origin**. A height of 2.5 means it spans from y = −1.25 to y = +1.25. Left alone, half the box sinks below the floor.

To rest it *on* the floor, lift it by half its height: 2.5 / 2 = **1.25**. Now it spans 0 → 2.5. 

## 5. Roof

```jsx
new THREE.ConeGeometry(3.5, 1.5, 4)  // radius, height, radialSegments
roof.position.y += 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
```

Two separate pieces of reasoning stacked together:

 Walls top out at y = 2.5. The cone's base is 0.75 below the cone's center. (1.5/2=0.75) So center = 2.5 + 0.75 = **3.25**. That's your `2.5 + 0.75`.

**The `radialSegments = 4` trick.** A cone with only 4 radial segments isn't a cone — it's a **square-based pyramid**. But a 4-sided cone comes out oriented as a diamond relative to the walls (its base corners point along the axes). The `Math.PI * 0.25` (45°) rotation about Y turns the diamond so its flat faces align with the flat walls below. Without it, the roof edges wouldn't line up with the wall edges.

That vertical, upright orientation is perfect. All you want to do is **turn it in place** so its four flat faces line up with the four flat walls.

"Turn in place while staying upright" = spinning on the vertical axis. The vertical axis is **Y**

## 6. Door

```jsx
new THREE.PlaneGeometry(2.2, 2.2)
door.position.y = 1
door.position.z = 2 + 0.01
```

The walls are 4 deep, centered, so the **front face lives at z = +2**. A plane defaults to facing +Z — perfect, no rotation needed, it faces outward as-is.

The `+ 0.01` is the important detail: place the door at *exactly* z = 2 and it occupies the same plane as the wall surface. The GPU can't decide which is in front, and you get **z-fighting** — that shimmering, flickering interleave. Nudging it 0.01 forward resolves the tie. This is a real technique, not a hack.

## 7. Bushes

```jsx
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial()
```

**Geometry and material are created once and shared** across all four bushes. This is the efficiency pattern — reusing one geometry/material is cheaper than four copies. Each bush then differentiates itself purely through transform:

```jsx
bush1.scale.set(0.5, 0.5, 0.5)      // explicit per-axis
bush2.scale.setScalar(0.25)          // uniform shorthand
```

`setScalar(n)` is just sugar for `set(n, n, n)` — same result, less typing, signals "uniform scale." The positions (all around z ≈ 2.1–2.6, x near the door) cluster them at the front entrance. The y values are small (0.05–0.2) so the scaled spheres half-bury into the ground rather than floating.

## 8. Graves — the loop

```jsx
for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 7
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    ...
}
```

This is the most conceptually loaded block, so let's be precise.

**Polar-to-Cartesian conversion.** You're placing graves on a ring around the house, and the natural coordinate system for "around" is polar: pick an **angle** and a **distance**, then convert to (x, z).

- `angle = Math.random() * Math.PI * 2` → a uniform random direction over the full circle (0 to 2π).
- `radius = 3 + Math.random() * 7` → a distance between **3 and 10**. This creates an **annulus** (a ring with a hole), not a full disc.

`Math.random() * 7` gives you a number from **0 up to 7**. Then `3 +` shifts that whole range up, so you land between **3 and 10**.

That's the *distance from the center* (from the house) that a grave gets placed. So:

- The **3** is a floor — no grave is ever closer than 3 units to the center. That's deliberate: the house sits at the center, and its footprint reaches out about 2.83 units to its far corners. If you let radius go all the way down to 0, graves would spawn *inside the house and through the roof*. The 3 keeps them clear of the building.
- The **7** is the width of the band they're allowed to scatter across. 3 + 7 = 10, so graves land somewhere in the ring between distance 3 and distance 10.

`angle` — **which direction** from the center (like a compass heading)

`radius` — **how far** in that direction

 `x = radius * cos(angle)`, `z = radius * sin(angle)` is the textbook form. This code uses `sin` for x and `cos` for z — **swapped from convention**. For a *full* 360° sweep it makes no visual difference (it just relabels which axis the angle measures from), so it's harmless here. But flag it mentally: the moment you ever restrict the angle range or want a *specific* starting direction, the sin/cos assignment starts to matter and the swap will bite you.

**The randomized transforms:**

```jsx
grave.position.y = Math.random() * 0.4          // 0 to 0.4: sink varies
grave.rotation.x = (Math.random() - 0.5) * 0.4  // small tilt
```

Grave height is 0.8, so a y between 0 and 0.4 sinks each stone by a varying amount — no two sit at the same depth, which kills the "cloned objects" look. The rotation pattern `(Math.random() - 0.5) * 0.4` is worth memorizing: `Math.random()` gives [0, 1), subtracting 0.5 **recenters it to [−0.5, 0.5)**, and ×0.4 scales it to roughly [−0.2, 0.2) radians (~±11°). That's the standard idiom for "small random jitter in both directions." A tiny tilt on all three axes reads as weathered, uneven ground.

Graves are parented to their **own** `graves` group, separate from `house` — sensible, since they're scattered across the whole yard, not part of the building.

## 9. Lights

```jsx
new THREE.AmbientLight('#ffffff', 0.5)
new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
```

`MeshStandardMaterial` is a **physically-based material — it renders black without light.** That's why lights are non-optional here, unlike `MeshBasicMaterial`.

- **Ambient** light hits everything uniformly from all directions — it's your flat "fill" so shadowed sides aren't pure black. No position, because it has no direction.
- **Directional** light is parallel rays from a direction (think sun). Only its *direction* matters, which is defined by its `position` relative to the target (origin by default). So `(3, 2, -8)` means light streams in from up-and-behind, toward the origin. The magnitude of that vector is irrelevant — only the direction of the line from position to target counts.

## 10. Sizes, camera, renderer, loop

The bottom third is Journey's standard boilerplate, so briefly:

- **`sizes` + resize listener** keeps the render fitted to the window. Inside the handler you update the camera's `aspect` and — critically — call `camera.updateProjectionMatrix()`, because the projection matrix is only recomputed when you tell it to. Skip that call and resizing stretches everything.
- **Camera:** `PerspectiveCamera(75, aspect, 0.1, 100)` — 75° FOV, near plane 0.1, far plane 100. Anything closer than 0.1 or farther than 100 gets clipped. Positioned at (4, 2, 5) to look down slightly onto the scene.
- **`setPixelRatio(Math.min(devicePixelRatio, 2))`** caps rendering resolution at 2×. Retina/4K screens report ratios of 3+, and rendering that many pixels tanks performance for no visible gain — the min() clamp is the standard guard.
- **The tick loop:** `timer.update()` advances time, `controls.update()` applies OrbitControls damping (required every frame *because* you enabled `enableDamping`), then render, then `requestAnimationFrame(tick)` schedules the next frame synced to the display refresh.

---

# Textures

A texture is just an image file. A *map* is that image plugged into a specific slot on the material, where each slot tells the renderer a different thing about the surface.

```jsx
map: floorColorTexture
floorColorTexture.colorSpace = THREE.SRGBColorSpace
```

This is the plain photograph of the surface — the actual *colors* of the sand, brick, slate. It's the only map that represents color, which is exactly why it's the only one that gets `colorSpace = SRGBColorSpace`. Color images are stored in sRGB (tuned for human eyes), and you have to tell Three.js that so it decodes them correctly.

**`normalMap` (fake surface bumps)**

```jsx

normalMap: floorNormalTexture
```

Those purple-blue images encode, per pixel, *which direction the surface is facing*. The renderer uses that to bend how light bounces — so a perfectly flat plane gets crevices, brick mortar lines, slate ridges, all faked. **No geometry changes at all.**

**`displacementMap` (real surface bumps)**

```jsx
displacementMap: floorDisplacementTexture,
displacementScale:0.3,
displacementBias:-0.2
```

 it actually **moves the vertices** of the geometry up and down based on the brightness of the image (white = pushed up, black = stays). That's why you changed the floor to `PlaneGeometry(20, 20, 100, 100)` — those extra `100, 100` are **subdivisions**. Displacement can only move vertices that exist, so a 1×1 plane has nothing to push; you need a dense grid of vertices for the bumps to have somewhere to go.

- `displacementScale: 0.3` — how *far* the vertices move (the amplitude of the bumps).
- `displacementBias: -0.2` — shifts the whole thing down, because displacement pushes everything upward off the surface and the bias pulls it back to sit at the right height.

Normal map vs displacement map is the key pairing to understand: **normal fakes the bumps for cheap (lighting only), displacement really deforms the mesh (expensive, needs vertices).** Often you use both — displacement for the big shape, normal for the fine detail.

**The ARM texture — three maps in one file**

```jsx
aoMap: floorARMTexture,
roughnessMap: floorARMTexture,
metalnessMap: floorARMTexture,
```

This is a clever packing trick. **ARM** stands for **A**mbient occlusion, **R**oughness, **M**etalness — three separate grayscale maps stuffed into the three color channels of a single image (R, G, B). One file, three jobs, less loading. That's why the same `floorARMTexture` is plugged into three different slots:

- **`aoMap` (ambient occlusion)** — pre-baked shadows in the nooks and crannies. Darkens the crevices where light wouldn't naturally reach, adding depth for free.
- **`roughnessMap`** — controls shininess *per pixel*. Dark = smooth/glossy, light = rough/matte. This lets one surface be worn-shiny in spots and dry-matte in others.
- **`metalnessMap`** — marks which pixels behave like metal vs non-metal. For sand and brick this is mostly "not metal," but it's part of the physically-based system.

### Repeat and wrapping

```jsx
floorColorTexture.repeat.set(8,8)
floorColorTexture.wrapS=THREE.RepeatWrapping
floorColorTexture.wrapT=THREE.RepeatWrapping
```

Your floor is 20×20 units — huge. One copy of the texture stretched across it would look blurry and smeared. `repeat.set(8, 8)` tiles it 8 times in each direction so the detail stays crisp. But `repeat` alone isn't enough: by default a texture clamps at its edge, so you *must* also set `wrapS` and `wrapT` to `RepeatWrapping` to tell it "start over and tile" instead of "stretch the last pixel." S and T are just the texture-world names for the horizontal and vertical axes (what X and Y are for geometry). The roof uses `repeat.set(3, 1)` — 3 across, 1 down — because slate rows wrap around the cone horizontally but shouldn't tile vertically.

---

### The four lights

You've gone from two lights to four, and the colors are now doing storytelling work:

- **`AmbientLight('#86cdff', 0.275)`** — dim blue fill. The blue tint is moonlight; the low 0.275 intensity keeps the scene dark and nocturnal.
- **`DirectionalLight('#86cdff', 1)`** — the moon itself, same cold blue, parallel rays from up and behind.
- **`PointLight('#ff7d46', 5)`** at the door — warm orange, positioned just in front of the door at `(0, 2.2, 2.5)`. A `PointLight` differs from directional: it radiates *outward from a point* in all directions and **falls off with distance**, like a bare bulb. That's why it needs an actual position in space, not just a direction. The warm orange against the cold blue is the whole mood — a cozy porch light in a cold graveyard.
- **Three ghost `PointLight`s** in purple, pink, and red — these are lights, not meshes. There's no ghost *object*; the "ghosts" are just colored glows drifting around, lighting up whatever they pass. Clever and cheap.

### Shadows — the most machinery-heavy part

Shadows in Three.js are **off by default and expensive**

**1. Enable the system globally:**

```jsx
renderer.shadowMap.enabled=true
renderer.shadowMap.type=THREE.PCFShadowMap// the softening algorithm
```

**2. Opt each light and mesh in, individually.** This is the tedious part, and the logic is physical:

```jsx
directionalLight.castShadow=true// this light can throw 
shadowswalls.castShadow=true// walls block light (throw a shadow)
walls.receiveShadow=true// walls can have shadows land on them
floor.receiveShadow=true// floor catches shadows but casts none
```

Every object gets *two independent switches*: can it **cast** (block light), and can it **receive** (have shadow land on it)? The floor only receives — it's the ground, nothing's behind it to shadow. The walls do both. You loop over all 30 graves to set both on each, since a `Group` doesn't pass the setting to its children automatically.

**3. Configure each shadow's hidden camera.** This is the conceptually surprising part:

```jsx
directionalLight.shadow.mapSize.width=256
directionalLight.shadow.camera.top=8
directionalLight.shadow.camera.far=20
```

- `mapSize` (256×256) is the **resolution of the shadow**. Higher = crisper shadow edges but more expensive. 256 is low — deliberately, to keep it fast; you'll see blocky shadow edges as the tradeoff.
- The directional light's `camera.top/right/bottom/left = ±8` define a **box** the shadow camera covers. Directional lights use an orthographic (boxy, non-perspective) camera, so you size the box to just contain your scene. Too big and you waste resolution; too small and shadows get clipped at the edges.
- `near` and `far` are the same clipping planes as your main camera — the shadow camera ignores anything closer than `near` or farther than `far`.

The three ghost lights get the same treatment but simpler (`camera.far = 10`), because point lights use a different camera type that needs less manual boxing.

### The ghost math — this is the sin/cos circle again

Here's the payoff for all that trig work. Each ghost orbits the house, and the position code is exactly the circle formula you learned, now *animated* by feeding it time:

```jsx
const ghost1Angle= elapsedTime*0.5
ghost1.position.x=Math.cos(ghost1Angle)*4
ghost1.position.z=Math.sin(ghost1Angle)*4
```

 `x = cos(angle) × radius`, `z = sin(angle) × radius` — the same conversion from "angle + distance" to "x, z" that placed your graves. The only new idea: **the angle is now `elapsedTime`**, so it grows every frame, which walks the ghost around the circle continuously. Radius 4 sets the orbit size. Multiplying elapsedTime by `0.5` sets the speed (bigger = faster).

The differences between the three ghosts are all knobs on this one formula:

- Ghost 2 uses `elapsedTime` → **negative angle spins it the opposite direction**, and radius 5 orbits wider.
- Ghost 3 uses `elapsedTime * 0.23` → much slower, radius 6 → widest and laziest.

Then the genuinely clever line — the vertical bob:

```jsx
ghost1.position.y=Math.sin(a)*Math.sin(a*2.34)*Math.sin(a*3.45)
```

Three sine waves *multiplied together*, each at a different frequency (1×, 2.34×, 3.45×). A single sine would give a smooth, predictable up-down. Multiplying three mismatched sines produces an **irregular, never-quite-repeating wobble** — the ghost floats up and down but unpredictably, which reads as spooky and alive rather than mechanical. The odd decimals (2.34, 3.45) are chosen precisely *because* they don't divide evenly, so the pattern takes a very long time to repeat.

### The sky and `material.uniforms` — your specific question

This is the most important concept here, because it's your first real contact with **shaders**, which is exactly where you're headed in August with GLSL.

```jsx
const sky=newSky()sky.material.uniforms['turbidity'].value=10sky.material.uniforms['sunPosition'].value.set(0.3,-0.038,-0.95)
```

`Sky` isn't a normal textured mesh — it's a giant sphere painted by a **shader**, a small program that runs on the GPU and calculates the color of every single pixel of sky based on physics (how sunlight scatters through atmosphere). That's why the sunset colors look real: it's simulating atmospheric scattering, not displaying a photo.

Now the key concept: **a uniform is a value you pass *from* JavaScript *into* the shader program.** The word "uniform" means it's the same value for every pixel the shader processes that frame — uniform across the whole draw. The shader can't see your JS variables; uniforms are the bridge. So:

- `turbidity` (10) — how hazy/thick the atmosphere is.
- `rayleigh` (3) — controls the blue-scattering that makes skies blue and sunsets red.
- `mieCoefficient` / `mieDirectionalG` — the glow around the sun.
- `sunPosition` — where the sun sits. Setting y to `0.038` (just below the horizon) is what gives you that low, moody twilight. That one's a `Vector3`, so you use `.value.set(x, y, z)` instead of `.value =`.

The pattern `uniforms['name'].value` is always: reach into the uniform by name, then set its `.value`. Every uniform is an object with a `.value` property — that's the slot the shader actually reads. **File this pattern away** — when you write your own GLSL shaders, passing uniforms in from JS is exactly how you'll feed them time, mouse position, colors, everything. The `Sky` is your first example of the thing you're about to learn to build from scratch.

### Fog

```jsx
scene.fog=newTHREE.FogExp2('#04343f',0.1)
```

Fog fades objects toward a color as they get farther from the camera. `FogExp2` is the **exponential** variety — density grows exponentially with distance, which looks more natural than linear fog. The color `#04343f` is a dark teal that matches the twilight, and `0.1` is the density (higher = thicker, closer fog). This does double duty: it sets the mood *and* it hides the far edges of your ground plane and the "end of the world," so the scene feels boundless. Fog color should always roughly match your sky/background or objects appear to fade into the wrong color.

### Camera

The camera is unchanged from your earlier versions: `PerspectiveCamera(75, aspect, 0.1, 100)` — 75° field of view, positioned at (4, 2, 5). The one thing worth connecting now: the camera's `far` value (100) and each shadow camera's `far` are the same *concept* applied in different places. Your main camera clips the world at 100 units; each light's shadow camera clips its shadow calculation at its own `far` (20 for the moon, 10 for ghosts). Same idea — "stop calculating past here" — just one is for what you see and the others are for where shadows get computed.
