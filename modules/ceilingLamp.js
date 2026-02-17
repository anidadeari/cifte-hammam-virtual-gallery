import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadCeilingLampModel = (scene) => {
  const loader = new GLTFLoader();

  loader.load(
    "/models/ceiling_lamp.glb",
    (gltf) => {
      const lamp = gltf.scene;

      lamp.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false; // prevents weird disappearing
          if (child.material) child.material.needsUpdate = true;
        }
      });

      // ✅ 1) Scale first
      lamp.scale.setScalar(6.0);

      // ✅ 2) Center-fix after scaling
      lamp.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(lamp);
      const center = box.getCenter(new THREE.Vector3());
      lamp.position.sub(center);

      // ✅ 3) Place under ceiling (your ceiling ~ y=10)
      lamp.position.add(new THREE.Vector3(0, 9.0, 0));

      scene.add(lamp);
      
      

      // =========================================================
      // ✅ Lamp-owned light (this creates the "pool" directly under it)
      // =========================================================
      const lampLight = new THREE.SpotLight(0xffffff, 3.0);
      lampLight.castShadow = true;

      // Put the light slightly inside/under the lamp (LOCAL space)
      lampLight.position.set(0, -0.2, 0);

      // Target straight down (LOCAL space)
      const target = new THREE.Object3D();
      target.position.set(0, -6, 0);

      lamp.add(lampLight);
      lamp.add(target);
      lampLight.target = target;

      // Tune the cone
      lampLight.angle = Math.PI / 7;    // tighter cone (smaller circle)
      lampLight.penumbra = 0.5;
      lampLight.decay = 2;
      lampLight.distance = 30;

      // Shadow quality
      lampLight.shadow.mapSize.set(1024, 1024);
      lampLight.shadow.bias = -0.0002;

      // (Optional) If shadows look pixelated, try 2048:
      // lampLight.shadow.mapSize.set(2048, 2048);
    },
    undefined,
    (error) => console.error("Error loading ceiling lamp model:", error)
  );
};
