import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png') 

/**
 * Particules
 */
// Geometry
const particuleGeometry = new THREE.SphereGeometry(1, 32, 32)
const geometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

// Material
const particulesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: 0x3ff32f,
  map: particleTexture,
  transparent: true,
  alphaMap: particleTexture,
  //alphaTest: 0.001,
  //depthTest: false,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
})
const particules = new THREE.Points(geometry, particulesMaterial)
scene.add(particules)


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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
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


    // Update particules
    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3

        const x = geometry.attributes.position.array[i3 + 0]
        const y = geometry.attributes.position.array[i3 + 1]
        const z = geometry.attributes.position.array[i3 + 2]

        geometry.attributes.position.array[i3 + 1] = y - 0.03

        if(y < -5)
        {
            geometry.attributes.position.array[i3 + 0] = (Math.random() - 0.5) * 10
            geometry.attributes.position.array[i3 + 1] = 5
            geometry.attributes.position.array[i3 + 2] = (Math.random() - 0.5) * 10
        }
    }
    geometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()