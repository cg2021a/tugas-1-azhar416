import * as THREE from '../../JS/three.module.js';
import {OrbitControls} from '../../JS/OrbitControls.js';
import {GLTFLoader} from '../JS/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

/** 
 * lights 
 */ 
const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.set(1, 6, 5);
scene.add(direcLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 6;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true
// controls.autoRotate = true;
controls.autoRotateSpeed = 4;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;

/**
 * SceneGraph
 */ 
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

/**
 * Object
 */
let kotak1;
const loader = new GLTFLoader();
loader.load('./model/reevastory.gltf', function(gltf){
    console.log(gltf);
        const root = gltf.scene;
        scene.add(root);
        console.log(dumpObject(root).join('\n'));
        kotak1 = root.getObjectByName('Cube001');

},  
    function(xhr){
        console.log((xhr.loaded/xhr.total * 100) + "% Loaded");
},
    function(error){
        console.log('An Error Occurred');
})

/**
 * Animate
 */
const clock = new THREE.Clock();
let speed = 0.01;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    if (kotak1) {
        for (const kotak of kotak1.children) {
          kotak.rotation.y += speed;
        }
    }

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();