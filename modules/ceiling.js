import * as THREE from "three";

export const createCeiling = (scene, textureLoader) => {
  const loader = textureLoader ?? new THREE.TextureLoader();

  // ✅ 1K paths (as in your public/textures folder)
  const color = loader.load(
    "/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_Color.jpg"
  );
  const ao = loader.load(
    "/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_AmbientOcclusion.jpg"
  );
  const normal = loader.load(
    "/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_NormalGL.jpg"
  );
  const roughness = loader.load(
    "/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_Roughness.jpg"
  );

  // OPTIONAL: only if you actually have these files in the 1K folder
  // const displacement = loader.load("/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_Displacement.jpg");
  // const metalness = loader.load("/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_Metalness.jpg");
  // const emission = loader.load("/textures/OfficeCeiling005_1K-JPG/OfficeCeiling005_1K-JPG_Emission.jpg");

  // ✅ only color map is sRGB
  color.colorSpace = THREE.SRGBColorSpace;

  // Repeat tiling
  [color, ao, normal, roughness].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    t.anisotropy = 8;
  });

  // Geometry + uv2 for AO
  const ceilingGeometry = new THREE.PlaneGeometry(45, 40);
  ceilingGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(ceilingGeometry.attributes.uv.array, 2)
  );

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: color,
    aoMap: ao,
    aoMapIntensity: 1.0,
    normalMap: normal,
    roughnessMap: roughness,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceilingPlane.rotation.x = Math.PI / 2;
  ceilingPlane.position.y = 10;
  ceilingPlane.receiveShadow = true;

  scene.add(ceilingPlane);
  return ceilingPlane;
};
