import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadBenchModel = (scene) => {
  const loader = new GLTFLoader();

  // ✅ Vite-safe path (punon edhe kur e hoston me /3D-art-gallery/)
  const RAW_BASE = import.meta.env.BASE_URL;
  const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";
  const BENCH_URL = `${BASE}models/bench.glb`;

  // ✅ duhet me u pershtat me floor.y te projektit tend
  const FLOOR_Y = -3.2;

  loader.load(
    BENCH_URL,
    (gltf) => {
      const benchRoot = gltf.scene;

      // ✅ shadows + mos i prishe materialet e modelit
      benchRoot.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          c.frustumCulled = false;
          if (c.material) c.material.needsUpdate = true;
        }
      });
// ✅ Soft fill lights për benches (që mos të duken të errëta)
const benchFill1 = new THREE.PointLight(0xffffff, 0.9, 18);
benchFill1.position.set(-8, 4.5, 6);   // mbi/para bench-it majtas
scene.add(benchFill1);

const benchFill2 = new THREE.PointLight(0xffffff, 0.9, 18);
benchFill2.position.set(8, 4.5, 6);    // mbi/para bench-it djathtas
scene.add(benchFill2);

      // -----------------------
      // ✅ FUNKSION: krijon 1 bench me pozicion/scale/rotation
      // -----------------------
      function makeBench({ x, z, rotY, scale = 1.0 }) {
        const b = benchRoot.clone(true);

        // clone material (që të mos ndajë të njëjtin material mes dy benches)
        b.traverse((c) => {
          if (!c.isMesh) return;
        
          c.castShadow = true;
          c.receiveShadow = true;
          c.frustumCulled = false;
        
          if (!c.material) return;
        
          const mats = Array.isArray(c.material) ? c.material : [c.material];
        
          mats.forEach((m) => {
            // clone material (mos ndajnë të njëjtin material)
            m = m.clone();
        
            // ✅ rrite pak ndriçimin e ngjyrës (ruan teksturën)
            if (m.color) m.color.multiplyScalar(1.35);
        
            // ✅ pak emissive që të mos duket i “zi” në hije
            if ("emissive" in m) {
              m.emissive = new THREE.Color(0xffffff);
              m.emissiveIntensity = 0.12; // provoj 0.04–0.12
            }
        
            // ✅ pak më pak roughness që të kapë dritë
            if ("roughness" in m) m.roughness = Math.min(0.85, m.roughness ?? 0.85);
        
            m.needsUpdate = true;
          });
        
          // rikthe array/single
          c.material = Array.isArray(c.material) ? mats : mats[0];
        });
        

        b.scale.setScalar(scale);
        b.rotation.y = rotY;

        // vendosja fillestare
        b.position.set(x, 0, z);

        // ✅ vendose sakt mbi dysheme (auto align)
        b.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(b);
        const minY = box.min.y;
        b.position.y += (FLOOR_Y - minY);

        scene.add(b);
        return b;
      }

      // -----------------------
      // ✅ 2 benches: majtas + djathtas
      // -----------------------
      const SCALE = 2.2;
const X_OFFSET = 6.8;            // ✅ më afër qendrës (ishte 10)
const Z_POS = 2.8;               // ✅ pak më afër statujës (ishte 3.5)
const ANGLE = THREE.MathUtils.degToRad(22); // ✅ pak më të kthyera nga statuja


      // Majtas
      makeBench({
        x: -X_OFFSET,
        z: Z_POS,
        rotY: Math.PI / 2 - ANGLE,
        scale: SCALE,
      });

      // Djathtas
      makeBench({
        x: X_OFFSET,
        z: Z_POS,
        rotY: -Math.PI / 2 + ANGLE,
        scale: SCALE,
      });

      console.log("✅ bench.glb loaded + 2 benches placed");
    },
    undefined,
    (err) => {
      console.error("❌ Error loading bench.glb:", err);
      console.log("Check path:", BENCH_URL);
    }
  );
};
