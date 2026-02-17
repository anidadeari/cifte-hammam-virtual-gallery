import * as THREE from "three";

export const setupFloor = (scene, textureLoader) => {
  const loader = textureLoader ?? new THREE.TextureLoader();

  const color = loader.load(
    "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K-JPG_Color.jpg"
  );
  const normal = loader.load(
    "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K-JPG_NormalGL.jpg"
  );
  const roughness = loader.load(
    "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K-JPG_Roughness.jpg"
  );
  const displacement = loader.load(
    "/textures/WoodFloor040_1K-JPG/WoodFloor040_1K-JPG_Displacement.jpg"
  );

  // ✅ vetëm color map është sRGB
  color.colorSpace = THREE.SRGBColorSpace;

  // Repeat / tiling
  [color, normal, roughness, displacement].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    t.anisotropy = 8; // optional: sharper at angles (works if renderer supports it)
  });

  // Geometry: keep it, but 256 segments can be heavy; 128 is usually enough
  const geo = new THREE.PlaneGeometry(45, 45, 128, 128);

  const mat = new THREE.MeshStandardMaterial({
    map: color,
    normalMap: normal,
    roughnessMap: roughness,
    displacementMap: displacement,
    displacementScale: 0.06, // pak më e sigurt
    metalness: 0.0,
    roughness: 1.0, // roughnessMap e kontrollon në praktikë
  });

  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.2;
  floor.receiveShadow = true;

  scene.add(floor);

  return floor;
};
