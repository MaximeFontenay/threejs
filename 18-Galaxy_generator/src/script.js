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

/**
 * Galaxy
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 19,
  branches: 6,
  spin: 0.5,
  randomness: 1,
  randomnessPower: 8,
  colorInside: '#dbf425',
  colorOutside: '#fa08de',
  spinSpeed: 0.3,
}

let geometry = null
let particulesMaterial = null
let particules = null

const generateGalaxy = () => {

  if(particules !== null) {
    geometry.dispose()
    particulesMaterial.dispose()
    scene.remove(particules)
  }

  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.colorInside)
  const colorOutside = new THREE.Color(parameters.colorOutside)


  for (let i = 0; i < parameters.count ; i++) {
    const i3 = i * 3
    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const brancheAngles = (i % parameters.branches) / parameters.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

    positions[i3 + 0] = Math.cos(brancheAngles + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(brancheAngles + spinAngle) * radius + randomZ


    const colorMixed = colorInside.clone()
    colorMixed.lerp(colorOutside, radius / parameters.radius)
    colors[i3 + 0] = colorMixed.r
    colors[i3 + 1] = colorMixed.g
    colors[i3 + 2] = colorMixed.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  particulesMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true 
  })

  particules = new THREE.Points(geometry, particulesMaterial)
  scene.add(particules)
}

generateGalaxy()

gui.add(parameters, 'count').min(0).max(100000).step(100).name('Count').onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.01).max(0.1).step(0.01).name('Size').onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).name('Radius').onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(100).step(1).name('Branches').onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).name('Spin').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).name('Randomness').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).name('randomnessPower').onFinishChange(generateGalaxy)
gui.add(parameters, 'spinSpeed').min(0).max(10).step(0.01).name('Spin Speed').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'colorInside').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'colorOutside').onFinishChange(generateGalaxy)



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
camera.position.z = 20
camera.position.y = 6
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
    particules.rotation.y = elapsedTime * parameters.spinSpeed

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()