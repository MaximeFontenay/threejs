import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const colors = {
  green: '#83D198',
  blue: '#4594B6',
}

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.castShadow = true;
scene.add(ambientLight);


// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(0, 25, 12);
directionalLight.castShadow = true;
gui.add(directionalLight.position, "y").min(-10).max(50).step(0.001);
gui.add(directionalLight.position, "z").min(-10).max(10).step(0.001);
gui.add(ambientLight, "intensity").min(0).max(10).step(0.001);

// Directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0
);
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.9)

// Directional light helper
const hemisphereLightHelper = new THREE.HemisphereLight(
  hemisphereLight,
);
scene.add(directionalLight,hemisphereLight);
//scene.add(directionalLightHelper,hemisphereLightHelper);


scene.background = new THREE.Color(0xBEA57D);


/**
 * Objects
 */
const screen = new THREE.Group();
scene.add(screen);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/matcaps/2.png");
texture.colorSpace = THREE.SRGBColorSpace;

const blueMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(colors.blue),
});
const screenBack = new THREE.Mesh(
  new THREE.BoxGeometry(35, 20, 2),  
  blueMaterial
);
screenBack.receiveShadow = true;

const screenFront = new THREE.Mesh(
  new THREE.BoxGeometry(32, 17, 0.01),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('black'),
  })
);
screenFront.position.z = screenBack.position.z + 1;
screenFront.receiveShadow = true;

const screenFeet = new THREE.Mesh(
  new THREE.CylinderGeometry( 1, 2, 5, 20 ),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.blue),
  })
);
screenFeet.position.y = -12.5;

screen.add(screenBack, screenFront, screenFeet);


const keyboard = new THREE.Group();
scene.add(keyboard);

const keysRow1 = new THREE.Group();
const keysRow2 = new THREE.Group();
keyboard.add(keysRow1, keysRow2);

const keyMaterial = new THREE.MeshMatcapMaterial({
  color: new THREE.Color(colors.green),
  matcap: texture,
});
const keyGeometry = new THREE.BoxGeometry(2, 2, 0.5);
const key = new THREE.Mesh(keyGeometry, keyMaterial);
key.receiveShadow = true;

for (let i = 0; i < 10; i++) {
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  key.position.x = i * 2.5;
  keysRow1.add(key);
}
keysRow1.position.x = -11.25;

for (let i = 0; i < 10; i++) {
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  key.position.x = i * 2.5;
  keysRow2.add(key);
}
keysRow2.position.x = -11.25;
keysRow2.position.y = -2.5;


const keyboardBox = new THREE.Mesh(
  new THREE.BoxGeometry(8, 28, 1.5),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.green),
  })
);

keyboardBox.position.z = -0.75;
keyboardBox.position.y = -1.25;
keyboardBox.rotation.z = -Math.PI * 0.5;
keyboard.position.z = screenBack.position.z + 5;
keyboard.position.y = screenBack.position.y - 12;
keyboard.rotation.x = -Math.PI * 0.45;

keyboard.add(keyboardBox);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight * 70 / 100,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 40;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
