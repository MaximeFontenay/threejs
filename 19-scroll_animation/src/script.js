import GUI from 'lil-gui'
import * as THREE from 'three'


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
  materialColor: '#e05252'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  particulesMaterial.color.set(parameters.materialColor)
})

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Torus, TorusKnot, Cone
const objectsDistance = 4

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture
})
const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const torusKnotMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)
const coneMesh = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)

torusMesh.position.y = - objectsDistance * 0
torusKnotMesh.position.y = - objectsDistance * 1
coneMesh.position.y = - objectsDistance * 2

torusMesh.position.x = 2
torusKnotMesh.position.x = -2
coneMesh.position.x = 2

scene.add(torusMesh, torusKnotMesh, coneMesh)

const sectionMeshes = [torusMesh, torusKnotMesh, coneMesh]


// Particules 
const particulesCount = 500
const positions = new Float32Array(particulesCount * 3)

for(let i = 0; i < particulesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particulesGeometry = new THREE.BufferGeometry()
particulesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particulesMaterial = new THREE.PointsMaterial({ 
  color: parameters.materialColor, 
  size: 0.02,
  sizeAttenuation: true,
})

const particulesMesh = new THREE.Points(particulesGeometry, particulesMaterial)
scene.add(particulesMesh)


// Light 
const ambientLight = new THREE.AmbientLight('#b1Da22', .8)
const directionnalLight = new THREE.DirectionalLight('#fff', 1)
directionnalLight.position.set(1, 1, 0)

scene.add(directionnalLight, ambientLight) 



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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


let scrollY = window.scrollY

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime    


    for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * .3
      mesh.rotation.y = elapsedTime * .5
    }

    camera.position.y = - scrollY / sizes.height * objectsDistance 

    const parralaxX = cursor.x * 0.5
    const parralaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parralaxX - cameraGroup.position.x) * 3 * deltaTime
    cameraGroup.position.y += (parralaxY - cameraGroup.position.y) * 3 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()