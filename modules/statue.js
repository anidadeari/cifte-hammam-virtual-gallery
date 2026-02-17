import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadStatueModel = (scene) => {
  const loader = new GLTFLoader();

  // ✅ Vite-safe path (works in dev + when hosted under /3D-art-gallery/)
  const RAW_BASE = import.meta.env.BASE_URL;
  const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";
  const STATUE_URL = `${BASE}models/statue.glb`;

  // ✅ MUST match your floor.position.y
  const FLOOR_Y = -3.2;

  // ✅ podium settings
  const PODIUM_H = 0.45;
  const PODIUM_R = 1.6;

  // ✅ statue size target
  const TARGET_HEIGHT = 6.0;

  // ✅ we return this immediately; it will be filled after GLB loads
  const out = { exhibit: null, statue: null };

  loader.load(
    STATUE_URL,
    (gltf) => {
      // ---------------------------
      // ✅ HIERARCHY (parent)
      // ---------------------------
      const exhibit = new THREE.Group();
      exhibit.name = "ExhibitGroup";

      // Podium (child)
      const podium = new THREE.Mesh(
        new THREE.CylinderGeometry(PODIUM_R, PODIUM_R, PODIUM_H, 64),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.85,
          metalness: 0.0,
        })
      );
      podium.name = "Podium";
      podium.position.set(0, FLOOR_Y + PODIUM_H / 2, 0);
      podium.castShadow = true;
      podium.receiveShadow = true;
      exhibit.add(podium);

      // Statue (child)
      const statue = gltf.scene;
      statue.name = "Statue";

      // ✅ Marble look (safe even if textures are missing)
      const marbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xf3f3f3,
        roughness: 0.55,
        metalness: 0.0,
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
      });

      // ✅ shadows + force statue material (prevents flat silhouette)
      statue.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false;

          child.material = marbleMat.clone();
          child.material.needsUpdate = true;
        }
      });

      // ---------------------------
      // ✅ Normalize: scale + center + place on podium top
      // ---------------------------
      statue.updateMatrixWorld(true);

      let box = new THREE.Box3().setFromObject(statue);
      const size = box.getSize(new THREE.Vector3());

      const scale = TARGET_HEIGHT / (size.y || 1);
      statue.scale.setScalar(scale);

      statue.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(statue);

      // Center it
      const center = box.getCenter(new THREE.Vector3());
      statue.position.sub(center);

      // Put it on top of podium
      statue.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(statue);
      const minY = box.min.y;

      const desiredMinY = FLOOR_Y + PODIUM_H; // podium top
      statue.position.y += desiredMinY - minY;

      // Final position in room center
      statue.position.x = 0;
      statue.position.z = 0;

      exhibit.add(statue);

      // ---------------------------
      // ✅ Dedicated statue lights (children of ExhibitGroup)
      // ---------------------------
      const key = new THREE.SpotLight(0xffffff, 2.4);
      key.name = "StatueKeyLight";
      key.position.set(0, 9.5, 7);
      key.angle = 0.6;
      key.penumbra = 0.7;
      key.decay = 2;
      key.distance = 40;
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);

      const keyTarget = new THREE.Object3D();
      keyTarget.name = "StatueKeyTarget";
      keyTarget.position.set(0, FLOOR_Y + PODIUM_H + 1.2, 0);
      key.target = keyTarget;

      exhibit.add(key);
      exhibit.add(keyTarget);

      const fill = new THREE.PointLight(0xffffff, 0.6, 25);
      fill.name = "StatueFillLight";
      fill.position.set(-4, 6.5, 3);
      exhibit.add(fill);

      // Add hierarchy to scene
      scene.add(exhibit);

      // ✅ export references for animation
      out.exhibit = exhibit;
      out.statue = statue;

      console.log("✅ Statue loaded + ExhibitGroup ready");
    },
    undefined,
    (err) => {
      console.error("❌ Error loading statue.glb:", err);
      console.log("Check path:", STATUE_URL);
    }
  );

  return out;
};
