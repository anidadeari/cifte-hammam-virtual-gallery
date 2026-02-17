import * as THREE from "three";
import { scene, setupScene } from "./modules/scene.js";
import { createPaintings } from "./modules/paintings.js";
import { createWalls } from "./modules/walls.js";
import { setupLighting } from "./modules/lighting.js";
import { setupFloor } from "./modules/floor.js";
import { createCeiling } from "./modules/ceiling.js";
import { createBoundingBoxes } from "./modules/boundingBox.js";
import { setupRendering } from "./modules/rendering.js";
import { setupEventListeners } from "./modules/eventListeners.js";
import { addObjectsToScene } from "./modules/sceneHelpers.js";
import { setupPlayButton, setupInfoPanelToggle } from "./modules/menu.js";
import { setupAudio } from "./modules/audioGuide.js";
import { setupVR } from "./modules/VRSupport.js";
import { loadBenchModel } from "./modules/bench.js";
import { loadCeilingLampModel } from "./modules/ceilingLamp.js";
import { loadStatueModel } from "./modules/statue.js";

// Initialize UI components
setupInfoPanelToggle();

// Initialize core Three.js components: scene, camera, and renderer
const { camera, controls, renderer } = setupScene();

// Initialize audio listener attached to the camera
setupAudio(camera);

// Initialize universal texture loader
const textureLoader = new THREE.TextureLoader();

// Construct the gallery environment: walls, floor, and ceiling
const walls = createWalls(scene, textureLoader);
setupFloor(scene, textureLoader);
createCeiling(scene, textureLoader);

// Generate the painting objects and their frames
const paintings = createPaintings(scene, textureLoader);

// Initialize scene lighting, passing paintings for shadow/light calculations
setupLighting(scene, paintings);

// Generate bounding boxes for structural and art elements to handle collisions
createBoundingBoxes(walls);
createBoundingBoxes(paintings);

// Add all generated painting objects to the scene using the helper utility
addObjectsToScene(scene, paintings);

// Configure user interface interactions and standard event listeners
setupPlayButton(controls);
setupEventListeners(controls);

// Load the central statue model and store a reference for the rotation animation
const statueRef = loadStatueModel(scene);

// Load additional 3D environmental models
loadBenchModel(scene);
loadCeilingLampModel(scene);

// Start the core rendering loop, passing necessary references for movement and animation
setupRendering(scene, camera, renderer, paintings, controls, walls, statueRef);

// Enable WebXR support for Virtual Reality experiences
setupVR(renderer);