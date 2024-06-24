import gsap from "gsap";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const group = new THREE.Group();
group.position.y = 0;
group.scale.y = 1.2;
group.rotation.y = 1;

scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xf0f000 })
);

cube2.position.x = -1.5;

group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xf000f0 })
);

cube3.position.x = 1.5;

group.add(cube3);

scene.add(new THREE.AxesHelper());

/**
 * Sizes
 */
const sizes = {
  width: 1380,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// const clock = new THREE.Clock();

gsap.to(group.position, { duration: 3, delay: 1, x: 2 });
gsap.to(group.position, { duration: 3, delay: 4, x: 0 });

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  // // Update objects
  // group.rotation.y = elapsedTime * Math.PI;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
