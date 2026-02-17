import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";

export const scene = new THREE.Scene();
let camera;
let controls;
let renderer;

export const setupScene = () => {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, 2, 15);

  renderer = new THREE.WebGLRenderer({
    antialias: true,           // ✅ më mirë për edges
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // ✅ tekstura/sharpness më mirë
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  document.body.appendChild(renderer.domElement);

  // ✅ Kritike për ngjyra të sakta (albedo/diffuse) dhe PBR
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // ✅ Drita/materiale më realiste me MeshStandardMaterial
  renderer.physicallyCorrectLights = false;


  // Shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(controls.getObject());

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  return { camera, controls, renderer };
};
