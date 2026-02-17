import * as THREE from "three";
import { GUI } from "lil-gui";

export const setupLighting = (scene) => {
  const gui = import.meta.env.DEV ? new GUI() : null;

  // ✅ Ambient (bazë)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.30);
  scene.add(ambientLight);

  if (gui) {
    const ambientFolder = gui.addFolder("Ambient Light");
    ambientFolder.add(ambientLight, "intensity", 0, 1.5, 0.01);
  }

  function createSpotlight(
    x,
    y,
    z,
    intensity,
    targetPosition,
    castShadow = false,
    shadowSize = 2048
  ) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);

    // ✅ Museum spotlight defaults
    spotlight.angle = 0.45;
    spotlight.penumbra = 0.6;
    spotlight.decay = 2;
    spotlight.distance = 45;

    spotlight.castShadow = castShadow;

    if (castShadow) {
      spotlight.shadow.mapSize.set(shadowSize, shadowSize);
      spotlight.shadow.bias = -0.00002;
      spotlight.shadow.normalBias = 0.01;
    }

    scene.add(spotlight);
    scene.add(spotlight.target);

    if (gui) {
      const folder = gui.addFolder(`Spotlight (${x}, ${y}, ${z})`);
      folder.add(spotlight, "intensity", 0, 8, 0.01);
      folder.add(spotlight, "angle", 0.05, Math.PI / 2, 0.001).name("Angle");
      folder.add(spotlight, "penumbra", 0, 1, 0.01).name("Penumbra");
      folder.add(spotlight, "decay", 0, 2, 0.01).name("Decay");
      folder.add(spotlight, "distance", 0, 120, 0.5).name("Distance");

      folder.add(spotlight.position, "x", -50, 50, 0.1);
      folder.add(spotlight.position, "y", 0, 30, 0.1);
      folder.add(spotlight.position, "z", -50, 50, 0.1);

      folder.add(spotlight.target.position, "x", -50, 50, 0.1);
      folder.add(spotlight.target.position, "y", -10, 20, 0.1);
      folder.add(spotlight.target.position, "z", -50, 50, 0.1);
    }

    return spotlight;
  }

  // ✅ Walls: shadows vetëm ku duhen (perf + quality)
  createSpotlight(0, 8.5, -12, 3.0, new THREE.Vector3(0, 2, -20), true, 2048);
  createSpotlight(0, 8.5, 12, 3.0, new THREE.Vector3(0, 2, 20), true, 2048);

  createSpotlight(-12, 8.5, 0, 3.0, new THREE.Vector3(-20, 2, 0), false);
  createSpotlight(12, 8.5, 0, 3.0, new THREE.Vector3(20, 2, 0), false);

  // ✅ Statue main spotlight
  const statueSpotlight = createSpotlight(
    0,
    11,
    0,
    3.5,
    new THREE.Vector3(0, 1.5, 0),
    true,
    2048
  );

  statueSpotlight.angle = 0.35;
  statueSpotlight.penumbra = 0.4;
  statueSpotlight.distance = 25;

  // ✅ Rim light (i lehtë) – e bën statujën “cinematic”
  const rimLight = new THREE.SpotLight(0xffffff, 0.9);
  rimLight.position.set(0, 9, -6);
  rimLight.target.position.set(0, 1.6, 0);
  rimLight.angle = 0.55;
  rimLight.penumbra = 0.8;
  rimLight.decay = 2;
  rimLight.distance = 35;
  rimLight.castShadow = false;
  scene.add(rimLight);
  scene.add(rimLight.target);

  if (gui) {
    const rimFolder = gui.addFolder("Rim Light (Statue)");
    rimFolder.add(rimLight, "intensity", 0, 3, 0.01);
    rimFolder.add(rimLight.position, "x", -20, 20, 0.1);
    rimFolder.add(rimLight.position, "y", 0, 20, 0.1);
    rimFolder.add(rimLight.position, "z", -20, 20, 0.1);
  }

  return { ambientLight };
};
