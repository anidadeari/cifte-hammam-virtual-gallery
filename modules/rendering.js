import * as THREE from "three";
import { displayPaintingInfo, hidePaintingInfo } from "./paintingInfo.js";
import { updateMovement } from "./movement.js";

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls,
  statueRef
) => {
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ✅ Toggle statue rotation with L
  let rotateStatue = true;

  function onKeyDown(e) {
    // L / l
    if (e.key === "l" || e.key === "L") {
      rotateStatue = !rotateStatue;
      console.log("Statue rotation:", rotateStatue ? "ON" : "OFF");
    }
  }
  window.addEventListener("keydown", onKeyDown);

  function setMouseFromEvent(e) {
    if (controls?.isLocked) {
      mouse.set(0, 0);
      return;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function pickPainting(e) {
    setMouseFromEvent(e);
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(paintings, true);

    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj && !obj.userData?.info && obj.parent) obj = obj.parent;

      if (obj?.userData?.info) {
        displayPaintingInfo(obj.userData.info);
        return;
      }
    }

    hidePaintingInfo();
  }

  renderer.domElement.addEventListener("pointerdown", pickPainting, false);

  function render() {
    const delta = clock.getDelta();

    updateMovement(delta, controls, camera, walls);

    // ✅ statue animation (slow rotate) + toggle by L
    if (rotateStatue && statueRef?.statue) {
      statueRef.statue.rotation.y += delta * 0.25;
    }

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);
};
