import * as THREE from "three";

export function createWalls(scene, textureLoader) {
  const loader = textureLoader ?? new THREE.TextureLoader();

  const wallGroup = new THREE.Group();
  scene.add(wallGroup);

  // Textures (correct paths)
  const colorTex = loader.load("/textures/leather_white_diff_1k.jpg");
  const normalTex = loader.load("/textures/leather_white_nor_gl_1k.png");
  const roughTex = loader.load("/textures/leather_white_rough_1k.png");

  // Only albedo/diffuse is sRGB
  colorTex.colorSpace = THREE.SRGBColorSpace;

  // ✅ Less aggressive tiling + better filtering to reduce shimmer
  [colorTex, normalTex, roughTex].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 2);          // was (6,2) -> less repetition + less noise
    t.anisotropy = 16;           // sharper at grazing angles (if supported)
  });

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: colorTex,
    normalMap: normalTex,
    roughnessMap: roughTex,
    metalness: 0.0,
    roughness: 0.9,              // ✅ slightly less "plastic" / reduces highlight noise
    side: THREE.DoubleSide,
  });

  // ✅ Reduce normal strength (this is the big "sparkle" fix)
  wallMaterial.normalScale = new THREE.Vector2(0.35, 0.35);

  // Geometry
  const W = 40;
  const H = 20;

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMaterial);
  frontWall.position.set(0, 0, -20);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMaterial);
  backWall.position.set(0, 0, 20);
  backWall.rotation.y = Math.PI;

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMaterial);
  leftWall.position.set(-20, 0, 0);
  leftWall.rotation.y = Math.PI / 2;

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMaterial);
  rightWall.position.set(20, 0, 0);
  rightWall.rotation.y = -Math.PI / 2;

  // Shadows
  [frontWall, backWall, leftWall, rightWall].forEach((w) => {
    w.receiveShadow = true;
  });

  wallGroup.add(frontWall, backWall, leftWall, rightWall);
  return wallGroup;
}
