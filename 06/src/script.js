import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const geometry = new THREE.BufferGeometry();

const count = 5;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0x83f265,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

const renderCanvas = () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

renderCanvas();

window.addEventListener("resize", renderCanvas);
