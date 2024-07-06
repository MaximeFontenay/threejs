import GUI from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/addons/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const sky = new Sky();
sky.scale.setScalar(100)
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
scene.add(sky);


const textureLoader = new THREE.TextureLoader();
const floorAlphaTexture = textureLoader.load("/floor/alpha.jpg");
const floorColorTexture = textureLoader.load("/floor/coast_sand_rocks_02_diff_1k.jpg");
const floorARMTexture = textureLoader.load("/floor/coast_sand_rocks_02_arm_1k.jpg");
const floorNormalTexture = textureLoader.load("/floor/coast_sand_rocks_02_nor_gl_1k.jpg");
const floorDisplacementTexture = textureLoader.load("/floor/coast_sand_rocks_02_disp_1k.jpg");

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8,8)
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8,8)
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8,8)
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8,8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;


const wallColorTexture = textureLoader.load("/wall/castle_brick_broken_06_diff_1k.jpg");
const wallARMTexture = textureLoader.load("/wall/castle_brick_broken_06_arm_1k.jpg");
const wallNormalTexture = textureLoader.load("/wall/castle_brick_broken_06_nor_gl_1k.jpg");
wallColorTexture.colorSpace = THREE.SRGBColorSpace;


const roofColorTexture = textureLoader.load("/roof/roof_slates_02_diff_1k.jpg");
const roofARMTexture = textureLoader.load("/roof/roof_slates_02_arm_1k.jpg");
const roofNormalTexture = textureLoader.load("/roof/roof_slates_02_nor_gl_1k.jpg");
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3,1)
roofARMTexture.repeat.set(3,1)
roofNormalTexture.repeat.set(3,1)

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrap = THREE.RepeatWrapping;


const bushColorTexture = textureLoader.load("/bush/leaves_forest_ground_diff_1k.jpg");
const bushARMTexture = textureLoader.load("/bush/leaves_forest_ground_arm_1k.jpg");
const bushNormalTexture = textureLoader.load("/bush/leaves_forest_ground_nor_gl_1k.jpg");
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2,1)
bushARMTexture.repeat.set(2,1)
bushNormalTexture.repeat.set(2,1)

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrap = THREE.RepeatWrapping;


const graveColorTexture = textureLoader.load("/grave/plastered_stone_wall_diff_1k.jpg");
const graveARMTexture = textureLoader.load("/grave/plastered_stone_wall_arm_1k.jpg");
const graveNormalTexture = textureLoader.load("/grave/plastered_stone_wall_nor_gl_1k.jpg");
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(2,1)
graveARMTexture.repeat.set(2,1)
graveNormalTexture.repeat.set(2,1)

graveColorTexture.wrapS = THREE.RepeatWrapping;
graveARMTexture.wrapS = THREE.RepeatWrapping;
graveNormalTexture.wrap = THREE.RepeatWrapping;


const doorColorTexture = textureLoader.load("/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/door/roughness.jpg");
const doorNormalTexture = textureLoader.load("/door/normal.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

doorColorTexture.repeat.set(2,1)
doorNormalTexture.repeat.set(2,1)

doorColorTexture.wrapS = THREE.RepeatWrapping;


scene.fog = new THREE.Fog("#04343F", 5, 15);

/**
 * House
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide, 
    alphaMap: floorAlphaTexture, 
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,    
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.35,
    displacementBias: -0.25,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y = 1.25;
house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.25, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.6;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    displacementScale: 0.15,
    displacementBias: - 0.04,
  })
);
door.position.z = 2.01;
door.position.y = 1;
house.add(door);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

scene.add(bush1, bush2, bush3, bush4);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, Math.random() * 0.4, z);
  grave.rotation.set(
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4
  );

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.7);
doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
scene.add(doorLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 10;
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
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
