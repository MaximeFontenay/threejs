import gsap from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new GUI({
  width: 300,
});
gui.close();

const debugObject = {};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

debugObject.color = "#4f82e8";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("X position");
gui.add(mesh.material, "visible").name("Visibility");
gui.add(mesh.material, "wireframe").name("Wireframe");
gui
  .addColor(debugObject, "color")
  .name("Color")
  .onChange((value) => {
    material.color.set(value);
  });

debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};
gui.add(debugObject, "spin");

debugObject.subdivision = 2;
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

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
