import * as THREE from "three";
import { paintingData } from "./paintingData.js";

const BASE = import.meta.env.BASE_URL;
const FRAME_TEX = `${BASE}img/frame.jpg`; // public/img/frame.jpg

function loadSRGB(loader, url) {
  const t = loader.load(
    url,
    () => console.log("✅ OK texture:", url),
    undefined,
    () => console.error("❌ FAILED texture:", url)
  );
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createPaintings(scene, textureLoader) {
  const paintings = [];

  // ✅ load frame texture once
  const frameTexture = loadSRGB(textureLoader, FRAME_TEX);
  frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
  frameTexture.repeat.set(1, 1);

  const frameMaterial = new THREE.MeshStandardMaterial({
    map: frameTexture,
    roughness: 0.7,
    metalness: 0.0,
    color: 0xffffff,
  });

  paintingData.forEach((data) => {
    // =========================
    // PAINTING (canvas)
    // =========================
    const artTexture = loadSRGB(textureLoader, data.imgSrc);

    const paintingMaterial = new THREE.MeshStandardMaterial({
      map: artTexture,
      roughness: 0.85,
      metalness: 0.0,
      color: 0xffffff,
    });

    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(data.width, data.height),
      paintingMaterial
    );

    painting.position.set(data.position.x, data.position.y, data.position.z);
    painting.rotation.y = data.rotationY;

    painting.userData = {
      type: "painting",
      info: structuredClone ? structuredClone(data.info) : { ...data.info },
    };

    painting.castShadow = true;
    painting.receiveShadow = true;

  // =========================
// FRAME (4 bars) using frame.jpg
// =========================
const border = data.frameBorder ?? 0.22;   // sa e trashë është korniza (anash)
const depth  = data.frameDepth ?? 0.10;    // sa del korniza nga muri
const gap    = data.zOffset ?? 0.06;       // sa del piktura përpara kornizës

const w = data.width;
const h = data.height;

// Material për frame: përdor frame.jpg
const frameMat = frameMaterial; // e ke krijuar më lart (me frame.jpg)

// Krijo grupin e kornizës
const frameGroup = new THREE.Group();
frameGroup.name = "FrameGroup";

// Top bar
const top = new THREE.Mesh(
  new THREE.BoxGeometry(w + border, border, depth),
  frameMat
);
top.position.set(0, h / 2 + border / 2, 0);

// Bottom bar
const bottom = new THREE.Mesh(
  new THREE.BoxGeometry(w + border, border, depth),
  frameMat
);
bottom.position.set(0, -h / 2 - border / 2, 0);

// Left bar
const left = new THREE.Mesh(
  new THREE.BoxGeometry(border, h, depth),
  frameMat
);
left.position.set(-w / 2 - border / 2, 0, 0);

// Right bar
const right = new THREE.Mesh(
  new THREE.BoxGeometry(border, h, depth),
  frameMat
);
right.position.set(w / 2 + border / 2, 0, 0);

[top, bottom, left, right].forEach((m) => {
  m.castShadow = true;
  m.receiveShadow = true;
});

frameGroup.add(top, bottom, left, right);

// Vendose frameGroup në vendin e pikturës + rotacion
frameGroup.position.copy(painting.position);
frameGroup.rotation.copy(painting.rotation);

// shtyje frame mbrapa pikturës (pas saj), sipas normalit
const normal = new THREE.Vector3(0, 0, 1).applyEuler(painting.rotation);
frameGroup.position.addScaledVector(normal, -gap);

// Shto në scene
scene.add(frameGroup);

    scene.add(painting);

    // Keep clickHandling working: only paintings go into array
    paintings.push(painting);
  });

  return paintings;
}
