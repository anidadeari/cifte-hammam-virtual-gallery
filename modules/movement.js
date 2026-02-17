import * as THREE from "three";

export const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const PLAYER_SIZE = new THREE.Vector3(0.6, 1.7, 0.6); // ✅ më realist
const _playerBox = new THREE.Box3();
const _tmpPos = new THREE.Vector3();
const _tmpWallBox = new THREE.Box3();

export const updateMovement = (delta, controls, camera, walls) => {
  const moveSpeed = 5 * delta;
  const prev = camera.position.clone();

  if (keysPressed.ArrowRight || keysPressed.d) controls.moveRight(moveSpeed);
  if (keysPressed.ArrowLeft || keysPressed.a) controls.moveRight(-moveSpeed);
  if (keysPressed.ArrowUp || keysPressed.w) controls.moveForward(moveSpeed);
  if (keysPressed.ArrowDown || keysPressed.s) controls.moveForward(-moveSpeed);

  if (checkCollision(camera, walls)) {
    camera.position.copy(prev);
  }
};

export const checkCollision = (camera, walls) => {
  camera.getWorldPosition(_tmpPos);
  _playerBox.setFromCenterAndSize(_tmpPos, PLAYER_SIZE);

  for (const wall of walls.children) {
    // prefer precomputed bounding box
    const box = wall.BoundingBox || wall.userData?.boundingBox;

    if (box) {
      if (_playerBox.intersectsBox(box)) return true;
    } else {
      // fallback (slower, but safe)
      _tmpWallBox.setFromObject(wall);
      if (_playerBox.intersectsBox(_tmpWallBox)) return true;
    }
  }

  return false;
};
